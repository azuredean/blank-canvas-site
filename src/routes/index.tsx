import { createFileRoute } from "@tanstack/react-router";

import VaporApp from "../vapor/App";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      lang: "en",
      enPath: "/",
      dePath: "/de",
      title: "Vapofolio — EU Wholesale Catalog",
      description:
        "EU wholesale catalog of ELFBAR, JNR, VOZOL, Fumot and Lost Mary devices. Adults 18+ only. Prices on request.",
    }),
  component: () => <VaporApp lang="en" />,
});
