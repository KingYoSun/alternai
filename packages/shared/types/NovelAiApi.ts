import { z } from "zod";

export interface ImageResolution {
  name: string;
  width: number;
  height: number;
  excludes: string[];
}

export const ImageResolutions: ImageResolution[] = [
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

export interface UCPresets {
  Preset_Low_Quality_Bad_Anatomy: number;
  Preset_Low_Quality: number;
  Preset_None: number;
  Preset_Bad_Anatomy: number;
  Preset_Heavy: number;
  Preset_Light: number;
}

export const UCPresetsEnum: UCPresets = {
  Preset_Low_Quality_Bad_Anatomy: 0,
  Preset_Low_Quality: 1,
  Preset_None: 2,
  Preset_Bad_Anatomy: 3,
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

export interface ImageSampler {
  name: string;
  smea: boolean;
  smea_dyn: boolean;
}

type ImageSamplerEnum = Record<string, ImageSampler>;

export const ImageSamplers: ImageSamplerEnum = {
  k_lms: {
    name: "k_lms",
    smea: false,
    smea_dyn: false,
  },
  Euler: {
    name: "k_euler",
    smea: true,
    smea_dyn: true,
  },
  Euler_Ancestral: {
    name: "k_euler_ancestral",
    smea: true,
    smea_dyn: true,
  },
  k_heun: {
    name: "k_heun",
    smea: false,
    smea_dyn: false,
  },
  plms: {
    name: "plms", // doesn't work
    smea: false,
    smea_dyn: false,
  },
  DDIM: {
    name: "ddim",
    smea: false,
    smea_dyn: false,
  },
  DDIM_V3: {
    name: "ddim_v3",
    smea: true,
    smea_dyn: true,
  },
  nai_smea: {
    name: "nai_smea", // doesn't work
    smea: true,
    smea_dyn: false,
  },
  nai_smea_dyn: {
    name: "nai_smea_dyn",
    smea: true,
    smea_dyn: true,
  },
  "DPM++2M": {
    name: "k_dpmpp_2m",
    smea: true,
    smea_dyn: true,
  },
  "DPM++_2s_Ancestral": {
    name: "k_dpmpp_2s_ancestral",
    smea: true,
    smea_dyn: true,
  },
  "DPM++_SDE": {
    name: "k_dpmpp_sde",
    smea: true,
    smea_dyn: true,
  },
  DPM2: {
    name: "k_dpm_2",
    smea: true,
    smea_dyn: true,
  },
  k_dpm_2_ancestral: {
    name: "k_dpm_2_ancestral",
    smea: false,
    smea_dyn: false,
  },
  k_dpm_adaptive: {
    name: "k_dpm_adaptive",
    smea: false,
    smea_dyn: false,
  },
  DPM_Fast: {
    name: "k_dpm_fast",
    smea: true,
    smea_dyn: false,
  },
};

const ImageSamplersEnum: readonly [string, ...string[]] = [
  Object.values(ImageSamplers)[0].name,
  ...Object.values(ImageSamplers).map((sampler) => sampler.name),
];

export enum ControlNetModelsEnum {
  Palette_Swap = "hed",
  Form_Lock = "midas",
  Scribbler = "fake_scribble",
  Building_Control = "mlsd",
  Landscaper = "uniformer",
}

function getMaxNSamples(w: number, h: number): number {
  const r = w * h;
  if (r <= 512 * 704) return 8;
  if (r <= 640 * 640) return 6;
  if (r <= 512 * 2560) return 4;
  if (r <= 1024 * 1536) return 2;
  if (r <= 1024 * 3072) return 1;
  return 0;
}

export enum NoiseScheduleEnum {
  native = "native",
  karras = "karras",
  exponential = "exponential",
  polyexponential = "polyexponential",
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
    sampler: z.enum(ImageSamplersEnum), // https://docs.novelai.net/image/sampling.html
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
    controllnet_model: z.nativeEnum(ControlNetModelsEnum).optional(), // Model to use for the controlnet
    controlnet_strength: z.number(), // Influence of the chosen controlnet on the image
    dynamic_thresholding: z.boolean(), // Reduce the deepfrying effects of high scale (https://twitter.com/Birchlabs/status/1582165379832348672)
    add_original_image: z.boolean(), // Prevent seams along the edges of the mask, but may change the image slightly
    mask: z.string().optional(), //  Mask for inpainting (b64-encoded black and white png image, white is the inpainting area)
    cfg_rescale: z.number().min(0).max(1), // https://docs.novelai.net/image/stepsguidance.html#prompt-guidance-rescale
    noise_schedule: z.nativeEnum(NoiseScheduleEnum), // ?
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
  sampler: ImageSamplers.Euler.name,
  steps: 28,
  scale: 5,
  uncond_scale: 1,
  negative_prompt: "",
  sm: true,
  sm_dyn: true,
  dynamic_thresholding: false,
  controlnet_strength: 1,
  add_original_image: false,
  cfg_rescale: 0,
  noise_schedule: NoiseScheduleEnum.native,
};

export interface AiGenerateImageModel {
  name: string;
  label: string;
  legacy: boolean;
  inpainting: boolean;
  default: boolean;
  version: number;
  samplers_recommend: ImageSampler[];
  samplers: ImageSampler[];
}

type ModelsEnum = Record<string, AiGenerateImageModel>;

export const AiGenerateImageModels: ModelsEnum = {
  "nai-diffusion": {
    name: "nai-diffusion",
    label: "NAI Diffusion Anime V1",
    legacy: true,
    inpainting: false,
    default: true,
    version: 1,
    samplers_recommend: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.Euler_Ancestral,
    ],
    samplers: [
      ImageSamplers.Euler,
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.DDIM,
    ],
  },
  "safe-diffusion": {
    name: "safe-diffusion",
    label: "Safe Diffusion Anime V1",
    legacy: true,
    inpainting: false,
    default: true,
    version: 1,
    samplers_recommend: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.Euler_Ancestral,
    ],
    samplers: [
      ImageSamplers.Euler,
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.DDIM,
    ],
  },
  "nai-diffusion-furry": {
    name: "nai-diffusion-furry",
    label: "NAI Diffusion Furry",
    legacy: true,
    inpainting: false,
    default: true,
    version: 1,
    samplers_recommend: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.Euler_Ancestral,
    ],
    samplers: [
      ImageSamplers.Euler,
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.DDIM,
    ],
  },
  custom: {
    name: "custom",
    label: "Custom",
    legacy: true,
    inpainting: false,
    default: false,
    version: 1,
    samplers_recommend: [],
    samplers: [],
  },
  "nai-diffusion-inpainting": {
    name: "nai-diffusion-inpainting",
    label: "NAI Diffusion Anime Inpainting",
    legacy: true,
    inpainting: true,
    default: true,
    version: 1,
    samplers_recommend: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.Euler_Ancestral,
    ],
    samplers: [
      ImageSamplers.Euler,
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.DDIM,
    ],
  },
  "nai-diffusion-3-inpainting": {
    name: "nai-diffusion-3-inpainting",
    label: "NAI Diffusion Anime V3 Inpainting",
    legacy: false,
    inpainting: true,
    default: true,
    version: 3,
    samplers_recommend: [
      ImageSamplers.Euler,
      ImageSamplers.Euler_Ancestral,
      ImageSamplers["DPM++_2s_Ancestral"],
    ],
    samplers: [
      ImageSamplers["DPM++2M"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DDIM,
    ],
  },
  "safe-diffusion-inpainting": {
    name: "safe-diffusion-inpainting",
    label: "Safe Diffusion Anime V1 Inpainting",
    legacy: true,
    inpainting: true,
    default: true,
    version: 1,
    samplers_recommend: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.Euler_Ancestral,
    ],
    samplers: [
      ImageSamplers.Euler,
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.DDIM,
    ],
  },
  "furry-diffusion-inpainting": {
    name: "furry-diffusion-inpainting",
    label: "NAI Diffusion Furry Inpainting",
    legacy: true,
    inpainting: true,
    default: true,
    version: 1,
    samplers_recommend: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.Euler_Ancestral,
    ],
    samplers: [
      ImageSamplers.Euler,
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.DDIM,
    ],
  },
  "kandinsky-vanilla": {
    name: "kandinsky-vanilla",
    label: "Kandinsky Vanilla",
    legacy: true,
    inpainting: false,
    default: false,
    version: 1,
    samplers_recommend: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.Euler_Ancestral,
    ],
    samplers: [
      ImageSamplers.Euler,
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.DDIM,
    ],
  },
  "nai-diffusion-2": {
    name: "nai-diffusion-2",
    label: "NAI Diffusion Anime V2",
    legacy: true,
    inpainting: false,
    default: true,
    version: 2,
    samplers_recommend: [
      ImageSamplers.Euler_Ancestral,
      ImageSamplers["DPM++_2s_Ancestral"],
      ImageSamplers.DDIM,
    ],
    samplers: [
      ImageSamplers["DPM++2M"],
      ImageSamplers.DPM2,
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DPM_Fast,
      ImageSamplers.Euler,
    ],
  },
  "nai-diffusion-3": {
    name: "nai-diffusion-3",
    label: "NAI Diffusion Anime V3",
    legacy: false,
    inpainting: false,
    default: true,
    version: 3,
    samplers_recommend: [
      ImageSamplers.Euler,
      ImageSamplers.Euler_Ancestral,
      ImageSamplers["DPM++_2s_Ancestral"],
    ],
    samplers: [
      ImageSamplers["DPM++2M"],
      ImageSamplers["DPM++_SDE"],
      ImageSamplers.DDIM,
    ],
  },
} as const;

const model_enum: readonly [string, ...string[]] = [
  Object.keys(AiGenerateImageModels)[0],
  ...Object.keys(AiGenerateImageModels),
];

export const AiGenerateImageRequestSchema = z
  .object({
    input: z.string().min(1).max(40000),
    model: z.enum(model_enum),
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
      params.model === "nai-diffusion-3" ||
      params.parameters.sampler !== ImageSamplers.DDIM_V3.name,
    {
      path: ["parameters.sampler"],
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
