import { create } from "zustand";
import { persist } from "zustand/middleware";

export type animation = "on" | "off";

interface animationState {
  animation: animation;
  setAnimation: (value: animation) => void;
  resetAnimation: () => void;
}

export const useAnimation = create<animationState>()(
  persist(
    (set) => ({
      animation: "on", // default

      setAnimation: (value) => set({ animation: value }),

      resetAnimation: () => set({ animation: "on" }),
    }),
    {
      name: "animation-next-episode-settings",
    },
  ),
);
