import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { SettingsRecord } from "@/schemas/settings";
import type { WordRecord } from "@/schemas/word";

export function useWords(bookId?: number) {
  const words = useLiveQuery(() => {
    if (bookId) {
      return db.words.where("bookId").equals(bookId).reverse().toArray();
    }
    return db.words.orderBy("createdAt").reverse().toArray();
  }, [bookId]);

  return {
    data: words ?? [],
    isLoading: words === undefined,
  };
}

export function useAddWord() {
  const addWord = async (
    word: Omit<WordRecord, "id" | "createdAt" | "updatedAt">
  ) => {
    return await db.words.add(word as WordRecord);
  };

  return {
    mutateAsync: addWord,
    mutate: addWord,
    isPending: false,
  };
}

export function useUpdateWord() {
  const updateWord = async ({
    id,
    updates,
  }: {
    id: number;
    updates: Partial<Omit<WordRecord, "id">>;
  }) => {
    await db.words.update(id, updates);
  };

  return {
    mutateAsync: updateWord,
    mutate: updateWord,
    isPending: false,
  };
}

export function useDeleteWord() {
  const deleteWord = async (id: number) => {
    await db.words.delete(id);
  };

  return {
    mutateAsync: deleteWord,
    mutate: deleteWord,
    isPending: false,
  };
}

export function useExportData() {
  const exportData = async (): Promise<{
    words: WordRecord[];
    settings: SettingsRecord[];
  }> => {
    const wordsData = await db.words.toArray();
    const settingsData = await db.settings.toArray();

    return {
      words: wordsData,
      settings: settingsData,
    };
  };

  return {
    mutateAsync: exportData,
    mutate: exportData,
    isPending: false,
  };
}

export function useImportData() {
  const importData = async (data: {
    words?: WordRecord[];
    settings?: SettingsRecord[];
  }) => {
    if (data.words && data.words.length > 0) {
      // Clear existing words
      await db.words.clear();

      const wordsToAdd = data.words.map((word) => ({
        ...word,
        createdAt: new Date(word.createdAt),
        updatedAt: new Date(word.updatedAt),
      }));

      await db.words.bulkAdd(wordsToAdd);
    }

    if (data.settings && data.settings.length > 0) {
      // Clear existing settings
      await db.settings.clear();

      const settingsToAdd = data.settings.map((setting) => ({
        ...setting,
        updatedAt: new Date(setting.updatedAt),
      }));

      await db.settings.bulkAdd(settingsToAdd);
    }
  };

  return {
    mutateAsync: importData,
    mutate: importData,
    isPending: false,
  };
}
