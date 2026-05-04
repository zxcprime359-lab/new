import { create } from "zustand";

interface LastPlayedState {
  lastId: string | null;
  media_type: string | null;
  season: number | null;
  episode: number | null;

  /** true = main player active, trailers should pause */
  isMainPlayerActive: boolean;

  setLastPlayed: (data: {
    id: string;
    media_type: string;
    season?: number;
    episode?: number;
  }) => void;

  setMainPlayerActive: (active: boolean) => void;
  clearLastPlayed: () => void;
}

export const useLastPlayed = create<LastPlayedState>((set) => ({
  lastId: null,
  media_type: null,
  season: null,
  episode: null,
  isMainPlayerActive: false,

  setLastPlayed: ({ id, media_type, season, episode }) =>
    set({
      lastId: id,
      media_type,
      season: season ?? null,
      episode: episode ?? null,
    }),

  setMainPlayerActive: (active) => set({ isMainPlayerActive: active }),

  clearLastPlayed: () =>
    set({
      lastId: null,
      media_type: null,
      season: null,
      episode: null,
      isMainPlayerActive: false,
    }),
}));
