import { useLiveQuery } from "dexie-react-hooks";
import { db, type SettingsRecord, type WordRecord } from "@/lib/db";

export function useWords() {
  const words = useLiveQuery(() => db.words.orderBy("createdAt").toArray(), []);

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
    updates: Partial<WordRecord>;
  }) => {
    return await db.words.update(id, updates);
  };

  return {
    mutateAsync: updateWord,
    mutate: updateWord,
    isPending: false,
  };
}

export function useDeleteWord() {
  const deleteWord = async (id: number) => {
    return await db.words.delete(id);
  };

  return {
    mutateAsync: deleteWord,
    mutate: deleteWord,
    isPending: false,
  };
}

export function useExportData() {
  const exportData = async () => {
    const words = await db.words.toArray();
    const settings = await db.settings.limit(1).first();

    // Provide default settings if none exist
    const defaultSettings = settings || {
      perPage: 10,
      colorLeft: "#f6f7fb",
      colorRight: "#eefaf1",
      hideMeanings: true,
      updatedAt: new Date(),
    };

    return { words, settings: defaultSettings };
  };

  return {
    mutateAsync: exportData,
    mutate: exportData,
    isPending: false,
  };
}

export function useImportData() {
  const importData = async (data: {
    words: WordRecord[];
    settings: SettingsRecord;
  }) => {
    await db.transaction("rw", db.words, db.settings, async () => {
      // Clear existing data
      await db.words.clear();
      await db.settings.clear();

      // Import settings
      await db.settings.add(data.settings);

      // Import words (remove ids to let auto-increment work)
      const wordsToImport = data.words.map((word) => {
        const { id: _, ...wordData } = word;
        return wordData;
      });

      await db.words.bulkAdd(wordsToImport);
    });
  };

  return {
    mutateAsync: importData,
    mutate: importData,
    isPending: false,
  };
}
