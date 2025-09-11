import { z } from "zod";

export const WordSchema = z.object({
  term: z.string().default(""),
  meaning: z.string().default(""),
  learned: z.boolean().default(false),
  color: z.string().optional().default("default"),
});
