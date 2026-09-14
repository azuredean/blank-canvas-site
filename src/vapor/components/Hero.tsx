import { ArrowRight } from "lucide-react";

interface Props {
  onBuy: () => void;
}

export default function Hero({ onBuy }: Props) {
  return (
    <section className="hero-tint animate-rise relative overflow-hidden rounded-[28px] px-7 py-10 shadow-[0_24px_60px_-38px_rgba(22,22,15,0.28)] md:rounded-[36px] md:px-14 md:py-14">
      <p className="text-[13px] font-semibold tracking-[0.04em] text-mute md:text-sm">
        LIMITED DROP · 60,000 PUFFS
      </p>
      <h1 className="mt-2 font-display text-[38px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[54px]">
        VOZOL Neon
        <br />
        Series 60K
      </h1>
      <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-mute md:text-[15px]">
        30 flavors. EU warehouse. Wholesale quotes on request — no public list prices.
      </p>
      <button
        onClick={onBuy}
        className="grad-cta group mt-7 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(138,178,226,0.7)] transition hover:shadow-[0_18px_34px_-12px_rgba(231,154,107,0.75)] hover:brightness-105 active:scale-95 md:mt-9"
      >
        View device
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.6} />
      </button>

      <div className="pointer-events-none absolute -right-10 top-1/2 hidden size-56 -translate-y-1/2 rounded-full bg-sky/10 blur-2xl md:block" />
      <div className="pointer-events-none absolute right-40 top-8 hidden size-24 rounded-full bg-ember/10 blur-xl md:block" />
    </section>
  );
}
