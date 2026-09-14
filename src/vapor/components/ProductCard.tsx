import { Heart, Plus } from "lucide-react";
import type { Product } from "../data";
import ProductVisual from "./ProductVisual";

interface Props {
  product: Product;
  index: number;
  wishlisted: boolean;
  onAdd: (p: Product) => void;
  onOpen: (id: string) => void;
  onToggleWish: (id: string) => void;
}

export default function ProductCard({ product, index, wishlisted, onAdd, onOpen, onToggleWish }: Props) {
  const out = product.stock === "out";
  return (
    <article
      className="group animate-rise relative flex cursor-pointer flex-col rounded-[24px] bg-card p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_48px_-30px_rgba(22,22,15,0.35)] md:rounded-[28px] md:p-5"
      style={{ animationDelay: `${100 + index * 40}ms` }}
      onClick={() => onOpen(product.id)}
    >
      {product.badge && (
        <span
          className={
            "absolute left-4 top-4 z-10 rounded-lg px-2.5 py-1 text-[11px] font-extrabold tracking-wide md:left-5 md:top-5 " +
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

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWish(product.id);
        }}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={
          "absolute right-3.5 top-3.5 z-10 grid size-9 place-items-center rounded-full transition active:scale-90 md:right-4 md:top-4 " +
          (wishlisted ? "bg-ink text-lemon" : "border border-line bg-card text-ink/40 hover:text-ink")
        }
      >
        <Heart className="size-4" strokeWidth={2.4} fill={wishlisted ? "currentColor" : "none"} />
      </button>

      <ProductVisual product={product} className="h-40 md:h-52" />

      <p className="mt-3 text-[11px] font-bold tracking-[0.14em] text-mute">{product.brand}</p>
      <h3 className="mt-0.5 text-[15px] font-bold leading-snug tracking-tight md:text-base">{product.name}</h3>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="font-display text-lg font-extrabold tracking-tight">{product.puffs ?? product.kind}</span>
          <p className="truncate text-[11px] font-semibold text-mute">
            {product.options.length > 1 ? `${product.options.length} options` : product.kind}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          disabled={out}
          aria-label={`Add ${product.name} to quote`}
          className="grad-cta glow-blue grid size-11 shrink-0 place-items-center rounded-full text-white transition hover:scale-110 hover:brightness-105 active:scale-90 disabled:opacity-35 disabled:hover:scale-100"
        >
          <Plus className="size-[18px]" strokeWidth={2.8} />
        </button>
      </div>
    </article>
  );
}
