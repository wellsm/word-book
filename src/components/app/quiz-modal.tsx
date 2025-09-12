import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WordRecord } from "@/lib/db";

type WordData = WordRecord;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: WordData | null;
};

export function QuizModal({ open, onOpenChange, word }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  useEffect(() => {
    setIsRevealed(!open);
  }, [open]);

  if (!word) {
    return null;
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quiz Time! 🎯</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Word display */}
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="font-black text-4xl text-foreground leading-tight tracking-wide">
                {word.term}
              </h1>
            </div>

            <p className="text-lg text-muted-foreground">
              What does this word mean?
            </p>
          </div>

          {/* Meaning reveal section */}
          <div className="flex min-h-[80px] items-center justify-center">
            {isRevealed ? (
              <div className="fade-in animate-in space-y-2 text-center duration-500">
                <div className="w-full border-border/30 border-t pt-4">
                  <p className="text-muted-foreground text-xl leading-relaxed">
                    {word.meaning}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground italic">
                  Think about it, then reveal the answer...
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={handleClose} type="button" variant="outline">
            Close
          </Button>
          {!isRevealed && (
            <Button onClick={handleReveal} type="button">
              Reveal
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
