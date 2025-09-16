import { z } from "zod";

export const Hex = z
  .string()
  .regex(/^#([\da-fA-F]{3}|[\da-fA-F]{6})$/, "Use a HEX color like #aabbcc");

export const MAX_PER_PAGE = 20;
const DEFAULT_PER_PAGE = 10;

export const LAYOUT_LIST = "list";
export const LAYOUT_TWO_COLUMN = "two-column";

export type Layout = typeof LAYOUT_LIST | typeof LAYOUT_TWO_COLUMN;
export const LayoutOptions = [LAYOUT_LIST, LAYOUT_TWO_COLUMN] as const;

export type SettingsRecord = {
  id?: number;
  perPage: number;
  layout: Layout;
  hideMeanings?: boolean;
  selectedBookId?: number;
  updatedAt: Date;
};

export const DEFAULT_SETTINGS = {
  perPage: DEFAULT_PER_PAGE,
  layout: LAYOUT_TWO_COLUMN as Layout,
  hideMeanings: true,
  selectedBookId: undefined,
};

export const SettingsSchema = z.object({
  perPage: z.number().min(1).max(MAX_PER_PAGE).default(DEFAULT_PER_PAGE),
  layout: z.enum(LayoutOptions).default(LAYOUT_TWO_COLUMN),
  hideMeanings: z.boolean().default(true),
  selectedBookId: z.number().optional(),
});
