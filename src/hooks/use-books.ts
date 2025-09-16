import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { db } from "@/lib/db";
import type { BookRecord } from "@/schemas/book";

export function useBooks() {
  const books = useLiveQuery(
    () => db.books.orderBy("createdAt").reverse().toArray(),
    []
  );

  return {
    data: books ?? [],
    isLoading: books === undefined,
  };
}

export function useAddBook() {
  return {
    mutateAsync: async (
      book: Omit<BookRecord, "id" | "createdAt" | "updatedAt">
    ) => {
      try {
        const id = await db.books.add({
          ...book,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success("Book created successfully!");
        return id;
      } catch (error) {
        toast.error("Failed to create book. Please try again.");
        throw error;
      }
    },
    isPending: false,
  };
}

export function useUpdateBook() {
  return {
    mutateAsync: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Omit<BookRecord, "id" | "createdAt" | "updatedAt">>;
    }) => {
      try {
        await db.books.update(id, {
          ...updates,
          updatedAt: new Date(),
        });
        toast.success("Book updated successfully!");
      } catch (error) {
        toast.error("Failed to update book. Please try again.");
        throw error;
      }
    },
    isPending: false,
  };
}

export function useDeleteBook() {
  return {
    mutateAsync: async (id: number) => {
      try {
        // First, delete all words in this book
        await db.words.where("bookId").equals(id).delete();
        // Then delete the book
        await db.books.delete(id);
        toast.success("Book and all its words deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete book. Please try again.");
        throw error;
      }
    },
    isPending: false,
  };
}
