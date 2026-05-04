import { create } from "zustand";

type SeasonSelect = {
  name: string;
  number: number;
};

type SeasonState = {
  seasonSelect: Record<string, SeasonSelect>;
  setSeasonSelect: (showId: string, v: SeasonSelect) => void;
  getSeasonSelect: (showId: string) => SeasonSelect | undefined;
};

export const useSeasonStore = create<SeasonState>((set, get) => ({
  seasonSelect: {},

  setSeasonSelect: (showId, v) =>
    set((state) => ({
      seasonSelect: {
        ...state.seasonSelect,
        [showId]: v,
      },
    })),

  getSeasonSelect: (showId) => get().seasonSelect[showId],
}));
