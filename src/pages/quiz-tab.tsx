import { useState } from "react";
import { Loading } from "@/components/app/loading";
import { QuizPending } from "@/components/app/quiz-pending";
import { QuizStarted } from "@/components/app/quiz-started";
import { useWords } from "@/hooks/use-words";

type QuizState = "initial" | "active";

type QuizTabProps = {
  bookId: number;
};

export function QuizTab({ bookId }: QuizTabProps) {
  const { data: words = [], isLoading } = useWords(bookId);

  const [quizState, setQuizState] = useState<QuizState>("initial");

  if (isLoading) {
    return <Loading />;
  }

  const hasEnoughWordsForQuiz = words.length >= 2;

  if (quizState === "initial") {
    return (
      <QuizPending
        hasEnoughWordsForQuiz={hasEnoughWordsForQuiz}
        startQuiz={() => setQuizState("active")}
        words={words}
      />
    );
  }

  return <QuizStarted stopQuiz={() => setQuizState("initial")} words={words} />;
}
