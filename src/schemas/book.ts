import { z } from "zod";

export const LANGUAGE_EN = "en";
export const LanguageOptions = [LANGUAGE_EN] as const;

export type Language = typeof LANGUAGE_EN;

export type BookRecord = {
  id?: number;
  name: string;
  color: string;
  type: Language;
  value: Language;
  createdAt: Date;
  updatedAt: Date;
};

export const DEFAULT_BOOK = {
  name: "",
  color: "default",
  type: LANGUAGE_EN as Language,
  value: LANGUAGE_EN as Language,
};

export const BookSchema = z.object({
  name: z.string().min(1, "Book name is required"),
  color: z.string().default("default"),
  type: z.enum(LanguageOptions).default(LANGUAGE_EN),
  value: z.enum(LanguageOptions).default(LANGUAGE_EN),
});
