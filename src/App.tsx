import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notebook } from "./pages/notebook";
import { ThemeProvider } from "./providers/theme";

const qc = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Notebook />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
