import { useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import SubHeader from "../components/SubHeader";
import ProductVisual from "../components/ProductVisual";
import { getProduct, GRID_PRODUCTS, stockLabel } from "../data";
import { cn } from "../utils/cn";

interface Props {
  id: string;
  onBack: () => void;
  onAdd: (id: string, option: string, qty: number) => void;
  onOpen: (id: string) => void;
  wishlisted: boolean;
  onToggleWish: (id: string) => void;
}

export default function ProductDetail({ id, onBack, onAdd, onOpen, wishlisted, onToggleWish }: Props) {
  const product = getProduct(id);
  const [option, setOption] = useState(product?.options[0] ?? "");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div>
        <SubHeader title="Product" onBack={onBack} />
        <p className="py-24 text-center text-sm font-semibold text-mute">This product no longer exists.</p>
      </div>
    );
  }

  const related = GRID_PRODUCTS.filter((p) => p.id !== product.id && p.brand === product.brand)
    .concat(GRID_PRODUCTS.filter((p) => p.id !== product.id && p.brand !== product.brand))
    .slice(0, 6);

  const out = product.stock === "out";
  const wished = wishlisted;

  return (
    <>
      <SubHeader
        title={product.brand}
        onBack={onBack}
        right={
          <button
            onClick={() => onToggleWish(product.id)}
            aria-label="Toggle wishlist"
            className={
              "grid size-10 place-items-center rounded-full transition active:scale-90 " +
              (wished ? "bg-ink text-lemon" : "hover:bg-paper")
            }
          >
            <Heart className="size-5" strokeWidth={2.3} fill={wished ? "currentColor" : "none"} />
          </button>
        }
      />

      <main className="mx-auto max-w-[1100px] px-4 pb-44 pt-5 md:pb-24 md:pt-8">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div className="hero-tint animate-rise relative flex h-72 items-center justify-center rounded-[28px] p-6 md:h-[440px] md:rounded-[36px]">
            {product.badge && (
              <span
                className={
                  "absolute left-5 top-5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold tracking-wide " +
                  (product.badge === "NEW"
                    ? "bg-lemon text-ink"
                    : product.badge === "LOW"
                      ? "bg-ember text-white"
                      : "bg-ink text-white")
                }
              >
                {product.badge}
              </span>
            )}
            <ProductVisual product={product} className="h-full w-full" />
          </div>

          <div className="animate-rise" style={{ animationDelay: "90ms" }}>
            <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-mute">
              <span className="text-ink">{product.kind}</span>
              <span>·</span>
              <span>{stockLabel(product.stock)}</span>
              <span>·</span>
              <span>{product.options.length} {product.optionLabel.toLowerCase()}s</span>
            </div>

            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
              {product.name}
            </h2>
            <p className="mt-3 font-display text-2xl font-extrabold">Quote on request</p>

            <p className="mt-4 text-[15px] font-medium leading-relaxed text-mute">{product.desc}</p>

            <p className="mt-6 text-xs font-bold tracking-[0.14em] text-mute">{product.optionLabel}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {product.options.map((o) => (
                <button
                  key={o}
                  onClick={() => setOption(o)}
                  className={
                    "rounded-full px-4 py-2.5 text-sm font-bold transition active:scale-95 " +
                    (option === o
                      ? "bg-ink text-lemon"
                      : "border border-line bg-card text-ink hover:border-ink/35")
                  }
                >
                  {o}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-line bg-card">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="grid size-11 place-items-center rounded-full transition active:scale-90 disabled:opacity-30"
                  disabled={qty <= 1}
                >
                  <Minus className="size-4" strokeWidth={2.6} />
                </button>
                <span className="w-10 text-center font-display text-lg font-extrabold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="grid size-11 place-items-center rounded-full transition active:scale-90"
                >
                  <Plus className="size-4" strokeWidth={2.6} />
                </button>
              </div>
              <span className="text-sm font-semibold text-mute">{qty} for quote</span>
            </div>

            <button
              onClick={() => onAdd(product.id, option, qty)}
              disabled={out}
              className="grad-cta mt-7 hidden w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-14px_rgba(138,178,226,0.8)] transition hover:brightness-105 active:scale-[0.98] disabled:opacity-40 md:inline-flex"
            >
              <ShoppingCart className="size-5" strokeWidth={2.4} />
              {out ? "Out of stock" : "Add to quote"}
            </button>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold text-mute">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="size-4 text-ink" strokeWidth={2.2} /> EU warehouse dispatch
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-ink" strokeWidth={2.2} /> Adult trade · 18+
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {product.specs.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-card p-4">
              <p className="text-[11px] font-bold tracking-[0.14em] text-mute">{k.toUpperCase()}</p>
              <p className="mt-1 font-display text-lg font-extrabold tracking-tight">{v}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 font-display text-xl font-extrabold tracking-tight">You may also like</h3>
        <div className="no-scrollbar -mx-4 mt-4 flex gap-3.5 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {related.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              className={cn(
                "w-40 shrink-0 rounded-[22px] bg-card p-4 text-left transition hover:-translate-y-1 hover:shadow-lg",
                i === 0 && "animate-rise",
              )}
            >
              <ProductVisual product={p} className="h-24" />
              <p className="mt-2 truncate text-sm font-bold">{p.name}</p>
              <p className="mt-0.5 font-display text-base font-extrabold">{p.puffs ?? p.kind}</p>
            </button>
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-[88px] z-30 px-4 md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-full bg-ink p-2 pl-5 shadow-[0_20px_44px_-18px_rgba(22,22,15,0.65)]">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-white/55">{option}</p>
            <p className="font-display text-lg font-extrabold text-lemon">×{qty}</p>
          </div>
          <button
            onClick={() => onAdd(product.id, option, qty)}
            disabled={out}
            className="grad-cta flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition active:scale-95 disabled:opacity-40"
          >
            <ShoppingCart className="size-4" strokeWidth={2.5} />
            {out ? "Out of stock" : "Add to quote"}
          </button>
        </div>
      </div>
    </>
  );
}
