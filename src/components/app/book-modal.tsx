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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddBook, useDeleteBook, useUpdateBook } from "@/hooks/use-books";
import type { BookRecord } from "@/schemas/book";
import { LANGUAGE_EN, LanguageOptions } from "@/schemas/book";

const BookFormSchema = z.object({
  name: z.string().min(1, "Book name is required"),
  color: z.string(),
  type: z.enum(LanguageOptions),
  value: z.enum(LanguageOptions),
});

type BookFormData = z.infer<typeof BookFormSchema>;

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
  initialData?: Partial<BookRecord>;
  mode: "add" | "edit";
};

export function BookModal({ open, onOpenChange, initialData, mode }: Props) {
  // Use hooks directly in the modal
  const addBookMutation = useAddBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(BookFormSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      color: initialData?.color || "default",
      type: initialData?.type || LANGUAGE_EN,
      value: initialData?.value || LANGUAGE_EN,
    },
  });

  const selectedColor = watch("color");
  const currentName = watch("name");

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || "",
        color: initialData?.color || "default",
        type: initialData?.type || LANGUAGE_EN,
        value: initialData?.value || LANGUAGE_EN,
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: BookFormData) => {
    try {
      if (mode === "add") {
        await addBookMutation.mutateAsync({
          name: data.name,
          color: data.color,
          type: data.type,
          value: data.value,
        });
      } else if (mode === "edit" && initialData?.id) {
        await updateBookMutation.mutateAsync({
          id: initialData.id,
          updates: {
            name: data.name,
            color: data.color,
            type: data.type,
            value: data.value,
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
        await deleteBookMutation.mutateAsync(initialData.id);
        onOpenChange(false);
      } catch {
        // Error handled by mutation hooks
      }
    }
  };

  const getSubmitButtonText = () => {
    if (addBookMutation.isPending || updateBookMutation.isPending) {
      return "Saving...";
    }
    return mode === "add" ? "Create Book" : "Save Changes";
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
            {mode === "add" ? "Create New Book" : "Edit Book"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Book Name</Label>
            <Input
              id="name"
              placeholder="Enter book name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
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

          <div className="space-y-3">
            <Label>Language</Label>
            <RadioGroup
              onValueChange={(value) => {
                setValue("type", value as typeof LANGUAGE_EN);
                setValue("value", value as typeof LANGUAGE_EN);
              }}
              value={watch("type")}
            >
              {LanguageOptions.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem id={`language-${option}`} value={option} />
                  <Label
                    className="font-normal text-sm"
                    htmlFor={`language-${option}`}
                  >
                    English ({option})
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter className="gap-2">
            {mode === "edit" && (
              <Button
                disabled={deleteBookMutation.isPending}
                onClick={handleDelete}
                size="sm"
                type="button"
                variant="destructive"
              >
                {deleteBookMutation.isPending ? "Deleting..." : "Delete"}
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
                addBookMutation.isPending ||
                updateBookMutation.isPending ||
                !currentName?.trim()
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
