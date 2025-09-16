import { Edit2, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { getColorClass } from "@/lib/utils";
import type { WordRecord } from "@/schemas/word";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type Props = {
  item: WordRecord;
  onEdit: () => void;
  hideMeanings: boolean;
  layout?: "list" | "two-column";
};

export function Row({ item, onEdit, hideMeanings, layout = "list" }: Props) {
  const [hidden, setHidden] = useState<boolean>(hideMeanings);

  const handleClick = () => {
    setHidden(!hidden);
  };

  useEffect(() => {
    setHidden(hideMeanings);
  }, [hideMeanings]);

  // Two-column layout
  if (layout === "two-column") {
    return (
      <Card className="relative cursor-pointer select-none overflow-hidden rounded-none border-0 p-0">
        <CardContent className={"h-full p-0"}>
          <div className="grid h-full min-h-16 grid-cols-2 items-center bg-muted/10">
            {/* Term Section - Left Side */}
            <div className="flex h-full w-full flex-1 items-center justify-center space-x-4 border-border/20 border-r font-bold text-foreground text-xl">
              {item.term}
            </div>

            {/* Meaning Section - Right Side */}
            <Button
              className="wrap-normal relative flex h-full w-full items-center justify-center rounded-none bg-background/50"
              onClick={handleClick}
            >
              {hidden && (
                <div className="absolute flex h-full w-full items-center justify-center">
                  <EyeOff className="h-4 w-4 text-muted-foreground/50" />
                </div>
              )}

              <p
                className={`w-full space-y-2 text-wrap p-0 text-left font-medium text-base text-muted-foreground ${hidden ? "opacity-0" : "opacity-100"}`}
              >
                {item.meaning.split("\n\n").map((meaning, index) => (
                  <p key={`${item.term}-${index}`}>{meaning}</p>
                ))}
              </p>
            </Button>
          </div>

          {/* Subtle gradient overlay for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/5 to-transparent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`relative cursor-pointer select-none overflow-hidden rounded-none border-0 p-0 pt-4 ${
        hidden && "pb-4"
      }`}
      onClick={handleClick}
    >
      <CardContent className="h-full p-0">
        <div className="flex h-full flex-col items-center">
          <div className="flex flex-1 items-center justify-center">
            <Badge
              className={`text-center font-black text-2xl text-foreground lowercase leading-tight tracking-wide drop-shadow-sm ${getColorClass(item.color)} rounded-2xl px-4`}
            >
              {item.term}
            </Badge>
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
  );
}
