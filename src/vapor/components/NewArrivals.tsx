import { Plus } from "lucide-react";
import type { Product } from "../data";
import ProductCard from "./ProductCard";
import ProductVisual from "./ProductVisual";
import Reveal from "./Reveal";

interface Props {
  products: Product[];
  wishlist: string[];
  onAdd: (p: Product) => void;
  onOpen: (id: string) => void;
  onToggleWish: (id: string) => void;
}

export default function NewArrivals({ products, wishlist, onAdd, onOpen, onToggleWish }: Props) {
  const featured = products[0];
  if (!featured) return null;

  const rest = products.slice(1);

  return (
    <Reveal>
      <section className="rounded-[28px] bg-ink px-5 py-7 text-white md:rounded-[36px] md:px-8 md:py-10">
        <div className="mb-5 flex items-end justify-between gap-4 md:mb-7">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em] text-lemon">NEW ARRIVALS</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Just landed</h2>
          </div>
          <p className="hidden max-w-[220px] text-right text-[12px] font-medium leading-relaxed text-white/45 md:block">
            Fresh warehouse intake — allocation opens on enquiry.
          </p>
        </div>

        <div className="grid items-stretch gap-3.5 md:grid-cols-2 md:gap-5">
          <div className="text-ink">
            <ProductCard
              product={featured}
              index={0}
              wishlisted={wishlist.includes(featured.id)}
              onAdd={onAdd}
              onOpen={onOpen}
              onToggleWish={onToggleWish}
            />
          </div>

          <div className="flex flex-col gap-3">
            {rest.map((p) => {
              const out = p.stock === "out";
              return (
                <article
                  key={p.id}
                  className="group flex flex-1 items-center gap-3.5 rounded-[22px] bg-white p-3 text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(22,22,15,0.4)] md:gap-4 md:p-3.5"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(p.id)}
                    className="flex min-w-0 flex-1 items-center gap-3.5 text-left md:gap-4"
                  >
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[16px] bg-paper md:h-24 md:w-24">
                      <span className="absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide bg-lemon text-ink">
                        NEW
                      </span>
                      <ProductVisual product={p} className="h-14 w-14 md:h-16 md:w-16" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold tracking-[0.14em] text-mute">{p.brand}</p>
                      <h3 className="mt-0.5 truncate text-[14px] font-bold leading-snug md:text-[15px]">{p.name}</h3>
                      <p className="mt-0.5 font-display text-base font-extrabold">{p.puffs ?? p.kind}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    disabled={out}
                    onClick={() => onAdd(p)}
                    aria-label={`Add ${p.name} to quote`}
                    className="grad-cta grid size-11 shrink-0 place-items-center rounded-full text-white transition hover:scale-105 active:scale-90 disabled:opacity-35"
                  >
                    <Plus className="size-4" strokeWidth={2.8} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
