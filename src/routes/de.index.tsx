import { createFileRoute } from "@tanstack/react-router";

import SeoHomeDe from "../vapor/pages/SeoHomeDe";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/de/")({
  head: () =>
    pageHead({
      lang: "de",
      enPath: "/",
      dePath: "/de",
      title: "Vapofolio — EU-Großhandelskatalog",
      description:
        "EU-Großhandelskatalog für ELFBAR, JNR, VOZOL, Fumot und Lost Mary. Nur für Erwachsene ab 18. Preise auf Anfrage.",
    }),
  component: () => <SeoHomeDe />,
});
