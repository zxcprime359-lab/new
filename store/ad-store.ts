import { create } from "zustand";
import { useAdToggle } from "./useAdToggle";
import { getAdLink } from "@/lib/adLinks";

const COOLDOWN = 40_000;

export const useAdLinkStore = create<{
  openAd: () => boolean;
}>(() => ({
  openAd: () => {
    const isProduction = process.env.NODE_ENV === "production";
    const { adToggle } = useAdToggle.getState();

    if (adToggle === "off" || !isProduction) return false;

    const now = Date.now();
    const last = Number(sessionStorage.getItem("lastAdTime") ?? 0);

    if (now - last < COOLDOWN) return false;

    const adUrl = getAdLink();

    if (!adUrl) return false; // no match → do nothing

    window.open(adUrl, "_blank");
    sessionStorage.setItem("lastAdTime", now.toString());

    return true;
  },
}));
