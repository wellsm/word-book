import { Toaster } from "@/components/ui/sonner";
import { Notebook } from "./pages/notebook";
import { ThemeProvider } from "./providers/theme";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Notebook />
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}
