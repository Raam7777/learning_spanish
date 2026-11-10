import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Che Español · ספרדית ארגנטינאית",
    short_name: "Che Español",
    description: "Learn Buenos Aires Spanish from Hebrew or English",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ec",
    theme_color: "#fbf6ec",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
