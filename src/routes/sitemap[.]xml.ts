import { createFileRoute } from "@tanstack/react-router";

import { PRODUCTS } from "../vapor/data";
import { SITE_URL } from "@/lib/seo";

function entry(enPath: string, dePath: string, lastmod: string) {
  const alts = `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}"/>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE_URL}${dePath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${enPath}"/>`;
  return [enPath, dePath]
    .map((p) => `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${lastmod}</lastmod>${alts}\n  </url>`)
    .join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const today = new Date().toISOString().slice(0, 10);
        const urls = [
          entry("/", "/de", today),
          ...PRODUCTS.map((p) => entry(`/products/${p.id}`, `/de/products/${p.id}`, today)),
        ].join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
