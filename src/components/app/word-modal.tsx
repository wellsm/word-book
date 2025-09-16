import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddWord, useDeleteWord, useUpdateWord } from "@/hooks/use-words";
import { searchWordMeaning } from "@/lib/dictionary";
import type { WordRecord } from "@/schemas/word";

const WordFormSchema = z.object({
  term: z.string().min(1, "Word is required"),
  meaning: z.string().optional(),
  bookId: z.number().min(1, "Book is required"),
});

type WordFormData = z.infer<typeof WordFormSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<WordRecord>;
  mode: "add" | "edit";
  bookId: number;
};

export function WordModal({
  open,
  onOpenChange,
  initialData,
  mode,
  bookId,
}: Props) {
  const [isSearchingMeaning, setIsSearchingMeaning] = useState(false);

  // Use hooks directly in the modal
  const addWordMutation = useAddWord();
  const updateWordMutation = useUpdateWord();
  const deleteWordMutation = useDeleteWord();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WordFormData>({
    resolver: zodResolver(WordFormSchema),
    mode: "onChange",
    defaultValues: {
      term: initialData?.term || "",
      meaning: initialData?.meaning || "",
      bookId: initialData?.bookId || bookId,
    },
  });

  const currentTerm = watch("term");

  useEffect(() => {
    if (open) {
      reset({
        term: initialData?.term || "",
        meaning: initialData?.meaning || "",
        bookId: initialData?.bookId || bookId,
      });
      setIsSearchingMeaning(false);
    }
  }, [open, initialData, reset, bookId]);

  const handleSearchMeaning = async () => {
    if (!currentTerm?.trim()) {
      toast.error("Please enter a word first");
      return;
    }

    setIsSearchingMeaning(true);
    try {
      const meaning = await searchWordMeaning(currentTerm.trim());
      setValue("meaning", meaning);
      toast.success("Definition found!");
    } catch (error) {
      toast.error(
        `Failed to find definition: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSearchingMeaning(false);
    }
  };

  const onSubmit = async (data: WordFormData) => {
    try {
      if (mode === "add") {
        await addWordMutation.mutateAsync({
          term: data.term,
          meaning: data.meaning || "",
          learned: false,
          bookId: data.bookId,
        });
      } else if (mode === "edit" && initialData?.id) {
        await updateWordMutation.mutateAsync({
          id: initialData.id,
          updates: {
            term: data.term,
            meaning: data.meaning || "",
            bookId: data.bookId,
          },
        });
      }
      onOpenChange(false);
      reset();
    } catch {
      // Error handled by mutation hooks
    }
  };

  const handleDelete = async () => {
    if (mode === "edit" && initialData?.id) {
      try {
        await deleteWordMutation.mutateAsync(initialData.id);
        onOpenChange(false);
      } catch {
        // Error handled by mutation hooks
      }
    }
  };

  const getSubmitButtonText = () => {
    if (addWordMutation.isPending || updateWordMutation.isPending) {
      return "Saving...";
    }
    return mode === "add" ? "Add Word" : "Save Changes";
  };

  const getSearchButtonContent = () => {
    if (isSearchingMeaning) {
      return (
        <>
          <span className="mr-2 animate-spin">⏳</span>
          Searching...
        </>
      );
    }
    return "📖 Search Definition";
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Word" : "Edit Word"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="term">Word / Command</Label>
            <Input
              id="term"
              placeholder="Enter word or command"
              {...register("term")}
            />
            {errors.term && (
              <p className="text-destructive text-sm">{errors.term.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meaning">Meaning</Label>
              {mode === "add" && (
                <Button
                  disabled={isSearchingMeaning || !currentTerm?.trim()}
                  onClick={handleSearchMeaning}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {getSearchButtonContent()}
                </Button>
              )}
            </div>
            <Textarea
              className="resize-none"
              id="meaning"
              placeholder="Enter meaning or use dictionary search"
              rows={5}
              {...register("meaning")}
            />
            {errors.meaning && (
              <p className="text-destructive text-sm">
                {errors.meaning.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            {mode === "edit" && (
              <Button
                disabled={deleteWordMutation.isPending}
                onClick={handleDelete}
                size="sm"
                type="button"
                variant="destructive"
              >
                {deleteWordMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button
              onClick={() => onOpenChange(false)}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={
                addWordMutation.isPending ||
                updateWordMutation.isPending ||
                !currentTerm?.trim()
              }
              size="sm"
              type="submit"
            >
              {getSubmitButtonText()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
