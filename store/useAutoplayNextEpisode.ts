import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AutoplayNextEpisode = "on" | "off";

interface AutoplayNextEpisodeState {
  autoplay: AutoplayNextEpisode;
  setAutoplay: (value: AutoplayNextEpisode) => void;
  resetAutoplay: () => void;
}

export const useAutoplayNextEpisode = create<AutoplayNextEpisodeState>()(
  persist(
    (set) => ({
      autoplay: "on", // default

      setAutoplay: (value) => set({ autoplay: value }),

      resetAutoplay: () => set({ autoplay: "on" }),
    }),
    {
      name: "autoplay-next-episode-settings",
    },
  ),
);
