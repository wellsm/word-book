import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type AppState, DEFAULT_STATE, StateSchema } from "@/schemas/app";

const STORAGE_KEY = "wordbook.react.v1";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

export function load(): Promise<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return Promise.resolve(DEFAULT_STATE);
    }

    const parsed = JSON.parse(raw);

    return Promise.resolve(
      StateSchema.parse({
        ...DEFAULT_STATE,
        ...parsed,
        settings: { ...DEFAULT_STATE.settings, ...(parsed?.settings || {}) },
      }) as AppState
    );
  } catch {
    return Promise.resolve(DEFAULT_STATE);
  }
}

export function save(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function download(
  filename: string,
  data: string,
  options: BlobPropertyBag = { type: "application/json" }
) {
  const blob = new Blob([data], options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export const getColorClass = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-500 text-white";
    case "green":
      return "bg-green-500 text-white";
    case "yellow":
      return "bg-yellow-500 text-black";
    case "red":
      return "bg-red-500 text-white";
    case "purple":
      return "bg-purple-500 text-white";
    case "orange":
      return "bg-orange-500 text-white";
    case "pink":
      return "bg-pink-500 text-white";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};
