import { Home, Settings, Target } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/app/header";
import { QuizModal } from "@/components/app/quiz-modal";
import { WordModal } from "@/components/app/word-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/use-settings";
import { useWords } from "@/hooks/use-words";
import type { WordRecord } from "@/lib/db";
import { HomeTab } from "@/pages/home-tab";
import { QuizTab } from "@/pages/quiz-tab";
import { SettingsTab } from "@/pages/settings-tab";

export function Notebook() {
  const [modalOpen, setModalOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [editingData, setEditingData] = useState<
    Partial<WordRecord> | undefined
  >();
  const [quizWord] = useState<WordRecord | null>(null);
  const [activeTab, setActiveTab] = useState("home");

  // Hooks
  const { data: words = [], isLoading: wordsLoading } = useWords();
  const { isLoading: settingsLoading } = useSettings();

  if (wordsLoading || settingsLoading) {
    return <div className="p-6">Loading…</div>;
  }

  const handleAddWord = () => {
    setModalMode("add");
    setEditingData(undefined);
    setModalOpen(true);
  };

  const handleEditWord = (globalIdx: number) => {
    setModalMode("edit");
    setEditingData(words[globalIdx]);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-32">
      <Header />

      <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
        {/* Home Tab */}
        <TabsContent className="mt-0" value="home">
          <HomeTab onAddWord={handleAddWord} onEditWord={handleEditWord} />
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent className="mt-0" value="quiz">
          <QuizTab />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent className="mt-0" value="settings">
          <SettingsTab />
        </TabsContent>

        {/* Fixed Bottom Tabs Navigation */}
        <TabsList className="fixed right-0 bottom-0 left-0 grid h-16 w-full grid-cols-3 rounded-none border-t bg-background/95 p-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsTrigger
            className="flex flex-col items-center rounded-none border-0 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="home"
          >
            <Home className="h-4 w-4" />
            Home
          </TabsTrigger>
          <TabsTrigger
            className="flex flex-col items-center rounded-none border-0 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="quiz"
          >
            <Target className="h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger
            className="flex flex-col items-center rounded-none border-0 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="settings"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <WordModal
        initialData={editingData}
        mode={modalMode}
        onOpenChange={setModalOpen}
        open={modalOpen}
      />

      <QuizModal onOpenChange={setQuizOpen} open={quizOpen} word={quizWord} />
    </div>
  );
}
