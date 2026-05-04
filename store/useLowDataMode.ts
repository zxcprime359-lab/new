import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LowDataMode = "low" | "mid" | "high";

interface LowDataModeState {
  lowDataMode: LowDataMode;
  setLowDataMode: (value: LowDataMode) => void;
  resetLowDataMode: () => void;
}

export const useLowDataMode = create<LowDataModeState>()(
  persist(
    (set) => ({
      lowDataMode: "mid", // default

      setLowDataMode: (value) => set({ lowDataMode: value }),

      resetLowDataMode: () => set({ lowDataMode: "mid" }),
    }),
    {
      name: "lowDataMode-next-episode-settings",
    },
  ),
);
