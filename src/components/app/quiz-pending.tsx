import type { WordRecord } from "@/schemas/word";
import { Button } from "../ui/button";

type QuizPendingProps = {
  hasEnoughWordsForQuiz: boolean;
  words: WordRecord[];
  startQuiz: () => void;
};

export const QuizPending = ({
  hasEnoughWordsForQuiz,
  words,
  startQuiz,
}: QuizPendingProps) => {
  return (
    <div className="flex h-screen flex-col justify-center space-y-4 p-8 pb-48">
      <div className="space-y-2">
        <h2 className="font-bold text-3xl">🎯 Quiz Mode</h2>
        <p className="text-lg text-muted-foreground">
          Test your vocabulary knowledge
        </p>
      </div>

      {!hasEnoughWordsForQuiz && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="font-medium text-amber-800">
            ⚠️ You need at least 2 words to start a quiz
          </div>
          <div className="mt-1 text-amber-600 text-sm">
            Add more words to unlock quiz mode
          </div>
        </div>
      )}

      <div className="flex justify-around gap-4">
        <div className="text-center">
          <div className="font-bold text-2xl text-primary">{words.length}</div>
          <div className="text-muted-foreground text-sm">Total Words</div>
        </div>
        {/* <div className="text-center">
            <div className="font-bold text-2xl text-green-600">
              {words.filter((item) => item.learned).length}
            </div>
            <div className="text-muted-foreground text-sm">Learned</div>
          </div> */}
      </div>

      <div className="space-y-4">
        <Button
          className="w-full"
          disabled={!hasEnoughWordsForQuiz}
          onClick={startQuiz}
          size="lg"
        >
          Start Random Quiz
        </Button>
      </div>
    </div>
  );
};
