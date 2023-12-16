import {
  AutoTokenizer,
  type PreTrainedTokenizer,
  env,
} from "@xenova/transformers";

export interface Tokenized {
  data: BigInt64Array;
  dims: number[];
  type: string;
  size: number;
}

// https://huggingface.co/docs/transformers.js/api/models#module_models.CLIPTextModelWithProjection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class TokenizerCli {
  tokenizer!: PreTrainedTokenizer;
  model: string;
  downloaded: boolean;

  constructor() {
    this.model = "Xenova/clip-vit-base-patch16";
    this.downloaded = false;
  }

  async init() {
    if (this.downloaded) return;

    // https://github.com/xenova/transformers.js/issues/366
    env.allowLocalModels = false;
    env.useBrowserCache = false;

    this.tokenizer = await AutoTokenizer.from_pretrained(this.model);
    this.downloaded = true;
  }

  async tokenize(text: string): Promise<Tokenized> {
    await this.init();
    const formatted = text.replace(/{|}|[|]/g, "");
    const { input_ids } = this.tokenizer(formatted, {
      padding: true,
      truncation: true,
    });

    return input_ids;
  }
}
