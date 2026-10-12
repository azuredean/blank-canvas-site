import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LangContext, LangSwitch } from "../i18n";
import { PRODUCTS } from "../data";
import AgeGate from "../components/AgeGate";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

export default function SeoHomeDe() {
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
    <LangContext.Provider value={{ lang: "de" }}>
      <div className="min-h-screen font-body text-ink">
        {!ageOk && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <AgeGate onConfirm={confirmAge} />
          </div>
        )}

        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 pt-5 md:px-8">
          <Link to="/de" aria-label="Vapofolio Startseite">
            <Logo />
          </Link>
          <LangSwitch />
        </header>

        <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-8 md:px-8 md:pt-12">
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            EU-Großhandelskatalog
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] font-medium leading-relaxed text-mute">
            Großhandelskatalog für ELFBAR, JNR, VOZOL, Fumot und Lost Mary Geräte.
            Lieferung in die EU für lizenzierte Händler. Nur für Erwachsene ab 18 Jahren.
            Preis: auf Anfrage. Mindestbestellmenge: 10 Stück derselben Marke (verschiedene Marken werden nicht zusammengerechnet).
          </p>
          <p className="mt-3 text-[13px] font-semibold">
            <Link to="/" className="underline underline-offset-4 hover:text-mute">
              English version
            </Link>
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-5">
            {PRODUCTS.map((p) => (
              <a
                key={p.id}
                href={`/de/products/${p.id}`}
                className="group overflow-hidden rounded-[20px] border border-line bg-card transition hover:border-ink/35"
              >
                {p.image && (
                  <div className="aspect-square overflow-hidden bg-paper">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-3.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-mute">
                    {p.brand}
                  </p>
                  <p className="mt-0.5 text-[14px] font-bold leading-snug">{p.name}</p>
                  <p className="mt-1.5 text-[12px] font-semibold text-mute">
                    Preis: auf Anfrage · Mindestbestellmenge: 10 Stück derselben Marke
                  </p>
                </div>
              </a>
            ))}
          </div>
        </main>

        <div className="mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
          <Footer />
        </div>
      </div>
    </LangContext.Provider>
  );
}
