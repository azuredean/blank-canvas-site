import { createFileRoute, notFound } from "@tanstack/react-router";

import VaporApp from "../vapor/App";
import { getProduct } from "../vapor/data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { id: p.id, name: p.name, brand: p.brand, kind: p.kind, puffs: p.puffs ?? null };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found | Vapofolio" }, { name: "robots", content: "noindex" }] };
    }
    const extra = loaderData.puffs ? `, ${loaderData.puffs}` : "";
    return pageHead({
      lang: "en",
      enPath: `/products/${params.slug}`,
      dePath: `/de/products/${params.slug}`,
      title: `${loaderData.name} Wholesale | Vapofolio`,
      description: `${loaderData.name} by ${loaderData.brand} (${loaderData.kind}${extra}) — wholesale supply for licensed EU trade. Adults 18+ only. Prices on request.`,
      type: "product",
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  return <VaporApp />;
}
