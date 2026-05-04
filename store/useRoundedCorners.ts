import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RoundedCorners = "small" | "medium" | "large";

interface RoundedCornersState {
  rounded: RoundedCorners;
  setRounded: (rounded: RoundedCorners) => void;
  resetRounded: () => void;
}

export const useRoundedCorners = create<RoundedCornersState>()(
  persist(
    (set) => ({
      rounded: "medium", // default

      setRounded: (rounded) => set({ rounded }),

      resetRounded: () => set({ rounded: "medium" }),
    }),
    {
      name: "rounded-corners-settings",
    },
  ),
);
