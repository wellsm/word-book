import { z } from "zod";
import { SettingsSchema } from "./settings";
import { WordSchema } from "./word";

export const StateSchema = z.object({
  settings: SettingsSchema,
  items: z.array(WordSchema).default([]),
  page: z.number().min(1).default(1),
});

export type AppState = z.infer<typeof StateSchema>;

export const DEFAULT_STATE: AppState = {
  settings: {
    perPage: 7,
  },
  items: [],
  page: 1,
};
