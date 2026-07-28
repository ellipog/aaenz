import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "aaen studios",
    short_name: "aaen",
    description:
      "Norsk byrå som bygger nettsider for bedrifter - små som store.",
    start_url: "/",
    display: "standalone",
    background_color: "#F1EAD9",
    theme_color: "#3A5A3E",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/brand/favicon-light-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
