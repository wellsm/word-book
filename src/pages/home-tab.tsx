import { Loader2 } from "lucide-react";
import { useState } from "react";
import { BottomBar } from "@/components/app/bottom-bar";
import { Row } from "@/components/app/row";
import { useSettings } from "@/hooks/use-settings";
import { useWords } from "@/hooks/use-words";
import type { WordRecord } from "@/lib/db";

type HomeTabProps = {
  onAddWord: () => void;
  onEditWord: (globalIdx: number) => void;
};

export function HomeTab({ onAddWord, onEditWord }: HomeTabProps) {
  const [hideMeanings, setHideMeanings] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const { data: words = [], isLoading: isWordsLoading } = useWords();
  const { data: settings = { perPage: 10 }, isLoading: isSettingsLoading } =
    useSettings();

  if (isWordsLoading || isSettingsLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  const perPage = settings.perPage;
  const pageCount = Math.max(1, Math.ceil(words.length / perPage));
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const slice = words.slice(start, end) as WordRecord[];

  const handleToggleVisibility = () => {
    setHideMeanings(!hideMeanings);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-background shadow">
        <div className="space-y-2">
          {slice.length === 0 && (
            <div className="space-y-4 p-8 py-48 text-center">
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
                hideMeanings={hideMeanings}
                item={item}
                key={globalIdx}
                onEdit={() => onEditWord(globalIdx)}
              />
            );
          })}
        </div>
      </div>

      <BottomBar
        isHidden={hideMeanings}
        onAddWord={onAddWord}
        onToggleVisibility={handleToggleVisibility}
        page={page}
        pageCount={pageCount}
        setPage={setPage}
        showToggleButton={words.length > 0}
      />
    </div>
  );
}
