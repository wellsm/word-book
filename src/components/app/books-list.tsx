import { Plus } from "lucide-react";
import { BookCard } from "@/components/app/book-card";
import { Button } from "@/components/ui/button";
import type { BookRecord } from "@/schemas/book";

type BooksListProps = {
  books: BookRecord[];
  onAddBook: () => void;
  onEditBook: (book: BookRecord) => void;
  onSelectBook: (book: BookRecord) => void;
};

export function BooksList({
  books,
  onAddBook,
  onEditBook,
  onSelectBook,
}: BooksListProps) {
  return (
    <div className="space-y-6 p-8">
      {books.length === 0 ? (
        <div className="space-y-4 p-8 py-48 text-center">
          <div className="mb-4 text-6xl">📖</div>
          <h3 className="font-bold text-foreground text-xl">No Books Yet</h3>
          <p className="mx-auto max-w-md text-muted-foreground">
            Create your first book to start organizing your words by topic,
            language, or any way you prefer.
          </p>
          <Button className="mt-4" onClick={onAddBook}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Book
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard
              book={book}
              key={book.id}
              onEdit={() => onEditBook(book)}
              onSelect={() => onSelectBook(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
