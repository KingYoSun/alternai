import { NovelAiApi } from "shared";
import AdmZip from "adm-zip";
import { type ApiResponseBody } from "shared/types/Api";
import { Buffer } from "buffer";
import type RedisCli from "../client/redis";
import { type Settings } from "shared/types/Settings";

const API_HOST = "https://api.novelai.net";
const MAX_FILENAME_LEN = 50;

const REDIS_KEY = "alternai:settings";

interface Props {
  redis: RedisCli;
  options: NovelAiApi.AiGenerateImageRequest;
}

export default async function AiGenerateImageRequest({
  redis,
  options,
}: Props): Promise<ApiResponseBody> {
  if (
    options.parameters.sampler === NovelAiApi.ImageSamplers.DDIM.name &&
    options.model === "nai-diffusion-3"
  ) {
    options.parameters.sampler = NovelAiApi.ImageSamplers.DDIM_V3.name;
  }

  let res: ApiResponseBody;

  await redis.init();
  const settings = await redis.get(REDIS_KEY);

  if (settings === null)
    return {
      status: 500,
      message: "NovelAI Token is not set",
    };

  const parsed = JSON.parse(settings) as Settings;
  const NAI_API_TOKEN = parsed.NAI_API_TOKEN;

  const endpoint = "/ai/generate-image";
  const apiRes = await fetch(`${API_HOST}${endpoint}`, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NAI_API_TOKEN}`,
    },
    body: JSON.stringify(options),
  });
  if (apiRes.type !== "basic") {
    res = {
      status: 500,
      message: JSON.stringify(apiRes.body),
    };
    return res;
  }

  const arrayBuffer = await apiRes.arrayBuffer();
  const zip = new AdmZip(Buffer.from(arrayBuffer));
  const entries = zip.getEntries();

  const baseFilename =
    options.input.length <= MAX_FILENAME_LEN
      ? options.input
      : options.input.substring(0, MAX_FILENAME_LEN);

  let base64Image!: string;
  await Promise.all(
    entries.map((entry, index) => {
      const newFilename = `${baseFilename}_${index}_${new Date().getTime()}.png`;
      zip.extractEntryTo(
        entry.name,
        "/output/",
        false,
        true,
        false,
        newFilename,
      );

      const imageBuff = zip.readFile(entry);
      if (imageBuff === null) return "failed";

      base64Image = "data:image/png;base64," + imageBuff.toString("base64");
      return "succeeded";
    }),
  );

  res = {
    status: 200,
    message: base64Image,
  };
  return res;
}
