import z from "zod";
import { Hex, MAX_PER_PAGE } from "@/schemas/settings";

const SettingsFormSchema = z.object({
  perPage: z.coerce.number().min(1).max(MAX_PER_PAGE),
  colorLeft: Hex,
  colorRight: Hex,
});

export type SettingsFormValues = z.infer<typeof SettingsFormSchema>;

export function SettingsBar() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 py-3">
      <div className="flex flex-wrap gap-3" />
    </div>
  );
}
