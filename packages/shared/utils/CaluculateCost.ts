// Reference: https://github.com/Aedial/novelai-api/blob/37f2250b3f1fe24aa7f3fcccee7277b45f57e6d5/novelai_api/ImagePreset.py#L450

import {
  type AiGenerateImageParameters,
  ImageSamplers,
} from "../types/NovelAiApi/GenImage";

import {
  SMEA_DYN_COSTS,
  SMEA_COSTS,
  DDIM_COSTS,
  NAI_COSTS,
} from "./CostTables";

export default function caluculateCost(
  is_opus: boolean,
  version: number,
  params: AiGenerateImageParameters,
): number {
  const steps = params.steps;
  const n_samples = params.n_samples;
  const smea = params.sm;
  const smea_dyn = params.sm_dyn;

  const samplerList = [
    ImageSamplers.plms.name,
    ImageSamplers.DDIM.name,
    ImageSamplers.Euler.name,
    ImageSamplers.Euler_Ancestral.name,
    ImageSamplers.k_lms.name,
  ];
  const sampler = params.sampler;

  const uncond_scale = params.uncond_scale;

  const strength = params.image ? params.strength ?? 1 : 1;

  const resolution = [params.width, params.height];
  let r = resolution[0] * resolution[1];

  const index =
    Math.ceil(params.width / 64) * Math.ceil(params.height / 64) - 1;
  let costArr: number[] = [0, 0];

  let smea_factor = 1.0;

  let per_sample: number;

  if (r < 65536) r = 65536;

  if (version === 3) {
    if (smea && smea_dyn) smea_factor = 1.4;
    if (smea && !smea_dyn) smea_factor = 1.2;
    per_sample =
      Math.ceil(2951823174884865e-21 * r + 5.753298233447344e-7 * r * steps) *
      smea_factor;
  } else {
    if (r <= 1024 * 1024 && samplerList.some((obj) => obj === sampler))
      per_sample =
        ((15.266497014243718 *
          Math.exp((r / 1024 / 1024) * 0.6326248927474729) -
          15.225164493059737) *
          steps) /
        28;
    else if (sampler === ImageSamplers.nai_smea_dyn.name || (smea && smea_dyn))
      costArr = SMEA_DYN_COSTS[index];
    else if (sampler === ImageSamplers.nai_smea.name || smea)
      costArr = SMEA_COSTS[index];
    else if (sampler === ImageSamplers.DDIM.name) costArr = DDIM_COSTS[index];
    else costArr = NAI_COSTS[index];

    per_sample = costArr[0] * steps + costArr[1];
  }

  per_sample = Math.max(Math.ceil(per_sample * strength), 2);

  if (version !== 1 && ![1.0, 0.0].some((v) => v === uncond_scale))
    per_sample = Math.ceil(per_sample * 1.3);

  const opus_discount_resolution = version === 1 ? 640 * 640 : 1024 * 1024;
  const opus_discount_flag =
    is_opus && steps <= 28 && r <= opus_discount_resolution;
  const opus_discount = opus_discount_flag ? 1 : 0;

  return per_sample * (n_samples - opus_discount);
}
