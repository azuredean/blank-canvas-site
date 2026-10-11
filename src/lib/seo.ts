export const SITE_URL = "https://vapofolio.com";

interface HeadInput {
  lang: "en" | "de";
  enPath: string;
  dePath: string;
  title: string;
  description: string;
  type?: string;
}

/** Per-page meta + self-canonical + hreflang alternates (en, de, x-default). */
export function pageHead({ lang, enPath, dePath, title, description, type = "website" }: HeadInput) {
  const self = SITE_URL + (lang === "de" ? dePath : enPath);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: self },
      { property: "og:locale", content: lang === "de" ? "de_DE" : "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: self },
      { rel: "alternate", hrefLang: "en", href: SITE_URL + enPath },
      { rel: "alternate", hrefLang: "de", href: SITE_URL + dePath },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL + enPath },
    ],
  };
}
