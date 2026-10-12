import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LangContext, LangSwitch, type Lang } from "../i18n";
import { getProduct } from "../data";
import AgeGate from "../components/AgeGate";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

interface Props {
  lang: Lang;
  productId: string;
}

export default function SeoProductPage({ lang, productId }: Props) {
  const de = lang === "de";
  const product = getProduct(productId);
  const [ageOk, setAgeOk] = useState(true);

  useEffect(() => {
    try {
      setAgeOk(localStorage.getItem("vapor-age") === "true");
    } catch {
      setAgeOk(false);
    }
  }, []);

  const confirmAge = () => {
    try {
      localStorage.setItem("vapor-age", JSON.stringify(true));
    } catch {
      /* storage unavailable */
    }
    setAgeOk(true);
  };

  return (
    <LangContext.Provider value={{ lang, productId }}>
      <div className="min-h-screen font-body text-ink">
        {!ageOk && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <AgeGate onConfirm={confirmAge} />
          </div>
        )}

        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 pt-5 md:px-8">
          <Link to={de ? "/de" : "/"} aria-label="Vapofolio home">
            <Logo />
          </Link>
          <LangSwitch />
        </header>

        <main className="mx-auto max-w-[900px] px-4 pb-16 pt-8 md:px-8 md:pt-12">
          {!product ? (
            <div className="py-24 text-center">
              <h1 className="font-display text-2xl font-extrabold tracking-tight">
                {de ? "Produkt nicht gefunden" : "Product not found"}
              </h1>
              <p className="mt-3 text-sm font-medium text-mute">
                {de
                  ? "Dieses Produkt ist aktuell nicht im Katalog."
                  : "This product is not currently in the catalog."}
              </p>
              <Link
                to={de ? "/de" : "/"}
                className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-lemon"
              >
                {de ? "Zum Katalog" : "Browse catalog"}
              </Link>
            </div>
          ) : (
            <article>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-mute">
                {product.brand} · {product.kind}
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {product.image && (
                  <div className="overflow-hidden rounded-[24px] border border-line bg-card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                      loading="eager"
                    />
                  </div>
                )}

                <div className="rounded-[24px] border border-line bg-card p-5 md:p-6">
                  <p className="text-[14px] font-medium leading-relaxed text-mute">
                    {product.desc}
                  </p>
                  {product.puffs && (
                    <p className="mt-3 text-[13px] font-bold">
                      {de ? "Züge" : "Puffs"}: {product.puffs}
                    </p>
                  )}
                  <dl className="mt-4 space-y-2 text-[14px]">
                    {product.specs
                      .filter(([key]) => key === "E-liquid" || key === "Charge port")
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between gap-4">
                          <dt className="font-semibold text-mute">{key}</dt>
                          <dd className="font-extrabold">{value}</dd>
                        </div>
                      ))}
                    <div className="flex justify-between gap-4">
                      <dt className="font-semibold text-mute">{de ? "Preis" : "Price"}</dt>
                      <dd className="font-extrabold">
                        {product.catalogPriceLabel ?? (de ? "Preis: auf Anfrage" : "Quote on request")}
                      </dd>
                    </div>
                    <div className="pt-1">
                      <dd className="text-[13px] font-extrabold leading-snug">
                        {de
                          ? "Mindestbestellmenge: 10 Stück derselben Marke (verschiedene Marken werden nicht zusammengerechnet)."
                          : "Minimum order: 10 units of the same brand (different brands do not combine)."}
                      </dd>
                    </div>

                  </dl>

                  {product.options.length > 0 && (
                    <div className="mt-5">
                      <h2 className="text-[13px] font-extrabold uppercase tracking-wide text-mute">
                        {de ? "Verfügbare Optionen" : "Available options"}
                      </h2>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {product.options.map((o) => (
                          <li
                            key={o}
                            className="rounded-full border border-line bg-paper px-3 py-1 text-[12px] font-semibold"
                          >
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-8 text-[14px] font-medium leading-relaxed text-mute">
                {de
                  ? `${product.name} von ${product.brand} ist als Großhandelsware für lizenzierte Händler in der EU erhältlich. Mengenrabatte und Konditionen auf Anfrage — kontaktieren Sie uns mit Ihrer Liste für ein Angebot. Nur für Erwachsene ab 18 Jahren.`
                  : `${product.name} by ${product.brand} is available for wholesale supply to licensed EU trade buyers. Volume pricing and terms on request — send us your list for a quote. Adults 18+ only.`}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={de ? "/de" : "/"}
                  className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-lemon transition active:scale-95"
                >
                  {de ? "Zum Katalog" : "Browse catalog"}
                </Link>
                <Link
                  to={de ? "/de" : "/"}
                  className="rounded-full border border-line bg-card px-6 py-3 text-sm font-bold text-ink transition hover:border-ink/35 active:scale-95"
                >
                  {de ? "Angebot im Shop anfragen" : "Request a quote in the shop"}
                </Link>
              </div>
            </article>
          )}
        </main>

        <div className="mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
          <Footer />
        </div>
      </div>
    </LangContext.Provider>
  );
}
