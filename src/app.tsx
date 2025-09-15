import { PWAInstallPrompt } from "@/components/app/pwa-install-prompt";
import { PWAUpdatePrompt } from "@/components/app/pwa-update-prompt";
import { Toaster } from "@/components/ui/sonner";
import { Notebook } from "@/pages/notebook";
import { ThemeProvider } from "@/providers/theme";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Notebook />
      <Toaster position="top-center" richColors />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </ThemeProvider>
  );
}
