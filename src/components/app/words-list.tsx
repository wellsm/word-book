import { Row } from "@/components/app/row";
import type { WordRecord } from "@/schemas/word";

type WordsListProps = {
  words: WordRecord[];
  hideMeanings: boolean;
  layout: "list" | "two-column" | undefined;
  page: number;
  perPage: number;
  onEditWord: (index: number) => void;
};

export function WordsList({
  words,
  hideMeanings,
  layout,
  page,
  perPage,
  onEditWord,
}: WordsListProps) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const slice = words.slice(start, end) as WordRecord[];

  return (
    <div className="overflow-hidden bg-background shadow">
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
      {slice.map((item) => (
        <Row
          hideMeanings={hideMeanings}
          item={item}
          key={item.id}
          layout={layout}
          onEdit={() => item.id && onEditWord(item.id)}
        />
      ))}
    </div>
  );
}
