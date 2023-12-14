import { z } from "zod";

export const SettingsRequestSchema = z.object({
  NAI_API_TOKEN: z.string().optional(),
  NEXTCLOUD_URL: z.string().optional(),
  NEXTCLOUD_USER: z.string().optional(),
  NEXTCLOUD_PASS: z.string().optional(),
});

export type Settings = z.infer<typeof SettingsRequestSchema>;
