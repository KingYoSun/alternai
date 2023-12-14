import { type ApiResponseBody } from "shared/types/Api";
import type RedisCli from "../client/redis";
import { type Settings } from "shared/types/Settings";

const REDIS_KEY = "alternai:settings";

interface GetProps {
  redis: RedisCli;
}

export async function SettingsGetRequest({
  redis,
}: GetProps): Promise<ApiResponseBody> {
  await redis.init();
  const settings = await redis.get(REDIS_KEY);

  const res: ApiResponseBody = {
    status: typeof settings === "string" ? 200 : 404,
    message: typeof settings === "string" ? settings : "Not Found",
  };

  return res;
}

interface PutProps {
  redis: RedisCli;
  settings: Settings;
}

export async function SettingsPutRequst({
  redis,
  settings,
}: PutProps): Promise<ApiResponseBody> {
  let res!: ApiResponseBody;
  try {
    await redis.init();

    const existSettings = await redis.get(REDIS_KEY);

    let updateSettings!: Settings;

    if (typeof existSettings === "string") {
      const parsed = JSON.parse(existSettings) as Settings;
      updateSettings = { ...parsed, ...settings };
    } else {
      updateSettings = { ...settings };
    }

    console.log(`settings: ${JSON.stringify(updateSettings)}`);
    await redis.set({ key: REDIS_KEY, value: JSON.stringify(updateSettings) });

    res = {
      status: 200,
      message: JSON.stringify(updateSettings),
    };
  } catch (e) {
    res = {
      status: 500,
      message: e,
    };
  }

  return res;
}
