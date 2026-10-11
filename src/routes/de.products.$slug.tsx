import { createFileRoute, notFound } from "@tanstack/react-router";

import VaporApp from "../vapor/App";
import { getProduct } from "../vapor/data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/de/products/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { id: p.id, name: p.name, brand: p.brand, kind: p.kind, puffs: p.puffs ?? null };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produkt nicht gefunden | Vapofolio" }, { name: "robots", content: "noindex" }] };
    }
    const extra = loaderData.puffs ? `, ${loaderData.puffs}` : "";
    return pageHead({
      lang: "de",
      enPath: `/products/${params.slug}`,
      dePath: `/de/products/${params.slug}`,
      title: `${loaderData.name} Wholesale | Vapofolio`,
      description: `${loaderData.name} von ${loaderData.brand} (${loaderData.kind}${extra}) — Großhandel für den lizenzierten EU-Handel. Nur für Erwachsene ab 18. Preis auf Anfrage.`,
      type: "product",
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  return <VaporApp lang="de" productId={slug} />;
}
