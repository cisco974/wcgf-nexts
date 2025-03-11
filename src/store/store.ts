import { create } from "zustand";

interface AppState {
  currentLocale: string;
  currentGame: string;
  setCurrentLocale: (locale: string) => void;
  setCurrentGame: (game: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentLocale: "en",
  currentGame: "tarot",
  setCurrentLocale: (locale) => set({ currentLocale: locale }),
  setCurrentGame: (game) => set({ currentGame: game }),
}));
