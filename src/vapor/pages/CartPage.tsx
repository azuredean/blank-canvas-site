import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import SubHeader from "../components/SubHeader";
import ProductVisual from "../components/ProductVisual";
import type { Product } from "../data";

export interface CartRow {
  product: Product;
  option: string;
  qty: number;
}

interface Props {
  rows: CartRow[];
  onQty: (id: string, option: string, delta: number) => void;
  onRemove: (id: string, option: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  onBrowse: () => void;
  onBack: () => void;
}

export default function CartPage({ rows, onQty, onRemove, onClear, onCheckout, onBrowse, onBack }: Props) {
  const count = rows.reduce((s, r) => s + r.qty, 0);

  return (
    <>
      <SubHeader
        title={count ? `Quote · ${count}` : "Quote list"}
        onBack={onBack}
        right={
          rows.length ? (
            <button
              onClick={onClear}
              className="text-[13px] font-bold text-mute transition hover:text-ink active:scale-95"
            >
              Clear
            </button>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-[760px] px-4 pb-44 pt-5 md:pb-28 md:pt-8">
        {rows.length === 0 ? (
          <div className="animate-rise flex flex-col items-center rounded-[28px] bg-card px-6 py-16 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-paper text-mute">
              <ShoppingBag className="size-7" strokeWidth={2} />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">Your quote list is empty</h2>
            <p className="mt-2 max-w-xs text-sm font-medium text-mute">
              Add devices and flavors, then send a wholesale enquiry. Prices are quoted privately.
            </p>
            <button
              onClick={onBrowse}
              className="grad-cta mt-7 rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:brightness-105 active:scale-95"
            >
              Browse catalog
            </button>
          </div>
        ) : (
          <>
            <div className="animate-rise rounded-2xl bg-card p-4">
              <p className="text-[13px] font-bold text-mute">
                <span className="text-ink">
                  {count} {count === 1 ? "unit" : "units"}
                </span>{" "}
                across {rows.length} {rows.length === 1 ? "line" : "lines"} — we'll
                reply with a landed wholesale quote.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {rows.map((r, i) => (
                <div
                  key={`${r.product.id}-${r.option}`}
                  className="animate-rise flex items-center gap-4 rounded-[22px] bg-card p-4"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper">
                    <ProductVisual product={r.product} className="h-16 w-14" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold">{r.product.name}</p>
                    <p className="text-xs font-semibold text-mute">{r.option}</p>
                    <p className="mt-1 font-display text-base font-extrabold">{r.product.puffs ?? r.product.kind}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <button
                      onClick={() => onRemove(r.product.id, r.option)}
                      aria-label={`Remove ${r.product.name}`}
                      className="grid size-8 place-items-center rounded-full text-mute transition hover:bg-paper hover:text-ink active:scale-90"
                    >
                      <Trash2 className="size-4" strokeWidth={2.2} />
                    </button>
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        onClick={() => onQty(r.product.id, r.option, -1)}
                        aria-label="Decrease quantity"
                        className="grid size-9 place-items-center rounded-full transition active:scale-90"
                      >
                        <Minus className="size-3.5" strokeWidth={2.6} />
                      </button>
                      <span className="w-7 text-center text-sm font-extrabold">{r.qty}</span>
                      <button
                        onClick={() => onQty(r.product.id, r.option, 1)}
                        aria-label="Increase quantity"
                        className="grid size-9 place-items-center rounded-full transition active:scale-90"
                      >
                        <Plus className="size-3.5" strokeWidth={2.6} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[22px] bg-card p-5">
              <div className="flex justify-between text-sm font-semibold text-mute">
                <span>Lines</span>
                <span className="text-ink">{rows.length}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-3">
                <span className="font-display text-lg font-extrabold">Units</span>
                <span className="font-display text-lg font-extrabold">{count}</span>
              </div>
              <button
                onClick={onCheckout}
                className="grad-cta mt-5 flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-14px_rgba(138,178,226,0.8)] transition hover:brightness-105 active:scale-[0.98]"
              >
                Request quote <ArrowRight className="size-4" strokeWidth={2.6} />
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
