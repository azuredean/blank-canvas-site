import { Heart, Home, ShoppingCart, UserRound } from "lucide-react";

export type Tab = "home" | "cart" | "wishlist" | "account";

interface Props {
  active: Tab;
  cartCount: number;
  onChange: (t: Tab) => void;
}

const ITEMS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "cart", label: "Quote", icon: ShoppingCart },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "account", label: "Account", icon: UserRound },
];

export default function BottomNav({ active, cartCount, onChange }: Props) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-[430px] -translate-x-1/2 md:bottom-7">
      <div className="flex h-16 items-center justify-between rounded-full bg-ink px-7 shadow-[0_24px_50px_-20px_rgba(22,22,15,0.6)] md:h-[68px] md:px-10">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-label={label}
              className={
                "relative grid size-11 place-items-center rounded-full transition-all duration-300 " +
                (isActive ? "text-lemon" : "text-white/45 hover:text-white/80 active:scale-90")
              }
            >
              <Icon
                className="size-[22px] transition-transform duration-300"
                strokeWidth={2.2}
                fill={isActive && id === "home" ? "currentColor" : id === "wishlist" && isActive ? "currentColor" : "none"}
              />
              {id === "cart" && cartCount > 0 && (
                <span
                  key={cartCount}
                  className="animate-pop absolute -top-0.5 right-0 grid size-[18px] place-items-center rounded-full bg-lemon text-[10px] font-extrabold text-ink"
                >
                  {cartCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
