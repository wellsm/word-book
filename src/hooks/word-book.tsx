import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { load, save } from "@/lib/utils";
import type { AppState } from "@/schemas/app";

export function useWordbook() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["wordbook"],
    queryFn: async () => load(),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const mutation = useMutation({
    mutationFn: async (updater: (s: AppState) => AppState) => {
      const next = updater(await load());

      save(next);

      return next;
    },
    onSuccess: (data) => qc.setQueryData(["wordbook"], data),
  });

  return { ...query, update: mutation.mutate };
}
