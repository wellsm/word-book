import { Edit2, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import type { z } from "zod";
import type { WordSchema } from "@/schemas/word";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const getColorClass = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-500 text-white";
    case "green":
      return "bg-green-500 text-white";
    case "yellow":
      return "bg-yellow-500 text-black";
    case "red":
      return "bg-red-500 text-white";
    case "purple":
      return "bg-purple-500 text-white";
    case "orange":
      return "bg-orange-500 text-white";
    case "pink":
      return "bg-pink-500 text-white";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

type Props = {
  item: z.infer<typeof WordSchema>;
  onEdit: () => void;
  hideMeanings: boolean;
};

export function Row({ item, onEdit, hideMeanings }: Props) {
  const [hidden, setHidden] = useState<boolean>(hideMeanings);

  const handleClick = () => {
    setHidden(!hidden);
  };

  useEffect(() => {
    setHidden(hideMeanings);
  }, [hideMeanings]);

  return (
    <div className="w-full">
      <Card
        className={`relative cursor-pointer select-none overflow-hidden border-2 bg-gradient-to-br from-card via-card/95 to-muted/30 p-0 pt-4 ${
          hidden && "pb-4"
        }`}
        onClick={handleClick}
      >
        <CardContent className="h-full p-0">
          <div className="flex h-full flex-col items-center">
            {/* Word Section - Always visible, larger and centered */}
            <div className="flex flex-1 items-center justify-center">
              <h1 className="text-center font-black text-2xl text-foreground leading-tight tracking-wide drop-shadow-sm">
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
