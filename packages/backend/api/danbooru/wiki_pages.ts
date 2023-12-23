import { wikiPages } from "../../db/schema/images.ts";
import { sql, type InferInsertModel, desc } from "drizzle-orm";
import type RedisCli from "../../client/redis.ts";
import type MySQLCli from "../../client/mysql.ts";
import { type ApiResponseBody } from "shared/types/Api.ts";

type WikiPage = InferInsertModel<typeof wikiPages>;

const REDIS_KEY = "banb:wikiPages";

const credential = Buffer.from(
  `${process.env.DANBOORU_USERNAME}:${process.env.DANBOORU_APIKEY}`,
).toString("base64");

async function fetchBooru(page: number): Promise<WikiPage[]> {
  const query = `search[is_deleted]=false&limit=50&page=${String(page)}`;
  const res = await fetch(
    `https://danbooru.donmai.us/wiki_pages.json?${query}`,
    {
      headers: {
        "Content-Type": "applicatio/x-www-form-urlencoded",
        Authorization: `Basic ${credential}`,
      },
    },
  );

  const body = await res.json();

  if (res.status !== 200) throw new Error(JSON.stringify(body));
  const resWikiPages: WikiPage[] = body
    .filter((t) => t.title.length < 255)
    .map((t) => {
      t.createdAt = new Date(t.created_at);
      t.updatedAt = new Date(t.updated_at);
      t.otherNames = t.other_names;
      t.isDeleted = t.is_deleted;

      return t as WikiPage;
    });
  return resWikiPages;
}

export default async function DanbWikiPages(
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

    const lastUpdatedWikiPage: WikiPage[] = await mysql.client
      .select()
      .from(wikiPages)
      .orderBy(desc(wikiPages.updatedAt))
      .limit(1);
    const lastUpdatedAt = lastUpdatedWikiPage[0].updatedAt;

    const startTime: number = new Date().getTime();
    let timeDiff: number = 0;

    while (
      timeDiff / (60 * 1000) <
      execMinutes // minute単位
    ) {
      const resWikiPages: WikiPage[] = await fetchBooru(page).catch((e) => {
        throw new Error(e);
      });

      if (resWikiPages.length === 0) {
        console.log("Empty response!");
        page = page + 1;
        await redis.set({ key: `${REDIS_KEY}:lastPage`, value: String(page) });
        break;
      }
      await mysql.client
        .insert(wikiPages)
        .values(resWikiPages)
        .onDuplicateKeyUpdate({
          set: {
            isDeleted: sql`VALUES(is_deleted)`,
            otherNames: sql`VALUES(other_names)`,
            updatedAt: sql`VALUES(updated_at)`,
          },
        });

      const lastWikiPage = resWikiPages[resWikiPages.length - 1];

      if (
        (lastUpdatedAt?.getTime() ?? 0) -
          (lastWikiPage.updatedAt?.getTime() ?? new Date().getTime()) >=
        0
      ) {
        await redis.set({ key: `${REDIS_KEY}:lastPage`, value: "1" });
        break;
      } else {
        page = page + 1;
        await redis.set({ key: `${REDIS_KEY}:lastPage`, value: String(page) });
        timeDiff = new Date().getTime() - startTime;
      }

      page = page + 1;
      await redis.set({ key: `${REDIS_KEY}:lastPage`, value: String(page) });
      timeDiff = new Date().getTime() - startTime;
    }

    console.log(`finished Page: ${page}`);
    return {
      status: 200,
      message: "finished!",
    };
  } catch (e) {
    console.log("index wikiPages failed!" + e);
    return {
      status: 500,
      message: JSON.stringify(e),
    };
  }
}
