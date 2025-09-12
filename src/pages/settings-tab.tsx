import { Download, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useDeleteDatabase,
  useSettings,
  useUpdateSettings,
} from "@/hooks/use-settings";
import { useExportData, useImportData } from "@/hooks/use-words";
import type { SettingsRecord } from "@/lib/db";
import { MAX_PER_PAGE } from "@/schemas/settings";

export function SettingsTab() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<SettingsRecord | null>(
    null
  );

  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const deleteDatabase = useDeleteDatabase();
  const exportData = useExportData();
  const importData = useImportData();

  // Initialize local settings when settings are loaded
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Initialize default settings if they don't exist
  useEffect(() => {
    if (!(isLoading || settings)) {
      const defaultSettings = {
        perPage: 10,
      };
      updateSettings.mutate(defaultSettings);
    }
  }, [isLoading, settings, updateSettings]);

  if (isLoading || !settings || !localSettings) {
    return (
      <div className="space-y-4 p-8">
        <div>Loading settings...</div>
      </div>
    );
  }

  const handlePerPageChange = (value: number) => {
    if (value >= 1 && value <= MAX_PER_PAGE) {
      setLocalSettings({
        ...localSettings,
        perPage: value,
      });
    }
  };

  const handleSave = () => {
    updateSettings.mutate(localSettings);
  };

  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(localSettings);

  const handleExport = async () => {
    try {
      const result = await exportData.mutateAsync();
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wordbook.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast("Export failed. Please try again.");
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importData.mutateAsync(data);
      toast("Imported successfully ✅");
    } catch {
      toast("Invalid JSON file");
    }
  };

  const handleDeleteDatabase = async () => {
    try {
      await deleteDatabase.mutateAsync();
      toast("Database deleted successfully. Please refresh the page.");

      window.location.reload();
    } catch {
      toast("Failed to delete database. Please try again.");
    }
  };

  return (
    <div className="space-y-4 p-8">
      <div className="space-y-2">
        <h2 className="font-bold text-2xl">⚙️ Settings</h2>
        <p className="text-muted-foreground">
          Customize your learning experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="perPage">Words per page</Label>
          <Input
            id="perPage"
            max={MAX_PER_PAGE}
            min={1}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value, 10);
              handlePerPageChange(value);
            }}
            type="number"
            value={localSettings.perPage}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-start">
          <Button
            className="flex items-center"
            disabled={!hasUnsavedChanges || updateSettings.isPending}
            onClick={handleSave}
            variant="default"
          >
            <Save className="mr-2 h-4 w-4" />
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <div className="hidden border-t pt-4">
          <h3 className="mb-3 font-semibold text-lg">Data Management</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              className="flex items-center"
              disabled={exportData.isPending}
              onClick={handleExport}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              {exportData.isPending ? "Exporting..." : "Export Data"}
            </Button>

            <label className="inline-flex">
              <input
                accept="application/json"
                disabled={importData.isPending}
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  await handleImport(file);
                  e.currentTarget.value = "";
                }}
                type="file"
              />
              <Button
                asChild
                className="flex w-full items-center"
                disabled={importData.isPending}
                variant="outline"
              >
                <div>
                  <Upload className="mr-2 h-4 w-4" />
                  {importData.isPending ? "Importing..." : "Import Data"}
                </div>
              </Button>
            </label>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="mb-3 font-semibold text-lg">Danger Zone</h3>
          <Button
            className="flex items-center"
            disabled={deleteDatabase.isPending}
            onClick={() => setDeleteDialogOpen(true)}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteDatabase.isPending ? "Deleting..." : "Delete All Data"}
          </Button>
          <p className="mt-2 text-muted-foreground text-sm">
            This will permanently delete all your words and settings. This
            action cannot be undone.
          </p>
        </div>
      </div>

      <ConfirmationDialog
        cancelLabel="Cancel"
        confirmLabel="Delete Everything"
        description="Are you sure you want to delete all your words and settings? This action cannot be undone and will reset the application to its initial state."
        onConfirm={handleDeleteDatabase}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        title="Delete All Data"
        variant="destructive"
      />
    </div>
  );
}
