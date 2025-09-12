import { Edit2, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import type { WordRecord } from "@/lib/db";
import { getColorClass } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useUpdateWord } from "@/hooks/use-words";

type Props = {
  item: WordRecord;
  onEdit: () => void;
  hideMeanings: boolean;
};

export function Row({ item, onEdit, hideMeanings }: Props) {
  const [hidden, setHidden] = useState<boolean>(hideMeanings);
  const { mutate: updateWord } = useUpdateWord();

  const handleClick = () => {
    setHidden(!hidden);
  };

  useEffect(() => {
    setHidden(hideMeanings);
  }, [hideMeanings]);

  return (
    <div className="w-full">
      <Card
        className={`relative cursor-pointer select-none overflow-hidden rounded-none border-2 bg-gradient-to-br from-card via-card/95 to-muted/30 p-0 pt-4 ${
          hidden && "pb-4"
        }`}
        onClick={handleClick}
      >
        <CardContent className="h-full p-0">
          <div className="flex h-full flex-col items-center">
            {/* Word Section - Always visible, larger and centered */}
            <div className="flex flex-1 items-center justify-center">
              <h1 className="text-center font-black text-2xl text-foreground lowercase leading-tight tracking-wide drop-shadow-sm">
                {item.term}
              </h1>
              <div
                className={`${getColorClass(item.color)} absolute top-2 left-0 h-full w-2 scale-y-200`}
              />
              {!hidden && (
                <Button
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Meaning Section - With smooth transition based on global state */}
            {!hidden && (
              <div className="mt-2 w-full border-border/30 border-t bg-muted/20 transition-all duration-700 ease-out">
                <p className="p-2 text-center font-medium text-lg text-muted-foreground leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            )}
          </div>

          {/* Visual indicator when meanings are globally hidden */}
          {hidden && (
            <div className="absolute top-4 right-4">
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          {/* Subtle gradient overlay for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/5 to-transparent" />
        </CardContent>
      </Card>
    </div>
  );
}
