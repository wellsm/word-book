import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Notebook } from "./pages/notebook";
import { ThemeProvider } from "./providers/theme";

const qc = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Notebook />
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
