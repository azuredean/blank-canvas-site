import { createFileRoute } from "@tanstack/react-router";

import VaporApp from "../vapor/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VAPOR — EU Wholesale Catalog" },
      {
        name: "description",
        content:
          "EU wholesale catalog of ELFBAR, JNR, VOZOL, Fumot and Lost Mary devices. Adults 18+ only. Prices on request.",
      },
      { property: "og:title", content: "VAPOR — EU Wholesale Catalog" },
      {
        property: "og:description",
        content:
          "Browse the VAPOR EU wholesale catalog: ELFBAR, JNR, VOZOL, Fumot and Lost Mary. Adults 18+ only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VaporApp,
});
