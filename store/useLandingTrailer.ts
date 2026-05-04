import { create } from "zustand";
import { persist } from "zustand/middleware";

export type landingTrailer = "on" | "off";

interface animationState {
  landingTrailer: landingTrailer;
  setLandingTrailer: (value: landingTrailer) => void;
  resetLandingTrailer: () => void;
}

export const useLandingTrailer = create<animationState>()(
  persist(
    (set) => ({
      landingTrailer: "on",

      setLandingTrailer: (value) => set({ landingTrailer: value }),

      resetLandingTrailer: () => set({ landingTrailer: "on" }),
    }),
    {
      name: "landing-trailer-settings",
    },
  ),
);
