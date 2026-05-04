// utils/adLinks.ts

// domain → ad link map
const AD_LINKS: Record<string, string> = {
  "zxcprime.icu":
    "https://injusticebakery.com/v9b7j3eh?key=2e7312075b482451fb874186986774b4",

  "zxcstream.online":
    "https://hypothesisgarden.com/hd33crmf?key=b98802e643e417cf197f226400cbb36e",
};

// fallback if domain not listed
const DEFAULT_AD =
  "https://injusticebakery.com/v9b7j3eh?key=2e7312075b482451fb874186986774b4";

/**
 * Returns the correct ad URL based on current domain
 */
export function getAdLink(): string {
  if (typeof window === "undefined") {
    return Object.values(AD_LINKS)[0];
  }

  const hostname = window.location.hostname;

  if (hostname.includes("zxcprime")) {
    return AD_LINKS["zxcprime.icu"];
  }

  if (hostname.includes("zxcstream")) {
    return AD_LINKS["zxcstream.online"];
  }

  return Object.values(AD_LINKS)[0];
}
