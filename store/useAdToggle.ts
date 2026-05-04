import { create } from "zustand";
import { persist } from "zustand/middleware";

export type adToggle = "on" | "off";

interface adToggleState {
  adToggle: adToggle;
  setAdToggle: (value: adToggle) => void;
  resetAdToggle: () => void;
}

export const useAdToggle = create<adToggleState>()(
  persist(
    (set) => ({
      adToggle: "on",

      setAdToggle: (value) => set({ adToggle: value }),

      resetAdToggle: () => set({ adToggle: "on" }),
    }),
    {
      name: "ad-toggle-settings",
    },
  ),
);
