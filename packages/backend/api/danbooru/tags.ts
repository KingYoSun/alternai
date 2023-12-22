import { tags } from "../../db/schema/images.ts";
import { sql, type InferInsertModel, desc } from "drizzle-orm";
import type RedisCli from "../../client/redis.ts";
import type MySQLCli from "../../client/mysql.ts";
import { type ApiResponseBody } from "shared/types/Api.ts";

type Tag = InferInsertModel<typeof tags>;

const REDIS_KEY = "banb:tags";

const credential = Buffer.from(
  `${process.env.DANBOORU_USERNAME}:${process.env.DANBOORU_APIKEY}`,
).toString("base64");

async function fetchBooru(page: number): Promise<Tag[]> {
  const query = `limit=200&page=${String(page)}`;
  const res = await fetch(`https://danbooru.donmai.us/tags.json?${query}`, {
    headers: {
      "Content-Type": "applicatio/x-www-form-urlencoded",
      Authorization: `Basic ${credential}`,
    },
  });

  const body = await res.json();

  if (res.status !== 200) throw new Error(JSON.stringify(body));
  const resTags: Tag[] = body
    .filter((t) => t.name.length < 255)
    .map((t) => {
      t.category = tags.category.enumValues[t.category as number];
      t.createdAt = new Date(t.created_at);
      t.updatedAt = new Date(t.updated_at);
      t.postCount = Number(t.post_count);

      return t as Tag;
    });
  return resTags;
}

export default async function DanbTags(
  redis: RedisCli,
  mysql: MySQLCli,
  resetPage: boolean,
  execMinutes: number,
): Promise<ApiResponseBody> {
  try {
    let page: number = 1;
    if (resetPage) {
      await redis.set({ key: `${REDIS_KEY}:lastPage`, value: "1" });
    } else {
      page = Number(await redis.get(`${REDIS_KEY}:lastPage`));
      if (page >= 1000) {
        await redis.set({ key: `${REDIS_KEY}:lastPage`, value: "1" });
        page = 1;
      }
    }

    const lastUpdatedTag: Tag[] = await mysql.client
      .select()
      .from(tags)
      .orderBy(desc(tags.updatedAt))
      .limit(1);
    const lastUpdatedAt = lastUpdatedTag[0].updatedAt;
    const startTime: number = new Date().getTime();
    let timeDiff: number = 0;

    while (
      timeDiff / (60 * 1000) <
      execMinutes // minute単位
    ) {
      const resTags: Tag[] = await fetchBooru(page).catch((e) => {
        throw new Error(e);
      });

      await mysql.client
        .insert(tags)
        .values(resTags)
        .onDuplicateKeyUpdate({
          set: {
            postCount: sql`VALUES(post_count)`,
            createdAt: sql`VALUES(created_at)`,
            updatedAt: sql`VALUES(updated_at)`,
          },
        });

      const lastTag = resTags[resTags.length - 1];

      if (
        (lastUpdatedAt?.getTime() ?? 0) -
          (lastTag.updatedAt?.getTime() ?? new Date().getTime()) >=
        0
      ) {
        await redis.set({ key: `${REDIS_KEY}:lastPage`, value: "1" });
        break;
      } else {
        page = page + 1;
        await redis.set({ key: `${REDIS_KEY}:lastPage`, value: String(page) });
        timeDiff = new Date().getTime() - startTime;
      }
    }

    console.log(`finished Page: ${page}`);
    return {
      status: 200,
      message: "finished!",
    };
  } catch (e) {
    console.log("index tags failed!" + e);
    return {
      status: 500,
      message: JSON.stringify(e),
    };
  }
}
