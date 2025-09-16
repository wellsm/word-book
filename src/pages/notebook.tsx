import { Book, Home, Settings, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/app/header";
import { Loading } from "@/components/app/loading";
import { QuizModal } from "@/components/app/quiz-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBooks } from "@/hooks/use-books";
import { useSettings, useUpdateSelectedBook } from "@/hooks/use-settings";
import { useWords } from "@/hooks/use-words";
import { cn } from "@/lib/utils";
import { BooksTab } from "@/pages/books-tab";
import { HomeTab } from "@/pages/home-tab";
import { QuizTab } from "@/pages/quiz-tab";
import { SettingsTab } from "@/pages/settings-tab";
import type { BookRecord } from "@/schemas/book";
import type { WordRecord } from "@/schemas/word";

export function Notebook() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizWord] = useState<WordRecord | null>(null);
  const [activeTab, setActiveTab] = useState("books");
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);

  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { isLoading: wordsLoading } = useWords();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { mutateAsync: updateSelectedBook } = useUpdateSelectedBook();

  useEffect(() => {
    if (settings?.selectedBookId) {
      const book = books.find((b) => b.id === settings.selectedBookId);

      if (book) {
        setSelectedBook(book);
      }
    }
  }, [settings?.selectedBookId, books]);

  if (wordsLoading || settingsLoading || booksLoading) {
    return <Loading />;
  }

  const handleSelectBook = async (book: BookRecord) => {
    setSelectedBook(book);
    setActiveTab("home");

    await updateSelectedBook(book.id);
  };

  const showWordsAndQuizTabs = Boolean(
    settings?.selectedBookId && selectedBook
  );

  return (
    <div className="mx-auto w-full max-w-5xl pb-32">
      <Header selectedBook={selectedBook} />

      <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
        {/* Books Tab */}
        <TabsContent className="mt-0" value="books">
          <BooksTab onSelectBook={handleSelectBook} />
        </TabsContent>

        {/* Home Tab - only shown when a book is selected and saved in settings */}
        {selectedBook?.id && showWordsAndQuizTabs && (
          <TabsContent className="mt-0" value="home">
            <HomeTab bookId={selectedBook.id} />
          </TabsContent>
        )}

        {/* Quiz Tab - only shown when a book is selected and saved in settings */}
        {selectedBook?.id && showWordsAndQuizTabs && (
          <TabsContent className="mt-0" value="quiz">
            <QuizTab bookId={selectedBook.id} />
          </TabsContent>
        )}

        {/* Settings Tab */}
        <TabsContent className="mt-0" value="settings">
          <SettingsTab />
        </TabsContent>

        {/* Fixed Bottom Tabs Navigation */}
        <TabsList className="fixed right-0 bottom-0 left-0 flex h-16 w-full rounded-none border-t bg-background/95 p-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsTrigger
            className="flex flex-col items-center rounded-none border-0 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="books"
          >
            <Book className="h-4 w-4" />
            Books
          </TabsTrigger>

          {selectedBook?.id && showWordsAndQuizTabs && (
            <TabsTrigger
              className={cn(
                "flex flex-col items-center rounded-none border-0 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                !showWordsAndQuizTabs && "hidden"
              )}
              value="home"
            >
              <Home className="h-4 w-4" />
              Words
            </TabsTrigger>
          )}
          {selectedBook?.id && showWordsAndQuizTabs && (
            <TabsTrigger
              className={cn(
                "flex flex-col items-center rounded-none border-0 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                !showWordsAndQuizTabs && "hidden"
              )}
              value="quiz"
            >
              <Target className="h-4 w-4" />
              Quiz
            </TabsTrigger>
          )}

          <TabsTrigger
            className="flex flex-col items-center rounded-none border-0 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="settings"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <QuizModal onOpenChange={setQuizOpen} open={quizOpen} word={quizWord} />
    </div>
  );
}
