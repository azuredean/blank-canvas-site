import { ArrowRight } from "lucide-react";
import { BANNER_ID, getProduct } from "../data";
import ProductVisual from "./ProductVisual";
import Reveal from "./Reveal";

interface Props {
  onOpen: (id: string) => void;
}

export default function PromoBanner({ onOpen }: Props) {
  const product = getProduct(BANNER_ID);
  if (!product) return null;

  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-[24px] md:rounded-[32px]">
        <button
          type="button"
          onClick={() => onOpen(product.id)}
          className="group flex w-full items-center gap-4 bg-lemon px-5 py-5 text-left md:gap-10 md:px-12 md:py-8"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.18em] text-ink/50 md:text-[11px]">
              ADVERTISEMENT · 6-IN-1 CAMPAIGN
            </p>
            <h2 className="mt-1.5 font-display text-[22px] font-extrabold leading-[1.05] tracking-[-0.03em] md:mt-2 md:text-[40px]">
              {product.name}
            </h2>
            <p className="mt-2 max-w-lg text-[12px] font-medium leading-relaxed text-ink/70 md:mt-3 md:text-[15px]">
              Six flavour chambers, 120,000 puffs, EU warehouse. Trade allocation is open — quotes on
              request, no public list prices.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-lemon transition group-hover:brightness-110 md:mt-6 md:px-7 md:py-3.5 md:text-[15px]">
              View allocation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.6} />
            </span>
          </div>
          <div className="flex h-32 w-32 shrink-0 items-center justify-center md:h-52 md:w-[280px]">
            <ProductVisual product={product} className="h-full w-full" />
          </div>
        </button>
      </section>
    </Reveal>
  );
}
