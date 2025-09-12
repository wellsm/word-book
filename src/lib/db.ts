import Dexie, { type EntityTable } from "dexie";
import { DEFAULT_WORDS } from "../seeders/words";

export type WordRecord = {
  id?: number;
  term: string;
  meaning: string;
  learned: boolean;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export const DEFAULT_PER_PAGE = 10;

export type SettingsRecord = {
  id?: number;
  perPage: number;
  updatedAt: Date;
};

const db = new Dexie("WordBookDB") as Dexie & {
  words: EntityTable<WordRecord, "id">;
  settings: EntityTable<SettingsRecord, "id">;
};

// Define schemas
db.version(1).stores({
  words: "++id, term, createdAt",
  settings: "++id",
});

db.on("populate", async () => {
  // Add default settings
  await db.settings.bulkAdd([
    {
      perPage: DEFAULT_PER_PAGE,
      updatedAt: new Date(),
    },
  ]);

  const words = DEFAULT_WORDS.map((word) => ({
    ...word,
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

db.settings.hook("creating", (_, obj) => {
  (obj as SettingsRecord).updatedAt = new Date();
});

db.settings.hook("updating", (modifications) => {
  (modifications as Partial<SettingsRecord>).updatedAt = new Date();
});

export { db };
