import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccentColor = "red" | "blue" | "green" | "purple" | "orange";

interface AccentColorState {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  resetAccent: () => void;
}

export const useAccentColor = create<AccentColorState>()(
  persist(
    (set) => ({
      accent: "red", // default

      setAccent: (accent) => set({ accent }),

      resetAccent: () => set({ accent: "red" }),
    }),
    {
      name: "accent-color-settings",
    },
  ),
);
