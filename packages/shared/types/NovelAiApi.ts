import { z } from "zod";

export const ImageResolutions = [
  [1088, 1920], // Wallpaper_Portrait
  [1920, 1088], // Wallpaper_Landscape
  [384, 640], // v1 Small_Portrait
  [640, 384], // v1 Smalll_Landscape
  [512, 512], // v1 Small_Square
  [512, 768], // v1 Normal_Portrait
  [768, 512], // v1 Normal_Landscape
  [640, 640], // v1 Normal_Square
  [512, 1024], // v1 Large_Portrait
  [1024, 512], // v1 Large_Landscape
  [1024, 1024], // v1 Large_Square
  [512, 768], // v2 and v3 Small_Portrait
  [768, 512], // v2 and v3 Smalll_Landscape
  [640, 640], // v2 and v3 Small_Square
  [832, 1216], // v2 and v3 Normal_Portrait
  [1216, 832], // v2 and v3 Normal_Landscape
  [1024, 1024], // v2 and v3 Normal_Square
  [1024, 1536], // v2 and v3 Large_Portrait
  [1536, 1024], // v2 and v3 Large_Landscape
  [1472, 1472], // v2 and v3 Large_Square
];

export const AiGenerateImageResolutionsSchema = z
  .array(z.number())
  .length(2)
  .refine((arr) => ImageResolutions.some((img) => img === arr));

export type AiGenerateImageResolutions = z.infer<
  typeof AiGenerateImageResolutionsSchema
>;

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
        (img) => img[0] === params.width && img[1] === params.height,
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

export const DefaultAiGenerateImageParameters = {
  legacy: false,
  quality_toggle: true,
  resolution: ImageResolutions[14],
  uc_preset: UCPresetsEnum.Preset_Low_Quality_Bad_Anatomy,
  n_samples: 1,
  seed: 0,
  sampler: ImageSamplersEnum.k_euler,
  steps: 28,
  scale: 5,
  uncond_scale: 1,
  uc: "",
  smea: false,
  smea_dyn: false,
  decrisper: false,
  controlnet_strength: 1,
  add_original_image: false,
  cfg_rescale: 0,
  noise_schedule: "native",
};

export const AiGenerateImageRequestSchema = z.object({
  input: z.string().min(1).max(40000),
  model: z.enum([
    "nai-diffusion",
    "safe-diffusion",
    "nai-diffusion-furry",
    "custom",
    "nai-diffusion-inpainting",
    "nai-diffusion-3-inpainting",
    "safe-diffusion-inpainting",
    "furry-diffusion-inpainting",
    "kandinsky-vanilla",
    "nai-diffusion-2",
    "nai-diffusion-3",
  ]),
  action: z.enum(["generate", "img2img", "infill"]),
  parameters: AiGenerateImageParametersSchema,
  url: z
    .string()
    .regex(
      /https:\/\/[0-9a-z\-_]*\.tenant-novelai\.knative\.(chi\.coreweave\.com|[0-9a-z]+\.coreweave\.cloud)\/.*/,
    )
    .optional(),
});

export type AiGenerateImageRequest = z.infer<
  typeof AiGenerateImageRequestSchema
>;
