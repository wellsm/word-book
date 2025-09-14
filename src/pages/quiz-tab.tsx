import { useState } from "react";
import { QuizPending } from "@/components/app/quiz-pending";
import { QuizStarted } from "@/components/app/quiz-started";
import { useWords } from "@/hooks/use-words";

type QuizState = "initial" | "active";

export function QuizTab() {
  const { data: words = [], isLoading } = useWords();

  // Quiz state management
  const [quizState, setQuizState] = useState<QuizState>("initial");

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const hasEnoughWordsForQuiz = words.length >= 2;

  // Initial quiz screen
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
