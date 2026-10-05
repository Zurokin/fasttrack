import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FastTrack — интервальное голодание",
    short_name: "FastTrack",
    description: "Бесплатный трекер интервального голодания",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f0f14",
    theme_color: "#7c5cff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
