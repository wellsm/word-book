import { useState } from "react";
import { BottomBar } from "@/components/app/bottom-bar";
import { Loading } from "@/components/app/loading";
import { WordModal } from "@/components/app/word-modal";
import { WordsList } from "@/components/app/words-list";
import { useSettings } from "@/hooks/use-settings";
import { useWords } from "@/hooks/use-words";
import type { WordRecord } from "@/schemas/word";

type HomeTabProps = {
  bookId: number;
};

export function HomeTab({ bookId }: HomeTabProps) {
  const [hideMeanings, setHideMeanings] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingData, setEditingData] = useState<
    Partial<WordRecord> | undefined
  >();

  const { data: words = [], isLoading: isWordsLoading } = useWords(bookId);
  const { data: settings, isLoading: isSettingsLoading } = useSettings();

  if (isWordsLoading || isSettingsLoading) {
    return <Loading />;
  }

  const { perPage = 10, layout = "list" } = settings ?? {};
  const pageCount = Math.max(1, Math.ceil(words.length / perPage));

  const handleToggleVisibility = () => {
    setHideMeanings(!hideMeanings);
  };

  const handleAddWord = () => {
    setModalMode("add");
    setEditingData(undefined);
    setModalOpen(true);
  };

  const handleEditWord = (id: number) => {
    const word = words.find((w) => w.id === id);

    if (!word) {
      return;
    }

    setModalMode("edit");
    setEditingData(word);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Words List */}
      <WordsList
        hideMeanings={hideMeanings}
        layout={layout}
        onEditWord={handleEditWord}
        page={page}
        perPage={perPage}
        words={words}
      />

      <BottomBar
        isHidden={hideMeanings}
        onAddWord={handleAddWord}
        onToggleVisibility={handleToggleVisibility}
        page={page}
        pageCount={pageCount}
        setPage={setPage}
        showToggleButton={words.length > 0}
      />

      {/* Word Modal managed within Home Tab */}
      <WordModal
        bookId={bookId}
        initialData={editingData}
        mode={modalMode}
        onOpenChange={setModalOpen}
        open={modalOpen}
      />
    </div>
  );
}
