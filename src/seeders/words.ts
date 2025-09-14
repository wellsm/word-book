import type { WordRecord } from "@/lib/db";

type PartialWordRecord = Pick<
  WordRecord,
  "term" | "meaning" | "learned" | "color"
>;

export const DEFAULT_WORDS: PartialWordRecord[] = [];
