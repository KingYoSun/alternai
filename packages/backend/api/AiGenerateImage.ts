import { NovelAiApi } from "shared";
import fs from "fs";
import AdmZip from "adm-zip";
import { ApiResponseBody } from "shared/types/Api";

const API_HOST = "https://api.novelai.net";
const MAX_FILENAME_LEN = 50;

export default async function AiGenerateImageRequest(
  options: NovelAiApi.AiGenerateImageRequest,
): Promise<ApiResponseBody> {
  const endpoint = "/ai/generate-image";
  const res = await fetch(`${API_HOST}${endpoint}`, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NAI_API_TOKEN}`,
    },
    body: JSON.stringify(options),
  });
  if (res.type !== "basic") {
    return {
      status: 500,
      message: JSON.stringify(res.body),
    } as ApiResponseBody;
  }

  const arrayBuffer = await res.arrayBuffer();
  const zip = await new AdmZip(Buffer.from(arrayBuffer));
  const entries = zip.getEntries();

  const baseFilename =
    options.input.length <= MAX_FILENAME_LEN
      ? options.input
      : options.input.substring(0, MAX_FILENAME_LEN);
  await Promise.all(
    entries.map((entry, index) => {
      const newFilename = `${baseFilename}_${index}.png`;
      zip.extractEntryTo(
        entry.name,
        "/output/",
        false,
        true,
        false,
        newFilename,
      );
    }),
  );

  return {
    status: 200,
    message: "Finished generating image.",
  } as ApiResponseBody;
}
