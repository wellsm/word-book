import Dexie, { type EntityTable } from "dexie";
import { DEFAULT_SETTINGS, type SettingsRecord } from "@/schemas/settings";
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

const db = new Dexie("WordBookDB") as Dexie & {
  words: EntityTable<WordRecord, "id">;
  settings: EntityTable<SettingsRecord, "id">;
};

db.version(1).stores({
  words: "++id, term, createdAt",
  settings: "++id",
});

db.version(2)
  .stores({
    words: "++id, term, createdAt",
    settings: "++id",
  })
  .upgrade((tx) => {
    return tx
      .table("settings")
      .toCollection()
      .modify((settings) => {
        settings.layout = DEFAULT_SETTINGS.layout.toString();
      });
  });

db.on("populate", async () => {
  await db.settings.bulkAdd([
    {
      perPage: DEFAULT_SETTINGS.perPage,
      layout: DEFAULT_SETTINGS.layout,
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
