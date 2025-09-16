import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { SettingsRecord } from "@/schemas/settings";

export function useSettings() {
  const settings = useLiveQuery(() => db.settings.limit(1).first(), []);

  return {
    data: settings,
    isLoading: settings === undefined,
  };
}

export function useUpdateSettings() {
  const updateSettings = async (
    settings: Omit<SettingsRecord, "updatedAt">
  ) => {
    const id = (await db.settings.limit(1).first())?.id;

    return await db.settings.update(id, settings);
  };

  return {
    mutate: updateSettings,
    mutateAsync: updateSettings,
    isPending: false,
  };
}

export function useUpdateSelectedBook() {
  const updateSelectedBook = async (selectedBookId?: number) => {
    const currentSettings = await db.settings.limit(1).first();
    const id = currentSettings?.id;

    if (id) {
      await db.settings.update(id, { selectedBookId });
    }
  };

  return {
    mutate: updateSelectedBook,
    mutateAsync: updateSelectedBook,
    isPending: false,
  };
}

export function useDeleteDatabase() {
  const deleteDatabase = async () => {
    await db.delete();
    await db.open(); // Reopen with fresh schema
  };

  return {
    mutateAsync: deleteDatabase,
    mutate: deleteDatabase,
    isPending: false,
  };
}
