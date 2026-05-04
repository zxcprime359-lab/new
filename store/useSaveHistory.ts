import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SaveHistory = "on" | "off";

interface SaveHistoryState {
  saveHistory: SaveHistory;
  setSaveHistory: (value: SaveHistory) => void;
  resetSaveHistory: () => void;
}

export const useSaveHistory = create<SaveHistoryState>()(
  persist(
    (set) => ({
      saveHistory: "on", // default

      setSaveHistory: (value) => set({ saveHistory: value }),

      resetSaveHistory: () => set({ saveHistory: "on" }),
    }),
    {
      name: "saveHistory-next-episode-settings",
    },
  ),
);
