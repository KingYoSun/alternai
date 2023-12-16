import type RedisCli from "../client/redis.ts";
import { type ApiResponseBody } from "shared/types/Api.ts";
import { type Settings } from "shared/types/Settings.ts";

const API_HOST = "https://api.novelai.net";
const REDIS_KEY = "alternai:settings";

interface Props {
  redis: RedisCli;
}

export default async function getUserData({
  redis,
}: Props): Promise<ApiResponseBody> {
  const endpoint = "/user/data";

  const settings = await redis.get(REDIS_KEY);

  if (settings === null)
    return {
      status: 500,
      message: "NovelAI Token is not set",
    };

  const parsed = JSON.parse(settings) as Settings;
  const NAI_API_TOKEN = parsed.NAI_API_TOKEN;

  const apiRes = await fetch(`${API_HOST}${endpoint}`, {
    method: "GET",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NAI_API_TOKEN}`,
    },
  });

  let message!: string;
  if (apiRes.status !== 200) {
    message = await apiRes.text();
    return {
      status: apiRes.status,
      message,
    };
  } else {
    message = await apiRes.json();
    return {
      status: 200,
      message: JSON.stringify(message),
    };
  }
}
