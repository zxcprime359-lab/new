import { create } from "zustand";
import { persist } from "zustand/middleware";

/* Types */
export type AccentColor = "red" | "blue" | "green" | "purple" | "orange";
export type LayoutDensity = "compact" | "comfortable" | "spacious";
export type CardStyle = "only" | "title" | "title-year";
export type RoundedCorners = "small" | "medium" | "large";
export type LowDataMode = "low" | "mid" | "high";
export type Toggle = "on" | "off";

/* Defaults */
const DEFAULTS = {
  accent: "red" as AccentColor,
  density: "comfortable" as LayoutDensity,
  style: "title-year" as CardStyle,
  rounded: "medium" as RoundedCorners,
  landingTrailer: "on" as Toggle,
  autoplay: "on" as Toggle,
  lowDataMode: "mid" as LowDataMode,
  animation: "on" as Toggle,
  adToggle: "on" as Toggle,
  saveHistory: "on" as Toggle,
};

type Settings = typeof DEFAULTS;

/* Store */
interface SettingsState extends Settings {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      set: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),

      resetSettings: () => set(() => ({ ...DEFAULTS })),
    }),
    {
      name: "app-settings",
    },
  ),
);
