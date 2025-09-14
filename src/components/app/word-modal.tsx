import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
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
import type { WordRecord } from "@/lib/db";

const WordFormSchema = z.object({
  term: z.string().min(1, "Word is required"),
  meaning: z.string().min(1, "Meaning is required"),
  color: z.string(),
});

type WordFormData = z.infer<typeof WordFormSchema>;

const colorOptions = [
  {
    value: "default",
    label: "Default",
    class: "bg-secondary text-secondary-foreground",
  },
  { value: "blue", label: "Blue", class: "bg-blue-500 text-white" },
  { value: "green", label: "Green", class: "bg-green-500 text-white" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500 text-black" },
  { value: "red", label: "Red", class: "bg-red-500 text-white" },
  { value: "purple", label: "Purple", class: "bg-purple-500 text-white" },
  { value: "orange", label: "Orange", class: "bg-orange-500 text-white" },
  { value: "pink", label: "Pink", class: "bg-pink-500 text-white" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<WordRecord>;
  mode: "add" | "edit";
};

export function WordModal({ open, onOpenChange, initialData, mode }: Props) {
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
    formState: { errors, isValid },
  } = useForm<WordFormData>({
    resolver: zodResolver(WordFormSchema),
    mode: "onChange",
    defaultValues: {
      term: initialData?.term || "",
      meaning: initialData?.meaning || "",
      color: initialData?.color || "default",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (open) {
      reset({
        term: initialData?.term || "",
        meaning: initialData?.meaning || "",
        color: initialData?.color || "default",
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: WordFormData) => {
    try {
      if (mode === "add") {
        await addWordMutation.mutateAsync({
          term: data.term,
          meaning: data.meaning,
          learned: false,
          color: data.color,
        });
      } else if (mode === "edit" && initialData?.id) {
        await updateWordMutation.mutateAsync({
          id: initialData.id,
          updates: {
            term: data.term,
            meaning: data.meaning,
            color: data.color,
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
            <Label htmlFor="meaning">Meaning</Label>
            <Textarea
              className="resize-none"
              id="meaning"
              placeholder="Enter meaning"
              rows={5}
              {...register("meaning")}
            />
            {errors.meaning && (
              <p className="text-destructive text-sm">
                {errors.meaning.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  className={`rounded-md border-2 p-2 transition-all ${
                    selectedColor === color.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                  key={color.value}
                  onClick={() => setValue("color", color.value)}
                  type="button"
                >
                  <Badge className={`${color.class} w-full justify-center`}>
                    {color.label}
                  </Badge>
                </button>
              ))}
            </div>
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
                !isValid ||
                addWordMutation.isPending ||
                updateWordMutation.isPending
              }
              size="sm"
              type="submit"
            >
              {(() => {
                if (addWordMutation.isPending || updateWordMutation.isPending) {
                  return "Saving...";
                }
                return mode === "add" ? "Add Word" : "Save Changes";
              })()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
