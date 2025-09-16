import Dexie, { type EntityTable } from "dexie";
import type { BookRecord } from "@/schemas/book";
import { DEFAULT_SETTINGS, type SettingsRecord } from "@/schemas/settings";
import type { WordRecord } from "@/schemas/word";
import { DEFAULT_WORDS } from "../seeders/words";

const db = new Dexie("WordBookDB") as Dexie & {
  words: EntityTable<WordRecord, "id">;
  books: EntityTable<BookRecord, "id">;
  settings: EntityTable<SettingsRecord, "id">;
};

db.version(1).stores({
  words: "++id, term, bookId, createdAt",
  books: "++id, name, createdAt",
  settings: "++id",
});

db.on("populate", async () => {
  await db.settings.bulkAdd([
    {
      perPage: DEFAULT_SETTINGS.perPage,
      layout: DEFAULT_SETTINGS.layout,
      updatedAt: new Date(),
    },
  ]);

  if (DEFAULT_WORDS.length === 0) {
    return;
  }

  const bookId = await db.books.add({
    name: "My First Book",
    color: "blue",
    type: "en",
    value: "en",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!bookId) {
    return;
  }

  const words = DEFAULT_WORDS.map((word) => ({
    term: word.term,
    meaning: word.meaning,
    learned: word.learned,
    bookId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.words.bulkAdd(words);
});

// Define hooks for auto-timestamps
db.words.hook("creating", (_, obj) => {
  (obj as WordRecord).createdAt = new Date();
  (obj as WordRecord).updatedAt = new Date();
});

db.words.hook("updating", (modifications) => {
  (modifications as Partial<WordRecord>).updatedAt = new Date();
});

db.books.hook("creating", (_, obj) => {
  (obj as BookRecord).createdAt = new Date();
  (obj as BookRecord).updatedAt = new Date();
});

db.books.hook("updating", (modifications) => {
  (modifications as Partial<BookRecord>).updatedAt = new Date();
});

db.settings.hook("creating", (_, obj) => {
  (obj as SettingsRecord).updatedAt = new Date();
});

db.settings.hook("updating", (modifications) => {
  (modifications as Partial<SettingsRecord>).updatedAt = new Date();
});

export { db };
