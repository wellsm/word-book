import { Home, Settings, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "@/components/app/header";
import { QuizModal } from "@/components/app/quiz-modal";
import { WordModal } from "@/components/app/word-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import {
  useAddWord,
  useDeleteWord,
  useUpdateWord,
  useWords,
} from "@/hooks/use-words";
import type { WordRecord } from "@/lib/db";
import { HomeTab } from "@/pages/home-tab";
import { QuizTab } from "@/pages/quiz-tab";
import { SettingsTab } from "@/pages/settings-tab";

export function Notebook() {
  // State management
  const [modalOpen, setModalOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<
    Partial<WordRecord> | undefined
  >();
  const [quizWord, setQuizWord] = useState<WordRecord | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [currentPage, setCurrentPage] = useState(1); // Always reset to 1 on refresh

  // Hooks
  const { data: words = [], isLoading: wordsLoading } = useWords();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const addWordMutation = useAddWord();
  const updateWordMutation = useUpdateWord();
  const deleteWordMutation = useDeleteWord();
  const updateSettingsMutation = useUpdateSettings();

  // Computed values
  const isLoading = wordsLoading || settingsLoading;
  const perPage = settings?.perPage || 10;

  // Create state-like object for compatibility with existing tabs
  const state = useMemo(
    () => ({
      items: words,
      page: currentPage,
      settings: {
        perPage: settings?.perPage ?? 10,
        colorLeft: "#f6f7fb", // hardcoded default
        colorRight: "#eefaf1", // hardcoded default
      },
      hideMeanings: true, // hardcoded default
    }),
    [words, currentPage, settings]
  );

  // Update function for compatibility
  const update = (updater: (s: typeof state) => typeof state) => {
    const newState = updater(state);

    // Update page if changed
    if (newState.page !== currentPage) {
      setCurrentPage(newState.page);
    }

    // Update settings if changed
    if (settings && newState.settings.perPage !== settings.perPage) {
      updateSettingsMutation.mutate({
        id: settings.id,
        perPage: newState.settings.perPage,
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading…</div>;
  }

  const handleAddWord = () => {
    setModalMode("add");
    setEditingData(undefined);
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEditWord = (globalIdx: number) => {
    setModalMode("edit");
    setEditingData(words[globalIdx]);
    setEditingIndex(globalIdx);
    setModalOpen(true);
  };

  const handleSaveWord = async (wordData: Partial<WordRecord>) => {
    if (modalMode === "add") {
      await addWordMutation.mutateAsync({
        term: wordData.term || "",
        meaning: wordData.meaning || "",
        learned: false,
        color: wordData.color || "default",
      });
      // Navigate to last page to see the new word
      const newPageCount = Math.max(1, Math.ceil((words.length + 1) / perPage));
      setCurrentPage(newPageCount);
    } else if (modalMode === "edit" && editingIndex !== null) {
      const editingWord = words[editingIndex];
      if (editingWord?.id) {
        await updateWordMutation.mutateAsync({
          id: editingWord.id,
          updates: wordData,
        });
      }
    }
    setModalOpen(false);
  };

  const handleDeleteWord = async () => {
    if (modalMode === "edit" && editingIndex !== null) {
      const editingWord = words[editingIndex];
      if (editingWord?.id) {
        await deleteWordMutation.mutateAsync(editingWord.id);
      }
      setModalOpen(false);
    }
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
          <QuizTab
            onSetActiveTab={setActiveTab}
            state={state}
            update={update}
          />
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
        onDelete={modalMode === "edit" ? handleDeleteWord : undefined}
        onOpenChange={setModalOpen}
        onSave={handleSaveWord}
        open={modalOpen}
      />

      <QuizModal onOpenChange={setQuizOpen} open={quizOpen} word={quizWord} />
    </div>
  );
}
