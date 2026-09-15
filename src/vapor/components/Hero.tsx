import { ArrowRight } from "lucide-react";
import { FEATURED_ID, getProduct } from "../data";
import ProductVisual from "./ProductVisual";

interface Props {
  onBuy: () => void;
}

export default function Hero({ onBuy }: Props) {
  const product = getProduct(FEATURED_ID);

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_28px_60px_-36px_rgba(22,22,15,0.55)] md:rounded-[36px]">
      <div className="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-ember/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 size-80 rounded-full bg-sky/25 blur-3xl" />

      <div className="relative grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-7 py-10 md:px-14 md:py-16">
          <p className="text-[11px] font-bold tracking-[0.18em] text-lemon">LIMITED DROP · 60,000 PUFFS</p>
          <h1 className="mt-3 font-display text-[38px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[56px]">
            VOZOL Neon
            <br />
            Series 60K
          </h1>
          <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-white/60 md:text-[15px]">
            Thirty flavors, 1100 mAh, EU warehouse. Wholesale quotes on request — no public list prices.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBuy}
              className="group inline-flex items-center gap-2 rounded-full bg-lemon px-8 py-3.5 text-[15px] font-bold text-ink transition hover:brightness-105 active:scale-95"
            >
              View device
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.6} />
            </button>
            <span className="rounded-full border border-white/20 px-3.5 py-2 text-[11px] font-bold tracking-[0.14em] text-white/70">
              18+ ADULT TRADE
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBuy}
          aria-label="View VOZOL Neon Series 60K"
          className="group relative flex h-72 items-center justify-center md:h-auto md:min-h-[440px]"
        >
          {product ? (
            <ProductVisual product={product} className="h-64 w-full md:h-[380px]" />
          ) : null}
          <span className="absolute bottom-5 right-5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white/80 backdrop-blur-sm">
            FEATURED
          </span>
        </button>
      </div>
    </section>
  );
}
