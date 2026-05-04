import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LayoutDensity = "compact" | "comfortable" | "spacious";

interface LayoutDensityState {
  density: LayoutDensity;
  setDensity: (density: LayoutDensity) => void;
  resetDensity: () => void;
}

export const useLayoutDensity = create<LayoutDensityState>()(
  persist(
    (set) => ({
      density: "comfortable", // default

      setDensity: (density) => set({ density }),

      resetDensity: () => set({ density: "comfortable" }),
    }),
    {
      name: "layout-density-settings",
    },
  ),
);
