import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { WordRecord } from "@/lib/db";
import { getColorClass } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type QuizStartedProps = {
  words: WordRecord[];
  stopQuiz: () => void;
};

export const QuizStarted = ({ words, stopQuiz }: QuizStartedProps) => {
  const [availableWords, setAvailableWords] = useState<WordRecord[]>([]);
  const [seenWords, setSeenWords] = useState<WordRecord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [meaningRevealed, setMeaningRevealed] = useState(false);

  const getRandomWord = useCallback(
    (wordsArray: WordRecord[]): WordRecord | null => {
      if (wordsArray.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * wordsArray.length);

      return wordsArray[randomIndex];
    },
    []
  );

  const startQuiz = () => {
    const shuffledWords = [...words];
    const firstWord = getRandomWord(shuffledWords);

    if (firstWord) {
      setAvailableWords(shuffledWords.filter((w) => w.id !== firstWord.id));
      setSeenWords([firstWord]);
      setCurrentWordIndex(0);
      setMeaningRevealed(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount
  useEffect(() => {
    startQuiz();
  }, []);

  if (availableWords.length === 0 && seenWords.length === 0) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  const revealMeaning = () => {
    setMeaningRevealed(true);
  };

  const nextWord = () => {
    if (currentWordIndex < seenWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setMeaningRevealed(false);
    } else if (availableWords.length > 0) {
      const nextRandomWord = getRandomWord(availableWords);
      if (nextRandomWord) {
        setSeenWords([...seenWords, nextRandomWord]);
        setAvailableWords(
          availableWords.filter((w) => w.id !== nextRandomWord.id)
        );
        setCurrentWordIndex(currentWordIndex + 1);
        setMeaningRevealed(false);
      }
    }
  };

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setMeaningRevealed(false);
    }
  };

  const currentWord = seenWords[currentWordIndex];
  const isFirst = currentWordIndex === 0;
  const isLast =
    currentWordIndex === seenWords.length - 1 && availableWords.length === 0;
  const progress = seenWords.length;
  const total = words.length;

  return (
    <div className="flex h-screen flex-col justify-center space-y-6 p-8 pb-48">
      {/* Quiz Header */}
      <div className="space-y-2 text-center">
        <h2 className="font-bold text-2xl">🎯 Quiz in Progress</h2>
        <p className="text-muted-foreground">
          Word {currentWordIndex + 1} of {progress} seen •{" "}
          {availableWords.length} remaining
        </p>
      </div>

      {/* Quiz Card */}
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          {/* Word Display */}
          <div className="text-center">
            <Badge
              className={`text-center font-black text-2xl text-foreground lowercase leading-tight tracking-wide drop-shadow-sm ${getColorClass(currentWord.color)} rounded-2xl px-6 py-2`}
            >
              {currentWord.term}
            </Badge>
          </div>

          {/* Meaning Section */}
          <div className="flex min-h-16 items-center justify-center border-t pt-4">
            {meaningRevealed ? (
              <p className="text-center font-medium text-lg text-muted-foreground leading-relaxed">
                {currentWord.meaning}
              </p>
            ) : (
              <Button
                className="flex items-center gap-2"
                onClick={revealMeaning}
                variant="outline"
              >
                <Eye className="h-4 w-4" />
                Reveal Meaning
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-3">
        <Button
          disabled={isFirst}
          onClick={previousWord}
          size="sm"
          variant="outline"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <Button onClick={stopQuiz} size="sm" variant="destructive">
          <RotateCcw className="mr-1 h-4 w-4" />
          Stop
        </Button>

        <Button
          disabled={isLast}
          onClick={nextWord}
          size="sm"
          variant="outline"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="text-center text-muted-foreground text-sm">
        Progress: {progress}/{total} words
      </div>
    </div>
  );
};
