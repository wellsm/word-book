import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
import { SettingsSchema } from "@/schemas/settings";

type SettingsFormData = z.infer<typeof SettingsSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: SettingsFormData) => void;
  initialSettings: SettingsFormData;
};

export function SettingsModal({
  open,
  onOpenChange,
  onSave,
  initialSettings,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsSchema),
    mode: "onChange",
    defaultValues: initialSettings,
  });

  useEffect(() => {
    if (open) {
      reset(initialSettings);
    }
  }, [open, initialSettings, reset]);

  const onSubmit = (data: SettingsFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="perPage">Words per page</Label>
            <Input
              id="perPage"
              max={20}
              min={1}
              type="number"
              {...register("perPage", { valueAsNumber: true })}
            />
            {errors.perPage && (
              <p className="text-destructive text-sm">
                {errors.perPage.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="colorLeft">Left background color</Label>
              <div className="flex gap-2">
                <Input
                  className="h-9 w-12 rounded border p-1"
                  id="colorLeft"
                  type="color"
                  {...register("colorLeft")}
                />
                <Input
                  className="flex-1"
                  placeholder="#f6f7fb"
                  type="text"
                  {...register("colorLeft")}
                />
              </div>
              {errors.colorLeft && (
                <p className="text-destructive text-sm">
                  {errors.colorLeft.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorRight">Right background color</Label>
              <div className="flex gap-2">
                <Input
                  className="h-9 w-12 rounded border p-1"
                  id="colorRight"
                  type="color"
                  {...register("colorRight")}
                />
                <Input
                  className="flex-1"
                  placeholder="#eefaf1"
                  type="text"
                  {...register("colorRight")}
                />
              </div>
              {errors.colorRight && (
                <p className="text-destructive text-sm">
                  {errors.colorRight.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={!isValid} size="sm" type="submit">
              Save Settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
