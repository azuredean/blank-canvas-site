import { createContext, useContext } from "react";
import { Link } from "@tanstack/react-router";

export type Lang = "en" | "de";

interface LangCtx {
  lang: Lang;
  productId?: string;
}

export const LangContext = createContext<LangCtx>({ lang: "en" });

export const useLang = () => useContext(LangContext);

/** Returns a picker: tr("English text", "Deutscher Text"). */
export function useT() {
  const { lang } = useLang();
  return (en: string, de: string) => (lang === "de" ? de : en);
}

export const productPath = (id: string, lang: Lang) =>
  lang === "de" ? `/de/products/${id}` : `/products/${id}`;

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, productId } = useLang();
  const base =
    "rounded-full px-2 py-1 text-[11px] font-extrabold tracking-wide transition";
  const on = "bg-ink text-lemon";
  const off = "text-mute hover:text-ink";
  return (
    <div
      className={"flex items-center gap-0.5 rounded-full border border-line bg-card p-0.5 " + className}
      aria-label={lang === "de" ? "Sprache wählen" : "Choose language"}
    >
      {productId ? (
        <>
          <Link to="/products/$slug" params={{ slug: productId }} hrefLang="en" className={base + " " + (lang === "en" ? on : off)}>
            EN
          </Link>
          <Link to="/de/products/$slug" params={{ slug: productId }} hrefLang="de" className={base + " " + (lang === "de" ? on : off)}>
            DE
          </Link>
        </>
      ) : (
        <>
          <Link to="/" hrefLang="en" className={base + " " + (lang === "en" ? on : off)}>
            EN
          </Link>
          <Link to="/de" hrefLang="de" className={base + " " + (lang === "de" ? on : off)}>
            DE
          </Link>
        </>
      )}
    </div>
  );
}
