import { Heart } from "lucide-react";
import SubHeader from "../components/SubHeader";
import ProductCard from "../components/ProductCard";
import type { Product } from "../data";

interface Props {
  products: Product[];
  onOpen: (id: string) => void;
  onAdd: (p: Product) => void;
  onToggleWish: (id: string) => void;
  onBrowse: () => void;
  onBack: () => void;
}

export default function WishlistPage({ products, onOpen, onAdd, onToggleWish, onBrowse, onBack }: Props) {
  return (
    <>
      <SubHeader title={`Wishlist · ${products.length}`} onBack={onBack} />

      <main className="mx-auto max-w-[1400px] px-4 pb-8 pt-5 md:px-8 md:pt-8">
        {products.length === 0 ? (
          <div className="animate-rise mx-auto flex max-w-md flex-col items-center rounded-[28px] bg-card px-6 py-16 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-paper text-mute">
              <Heart className="size-7" strokeWidth={2} />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">Nothing saved yet</h2>
            <p className="mt-2 max-w-xs text-sm font-medium text-mute">
              Tap the heart on any product to keep it here for later.
            </p>
            <button
              onClick={onBrowse}
              className="grad-cta mt-7 rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:brightness-105 active:scale-95"
            >
              Discover products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-5">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                wishlisted
                onAdd={onAdd}
                onOpen={onOpen}
                onToggleWish={onToggleWish}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
