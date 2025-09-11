import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { BottomBar } from "@/components/app/bottom-bar";
import { Header } from "@/components/app/header";
import { QuizModal } from "@/components/app/quiz-modal";
import { Row } from "@/components/app/row";
import { SettingsModal } from "@/components/app/settings-modal";
import { WordModal } from "@/components/app/word-modal";
import { useWordbook } from "@/hooks/word-book";
import { DEFAULT_STATE } from "@/schemas/app";
import type { SettingsSchema } from "@/schemas/settings";
import type { WordSchema } from "@/schemas/word";

type WordData = z.infer<typeof WordSchema>;
type SettingsData = z.infer<typeof SettingsSchema>;

export function Notebook() {
  const { data, isLoading, update } = useWordbook();
  const state = data ?? DEFAULT_STATE;
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<
    Partial<WordData> | undefined
  >();
  const [quizWord, setQuizWord] = useState<WordData | null>(null);

  const perPage = state.settings.perPage;
  const pageCount = Math.max(1, Math.ceil(state.items.length / perPage));
  const page = Math.min(state.page, pageCount);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const slice = state.items.slice(start, end);

  const handleToggleVisibility = () => {
    update((s) => ({
      ...s,
      hideMeanings: !s.hideMeanings,
    }));
  };

  const handleAddWord = () => {
    setModalMode("add");
    setEditingData(undefined);
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEditWord = (globalIdx: number) => {
    setModalMode("edit");
    setEditingData(state.items[globalIdx]);
    setEditingIndex(globalIdx);
    setModalOpen(true);
  };

  const handleSaveWord = (wordData: Partial<WordData>) => {
    if (modalMode === "add") {
      update((s) => ({
        ...s,
        items: [
          ...s.items,
          {
            term: wordData.term || "",
            meaning: wordData.meaning || "",
            learned: false,
            color: wordData.color || "default",
          },
        ],
        page: Math.max(1, Math.ceil((s.items.length + 1) / s.settings.perPage)),
      }));
    } else if (modalMode === "edit" && editingIndex !== null) {
      update((s) => {
        const arr = [...s.items];
        arr[editingIndex] = { ...arr[editingIndex], ...wordData };
        return { ...s, items: arr };
      });
    }
  };

  const handleDeleteWord = () => {
    if (modalMode === "edit" && editingIndex !== null) {
      update((s) => {
        const arr = [...s.items];
        arr.splice(editingIndex, 1);
        return { ...s, items: arr };
      });
    }
  };

  const handleSaveSettings = (settings: SettingsData) => {
    update((s) => ({
      ...s,
      settings,
    }));
  };

  const handleRandomQuiz = () => {
    if (state.items.length === 0) {
      toast("Add some words first to start a quiz!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * state.items.length);
    const randomWord = state.items[randomIndex];
    setQuizWord(randomWord);
    setQuizOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-24">
      <Header />

      <div className="min-h-dvh overflow-hidden bg-background p-4 shadow">
        <div className="mt-2 space-y-2">
          {slice.length === 0 && (
            <div className="space-y-4 py-16 text-center">
              <div className="mb-4 text-6xl">📚</div>
              <h2 className="font-bold text-2xl text-foreground">
                Your Word Book is Empty
              </h2>
              <p className="mx-auto max-w-md text-lg text-muted-foreground">
                Start building your vocabulary by adding new words or load some
                sample vocabulary to get started.
              </p>
            </div>
          )}
          {slice.map((item, idx) => {
            const globalIdx = start + idx;
            return (
              <Row
                hideMeanings={state.hideMeanings}
                item={item}
                key={globalIdx}
                onEdit={() => handleEditWord(globalIdx)}
              />
            );
          })}
        </div>
      </div>

      <BottomBar
        isHidden={state.hideMeanings}
        onAddWord={handleAddWord}
        onOpenSettings={() => setSettingsOpen(true)}
        onRandomQuiz={handleRandomQuiz}
        onToggleVisibility={handleToggleVisibility}
        page={page}
        pageCount={pageCount}
        setPage={(p: number) => update((s) => ({ ...s, page: p }))}
        showQuiz={(data?.items?.length ?? 0) > 1}
      />

      <WordModal
        initialData={editingData}
        mode={modalMode}
        onDelete={modalMode === "edit" ? handleDeleteWord : undefined}
        onOpenChange={setModalOpen}
        onSave={handleSaveWord}
        open={modalOpen}
      />

      <SettingsModal
        initialSettings={state.settings}
        onOpenChange={setSettingsOpen}
        onSave={handleSaveSettings}
        open={settingsOpen}
      />

      <QuizModal onOpenChange={setQuizOpen} open={quizOpen} word={quizWord} />
    </div>
  );
}
