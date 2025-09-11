import { z } from "zod";

export const Hex = z
  .string()
  .regex(/^#([\da-fA-F]{3}|[\da-fA-F]{6})$/, "Use a HEX color like #aabbcc");

export const MAX_PER_PAGE = 20;
const DEFAULT_PER_PAGE = 7;

export const SettingsSchema = z.object({
  perPage: z.number().min(1).max(MAX_PER_PAGE).default(DEFAULT_PER_PAGE),
});
