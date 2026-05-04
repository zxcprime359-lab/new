import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CardStyle = "only" | "title" | "title-year";

interface CardStyleState {
  style: CardStyle;
  setStyle: (style: CardStyle) => void;
  resetStyle: () => void;
}

export const useCardStyle = create<CardStyleState>()(
  persist(
    (set) => ({
      style: "title-year", // default: Poster (Title & Year)

      setStyle: (style) => set({ style }),

      resetStyle: () => set({ style: "title-year" }),
    }),
    {
      name: "card-style-settings",
    },
  ),
);
