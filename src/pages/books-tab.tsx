import { Plus } from "lucide-react";
import { useState } from "react";
import { BookModal } from "@/components/app/book-modal";
import { BooksList } from "@/components/app/books-list";
import { Loading } from "@/components/app/loading";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";
import type { BookRecord } from "@/schemas/book";

type BooksTabProps = {
  onSelectBook: (book: BookRecord) => void;
};

export function BooksTab({ onSelectBook }: BooksTabProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingData, setEditingData] = useState<
    Partial<BookRecord> | undefined
  >();

  const { data: books = [], isLoading } = useBooks();

  if (isLoading) {
    return <Loading />;
  }

  const handleAddBook = () => {
    setModalMode("add");
    setEditingData(undefined);
    setModalOpen(true);
  };

  const handleEditBook = (book: BookRecord) => {
    setModalMode("edit");
    setEditingData(book);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <BooksList
        books={books}
        onAddBook={handleAddBook}
        onEditBook={handleEditBook}
        onSelectBook={onSelectBook}
      />

      {books.length > 0 && (
        <div className="fixed right-0 bottom-16 left-0 z-50 border-t bg-background shadow-lg">
          <div className="flex w-full justify-center py-3">
            <div className={"flex flex-wrap items-center justify-center gap-3"}>
              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button onClick={handleAddBook} size="lg">
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span>Add Book</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BookModal
        initialData={editingData}
        mode={modalMode}
        onOpenChange={setModalOpen}
        open={modalOpen}
      />
    </div>
  );
}
