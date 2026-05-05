// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZXC[STREAM]",
    short_name: "ZXC",
    description: "Your awesome movie search app",
    start_url: "/",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#000000",

    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "828x1792", // ✅ Updated to match actual size
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshot-desktop.png",
        sizes: "1920x1080", // ✅ Updated to match actual size
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
