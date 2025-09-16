import type { BookRecord } from "@/schemas/book";

export function Header({ selectedBook }: { selectedBook: BookRecord | null }) {
  return (
    <div className="flex h-16 w-full flex-wrap items-center justify-center gap-2 border-accent border-b">
      <h1 className="text-center font-semibold text-xl">
        📒 Word Book {selectedBook && `- ${selectedBook.name}`}
      </h1>
    </div>
  );
}
