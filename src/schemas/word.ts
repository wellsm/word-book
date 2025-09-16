import { z } from "zod";

export type WordRecord = {
  id?: number;
  term: string;
  meaning: string;
  learned: boolean;
  bookId: number;
  createdAt: Date;
  updatedAt: Date;
};

export const DEFAULT_WORD = {
  term: "",
  meaning: "",
  learned: false,
  bookId: 0,
};

export const WordSchema = z.object({
  term: z.string().min(1, "Word is required"),
  meaning: z.string().min(1, "Meaning is required"),
  learned: z.boolean().default(false),
  bookId: z.number().min(1, "Book is required"),
});
