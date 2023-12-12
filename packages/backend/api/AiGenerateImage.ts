import { NovelAiApi } from "shared";
import AdmZip from "adm-zip";
import { type ApiResponseBody } from "shared/types/Api";
import { Buffer } from "buffer";

const API_HOST = "https://api.novelai.net";
const MAX_FILENAME_LEN = 50;

export default async function AiGenerateImageRequest(
  options: NovelAiApi.AiGenerateImageRequest,
): Promise<ApiResponseBody> {
  console.log("Generating image is started");
  if (
    options.parameters.sampler === NovelAiApi.ImageSamplers.DDIM.name &&
    options.model === "nai-diffusion-3"
  ) {
    options.parameters.sampler = NovelAiApi.ImageSamplers.DDIM_V3.name;
  }

  let res: ApiResponseBody;
  const endpoint = "/ai/generate-image";
  const apiRes = await fetch(`${API_HOST}${endpoint}`, {
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
