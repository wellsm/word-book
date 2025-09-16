import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getColorClass } from "@/lib/utils";
import type { BookRecord } from "@/schemas/book";

type BookCardProps = {
  book: BookRecord;
  onEdit: () => void;
  onSelect: () => void;
};

export function BookCard({ book, onEdit, onSelect }: BookCardProps) {
  return (
    <Card
      className={cn(
        "group relative border-2 transition-shadow hover:shadow-md",
        `border-${getColorClass(book.color).replace("bg-", "").split(" ")[0]}`
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <button className="flex-1 text-left" onClick={onSelect} type="button">
            <CardTitle className="mb-2 font-semibold text-lg">
              {book.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getColorClass(book.color)}>
                {book.type.toUpperCase()}
              </Badge>
            </div>
          </button>
          <Button
            className="transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            size="sm"
            variant="ghost"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <button className="w-full text-left" onClick={onSelect} type="button">
          <div className="text-muted-foreground text-sm">
            Click to view words in this book
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
