import { z } from "zod";

export interface ImageResolution {
  name: string;
  width: number;
  height: number;
  excludes: string[];
}

export const ImageResolutions = [
  {
    name: "Wallpaper_Portrait",
    width: 1088,
    height: 1920,
    excludes: [],
  },
  {
    name: "Wallpaper_Landscape",
    width: 1920,
    height: 1088,
    excludes: [],
  },
  {
    name: "v1_Normal_Portrait",
    width: 512,
    height: 768,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Normal_Landscape",
    width: 768,
    height: 512,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Normal_Square",
    width: 640,
    height: 640,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Large_Portrait",
    width: 832,
    height: 1216,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Large_Landscape",
    width: 1216,
    height: 832,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Large_Square",
    width: 1024,
    height: 1024,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Large+_Portrait",
    width: 1024,
    height: 1536,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Large+_Landscape",
    width: 1536,
    height: 1024,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v1_Large+_Square",
    width: 1472,
    height: 1472,
    excludes: ["nai-diffusion-2", "nai-diffusion-3"],
  },
  {
    name: "v2v3_Small_Portrait",
    width: 512,
    height: 768,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Smalll_Landscape",
    width: 768,
    height: 512,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Small_Square",
    width: 640,
    height: 640,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Normal_Portrait",
    width: 832,
    height: 1216,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Normal_Landscape",
    width: 1216,
    height: 832,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Normal_Square",
    width: 1024,
    height: 1024,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Large_Portrait",
    width: 1024,
    height: 1536,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Large_Landscape",
    width: 1536,
    height: 1024,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
  {
    name: "v2v3_Large_Square",
    width: 1472,
    height: 1472,
    excludes: ["nai-diffusion", "safe-diffusion", "nai-diffusion-furry"],
  },
];

interface UCPresets {
  Preset_Low_Quality_Bad_Anatomy: number;
  Preset_Low_Quality: number;
  Preset_Bad_Anatomy: number;
  Preset_None: number;
  Preset_Heavy: number;
  Preset_Light: number;
}

export const UCPresetsEnum: UCPresets = {
  Preset_Low_Quality_Bad_Anatomy: 0,
  Preset_Low_Quality: 1,
  Preset_Bad_Anatomy: 2,
  Preset_None: 3,
  Preset_Heavy: 4,
  Preset_Light: 5,
};

const UCPresetsKeys: Array<keyof UCPresets> = Object.keys(
  UCPresetsEnum,
) as Array<keyof UCPresets>;
const UCPresetsValues: number[] = UCPresetsKeys.map(
  (key) => UCPresetsEnum[key],
);

export const AiGenerateUCPresetSchema = z
  .number()
  .lte(Math.max(...UCPresetsValues))
  .nullable();

export type AiGenerateUCPreset = z.infer<typeof AiGenerateUCPresetSchema>;

export enum ImageSamplersEnum {
  k_lms = "k_lms",
  k_euler = "k_euler",
  k_euler_ancestral = "k_euler_ancestral",
  k_heun = "k_heun",
  plms = "plms", // doesn't work
  ddim = "ddim",
  ddim_v3 = "ddim_v3",
  nai_smea = "nai_smea", // doesn't work
  nai_smea_dyn = "nai_smea_dyn",
  k_dpmpp_2m = "k_dpmpp_2m",
  k_dpmpp_2s_ancestral = "k_dpmpp_2s_ancestral",
  k_dpmpp_sde = "k_dpmpp_sde",
  k_dpm_2 = "k_dpm_2",
  k_dpm_2_ancestral = "k_dpm_2_ancestral",
  k_dpm_adaptive = "k_dpm_adaptive",
  k_dpm_fast = "k_dpm_fast",
}

export const AiGenerateImageSamplerSchema = z.nativeEnum(ImageSamplersEnum);

export type AiGenerateImageSampler = z.infer<
  typeof AiGenerateImageSamplerSchema
>;

export enum ControlNetModelsEnum {
  Palette_Swap = "hed",
  Form_Lock = "midas",
  Scribbler = "fake_scribble",
  Building_Control = "mlsd",
  Landscaper = "uniformer",
}

export const AiGenerateControlNetModelSchema =
  z.nativeEnum(ControlNetModelsEnum);

export type AiGenerateControlNetModel = z.infer<
  typeof AiGenerateControlNetModelSchema
>;

function getMaxNSamples(w: number, h: number): number {
  const r = w * h;
  if (r <= 512 * 704) return 8;
  if (r <= 640 * 640) return 6;
  if (r <= 512 * 2560) return 4;
  if (r <= 1024 * 1536) return 2;
  if (r <= 1024 * 3072) return 1;
  return 0;
}

// Reference: https://github.com/Aedial/novelai-api/blob/main/novelai_api/ImagePreset.py#L140
export const AiGenerateImageParametersSchema = z
  .object({
    legacy: z.boolean(), // ??? default false
    qualityToggle: z.boolean(), // https://docs.novelai.net/image/qualitytags.html
    width: z.number().int(), // Width of Image Resolution
    height: z.number().int(), // Height of Image Resolution
    ucPreset: AiGenerateUCPresetSchema, // Default UC to prepend to the UC
    n_samples: z.number().int(), // Number of images to return
    seed: z.number().int().min(0).max(9999999999), // Random seed to use for the image. The ith image has seed + i for seed
    sampler: AiGenerateImageSamplerSchema, // https://docs.novelai.net/image/sampling.html
    noise: z.number().min(0).max(0.99).optional(), // https://docs.novelai.net/image/strengthnoise.html
    strength: z.number().min(0.01).max(0.99).optional(), // https://docs.novelai.net/image/strengthnoise.html
    scale: z.number().min(0).max(10), // https://docs.novelai.net/image/stepsguidance.html (scale is called Prompt Guidance)
    uncond_scale: z.number().min(0).max(1.5), // strength of negative prompt
    steps: z.number().int().min(1).max(50), // https://docs.novelai.net/image/stepsguidance.html
    negative_prompt: z.string().min(0).max(40000), // https://docs.novelai.net/image/undesiredcontent.html
    sm: z.boolean(), // Enable SMEA for any sampler (makes Large+ generations manageable)
    sm_dyn: z.boolean(), // Enable SMEA DYN for any sampler if SMEA is enabled (best for Large+, but not Wallpaper resolutions)
    image: z.string().optional(), // b64-encoded png image for img2img
    controllnet_condition: z.string().optional(), // Controlnet mask gotten by the generate_controlnet_mask method
    controllnet_model: AiGenerateControlNetModelSchema.optional(), // Model to use for the controlnet
    controlnet_strength: z.number(), // Influence of the chosen controlnet on the image
    dynamic_thresholding: z.boolean(), // Reduce the deepfrying effects of high scale (https://twitter.com/Birchlabs/status/1582165379832348672)
    add_original_image: z.boolean(), // Prevent seams along the edges of the mask, but may change the image slightly
    mask: z.string().optional(), //  Mask for inpainting (b64-encoded black and white png image, white is the inpainting area)
    cfg_rescale: z.number().min(0).max(1), // https://docs.novelai.net/image/stepsguidance.html#prompt-guidance-rescale
    noise_schedule: z.enum([
      "native",
      "karras",
      "exponential",
      "polyexponential",
    ]), // ?
  })
  .refine(
    (params) =>
      ImageResolutions.some(
        (img) => img.width === params.width && img.height === params.height,
      ),
    {
      path: ["width", "height"],
      message: "ImageResolution is not matched.",
    },
  )
  .refine(
    (params) => params.n_samples <= getMaxNSamples(params.width, params.height),
    {
      path: ["n_samples"],
      message: "Too many samples to generate, reduce image size.",
    },
  );

export type AiGenerateImageParameters = z.infer<
  typeof AiGenerateImageParametersSchema
>;

export const DefaultAiGenerateImageParameters: AiGenerateImageParameters = {
  legacy: false,
  qualityToggle: true,
  width: ImageResolutions[14].width,
  height: ImageResolutions[14].height,
  ucPreset: UCPresetsEnum.Preset_Low_Quality_Bad_Anatomy,
  n_samples: 1,
  seed: 0,
  sampler: ImageSamplersEnum.k_euler,
  steps: 28,
  scale: 5,
  uncond_scale: 1,
  negative_prompt: "",
  sm: false,
  sm_dyn: false,
  dynamic_thresholding: false,
  controlnet_strength: 1,
  add_original_image: false,
  cfg_rescale: 0,
  noise_schedule: "native",
};

export interface AiGenerateImageModel {
  name: string;
  label: string;
  legacy: boolean;
  inpainting: boolean;
  default: boolean;
}

export const AiGenerateImageModels: AiGenerateImageModel[] = [
  {
    name: "nai-diffusion",
    label: "NAI Diffusion Anime V1",
    legacy: true,
    inpainting: false,
    default: true,
  },
  {
    name: "safe-diffusion",
    label: "Safe Diffusion Anime V1",
    legacy: true,
    inpainting: false,
    default: true,
  },
  {
    name: "nai-diffusion-furry",
    label: "NAI Diffusion Furry",
    legacy: true,
    inpainting: false,
    default: true,
  },
  {
    name: "custom",
    label: "Custom",
    legacy: true,
    inpainting: false,
    default: false,
  },
  {
    name: "nai-diffusion-inpainting",
    label: "NAI Diffusion Anime Inpainting",
    legacy: true,
    inpainting: true,
    default: true,
  },
  {
    name: "nai-diffusion-3-inpainting",
    label: "NAI Diffusion Anime V3 Inpainting",
    legacy: false,
    inpainting: true,
    default: true,
  },
  {
    name: "safe-diffusion-inpainting",
    label: "Safe Diffusion Anime V1 Inpainting",
    legacy: true,
    inpainting: true,
    default: true,
  },
  {
    name: "furry-diffusion-inpainting",
    label: "NAI Diffusion Furry Inpainting",
    legacy: true,
    inpainting: true,
    default: true,
  },
  {
    name: "kandinsky-vanilla",
    label: "Kandinsky Vanilla",
    legacy: true,
    inpainting: false,
    default: false,
  },
  {
    name: "nai-diffusion-2",
    label: "NAI Diffusion Anime V2",
    legacy: true,
    inpainting: false,
    default: true,
  },
  {
    name: "nai-diffusion-3",
    label: "NAI Diffusion Anime V3",
    legacy: false,
    inpainting: false,
    default: true,
  },
] as const;

const models_enum: readonly [string, ...string[]] = [
  AiGenerateImageModels[0].name,
  ...AiGenerateImageModels.filter((_m, index) => index > 0).map((m) => m.name),
];

export const AiGenerateImageRequestSchema = z
  .object({
    input: z.string().min(1).max(40000),
    model: z.enum(models_enum),
    action: z.enum(["generate", "img2img", "infill"]),
    parameters: AiGenerateImageParametersSchema,
    url: z
      .string()
      .regex(
        /https:\/\/[0-9a-z\-_]*\.tenant-novelai\.knative\.(chi\.coreweave\.com|[0-9a-z]+\.coreweave\.cloud)\/.*/,
      )
      .optional(),
  })
  .refine(
    (params) =>
      params.model !== "nai-diffusion-3" &&
      params.parameters.sampler === ImageSamplersEnum.ddim_v3,
    {
      path: ["model", "params"],
      message: "ddim_v3 only works with nai-diffusion-3",
    },
  );

export type AiGenerateImageRequest = z.infer<
  typeof AiGenerateImageRequestSchema
>;

export const DefaultAiGenerateImageOptions: AiGenerateImageRequest = {
  input: "",
  model: "nai-diffusion-3",
  action: "generate",
  parameters: DefaultAiGenerateImageParameters,
};
