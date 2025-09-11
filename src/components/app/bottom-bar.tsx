import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Shuffle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Props = {
  isHidden: boolean;
  onToggleVisibility: () => void;
  onAddWord: () => void;
  onOpenSettings: () => void;
  onRandomQuiz: () => void;
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
  showQuiz: boolean;
};

export function BottomBar({
  isHidden,
  onToggleVisibility,
  onAddWord,
  onOpenSettings,
  onRandomQuiz,
  page,
  pageCount,
  setPage,
  showQuiz,
}: Props) {
  const showPagination = pageCount > 1;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background shadow-lg">
      <div className="flex w-full justify-center py-3">
        <div
          className={`flex flex-wrap items-center gap-3 ${showPagination ? "justify-between" : "justify-center"}`}
        >
          {/* Left side - Pagination (only show if multiple pages) */}
          {showPagination && (
            <div className="flex items-center gap-2">
              <Button
                disabled={page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}
                size="lg"
                variant="secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Badge className="py-[0.325rem] text-lg" variant="secondary">
                {page}/{pageCount}
              </Badge>
              <Button
                disabled={page >= pageCount}
                onClick={() => setPage(Math.min(pageCount, page + 1))}
                size="lg"
                variant="secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button onClick={onAddWord} size="lg">
              <Plus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add Word</span>
            </Button>

            <Button
              onClick={onToggleVisibility}
              size="lg"
              variant={isHidden ? "default" : "secondary"}
            >
              {isHidden ? (
                <>
                  <Eye className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Show page</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Hide page</span>
                </>
              )}
            </Button>

            <Button onClick={onOpenSettings} size="lg" variant="outline">
              <Settings className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Settings</span>
            </Button>

            {showQuiz && (
              <Button onClick={onRandomQuiz} size="lg" variant="secondary">
                <Shuffle className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Random Quiz</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
