import { AutoTokenizer, env } from "@xenova/transformers";

// https://huggingface.co/docs/transformers.js/api/models#module_models.CLIPTextModelWithProjection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ClipTokenizer(text: string): Promise<any> {
  // https://github.com/xenova/transformers.js/issues/366
  env.allowLocalModels = false;
  env.useBrowserCache = false;

  // Load tokenizer and text model
  const tokenizer = await AutoTokenizer.from_pretrained(
    "Xenova/clip-vit-base-patch16",
  );

  // Run tokenization
  const formatted = text.replace(/{|}|[|]/g, "");
  const text_inputs = tokenizer(formatted, { padding: true, truncation: true });

  return text_inputs;
}
