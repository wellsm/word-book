import type { WordRecord } from "@/schemas/word";

type PartialWordRecord = Pick<WordRecord, "term" | "meaning" | "learned">;

export const DEFAULT_WORDS: PartialWordRecord[] = [];
