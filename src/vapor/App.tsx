import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import BottomNav, { type Tab } from "./components/BottomNav";
import { MenuDrawer, SearchOverlay, Toast } from "./components/Overlays";
import AgeGate from "./components/AgeGate";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import CartPage, { type CartRow } from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import SupportPage from "./pages/SupportPage";
import {
  CATEGORIES,
  FEATURED_ID,
  GRID_PRODUCTS,
  getProduct,
  type Filter,
  type Order,
  type OrderItem,
  type Product,
} from "./data";

type Route =
  | { name: "home" }
  | { name: "product"; id: string }
  | { name: "cart" }
  | { name: "wishlist" }
  | { name: "account" }
  | { name: "checkout" }
  | { name: "support" };

interface CartItem {
  id: string;
  option: string;
  qty: number;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export default function App() {
  const [ageOk, setAgeOk] = useState(false);
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [filter, setFilter] = useState<Filter>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const persist = useRef(false);

  useEffect(() => {
    setAgeOk(load("vapor-age", false));
    setCart(load("vapor-cart", []));
    setWishlist(load("vapor-wish", []));
    setOrders(load("vapor-orders", []));
    setUser(load("vapor-user", null));
    setNotifications(load("vapor-notif", true));
    persist.current = true;
  }, []);

  useEffect(() => {
    if (!persist.current) return;
    save("vapor-cart", cart);
  }, [cart]);
  useEffect(() => {
    if (!persist.current) return;
    save("vapor-wish", wishlist);
  }, [wishlist]);
  useEffect(() => {
    if (!persist.current) return;
    save("vapor-orders", orders);
  }, [orders]);
  useEffect(() => {
    if (!persist.current) return;
    save("vapor-user", user);
  }, [user]);
  useEffect(() => {
    if (!persist.current) return;
    save("vapor-notif", notifications);
  }, [notifications]);
  useEffect(() => {
    if (!persist.current) return;
    save("vapor-age", ageOk);
  }, [ageOk]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    document.body.style.overflow = ageOk ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ageOk]);

  const showToast = (message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 2100);
  };

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  const cartRows: CartRow[] = useMemo(
    () =>
      cart
        .map((c) => ({ product: getProduct(c.id), option: c.option, qty: c.qty }))
        .filter((r): r is CartRow => Boolean(r.product)),
    [cart],
  );
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (id: string, option: string, qty: number) => {
    const p = getProduct(id);
    if (!p) return;
    if (p.stock === "out") {
      showToast(`${p.name} is out of stock`);
      return;
    }
    setCart((prev) => {
      const i = prev.findIndex((c) => c.id === id && c.option === option);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) };
        return next;
      }
      return [...prev, { id, option, qty }];
    });
    showToast(`${p.name} added to quote`);
  };
  const addProduct = (p: Product) => addToCart(p.id, p.options[0], 1);

  const changeQty = (id: string, option: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id && c.option === option ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => {
          if (c.qty < 1) {
            showToast(`${getProduct(c.id)?.name ?? "Item"} removed`);
            return false;
          }
          return true;
        }),
    );
  };

  const removeItem = (id: string, option: string) => {
    setCart((prev) => prev.filter((c) => !(c.id === id && c.option === option)));
    showToast(`${getProduct(id)?.name ?? "Item"} removed`);
  };

  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      showToast(has ? "Removed from wishlist" : "Saved to wishlist");
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };
  const wishProducts = wishlist
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));

  const placeOrder = (items: OrderItem[]): string => {
    const id = String(Math.floor(10000 + Math.random() * 90000));
    const order: Order = {
      id,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      items,
      status: "Quoted",
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return id;
  };

  const handleDrawerLink = (link: string) => {
    setMenuOpen(false);
    if (link === "Home") {
      setFilter("All");
      navigate({ name: "home" });
      return;
    }
    if (link === "Safety & Support") {
      navigate({ name: "support" });
      return;
    }
    if ((CATEGORIES as readonly string[]).includes(link)) {
      setFilter(link as Filter);
      navigate({ name: "home" });
    }
  };

  const activeTab: Tab =
    route.name === "cart" || route.name === "checkout"
      ? "cart"
      : route.name === "wishlist"
        ? "wishlist"
        : route.name === "account"
          ? "account"
          : "home";

  const handleTab = (t: Tab) => {
    navigate({ name: t });
  };

  const confirmAge = () => {
    try {
      localStorage.setItem("vapor-age", JSON.stringify(true));
    } catch {
      /* storage unavailable */
    }
    persist.current = true;
    setAgeOk(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  const goHome = () => navigate({ name: "home" });
  const openProduct = (id: string) => {
    setSearchOpen(false);
    navigate({ name: "product", id });
  };

  const filtered =
    filter === "All" ? GRID_PRODUCTS : GRID_PRODUCTS.filter((p) => p.brand === filter);

  if (!ageOk) {
    return (
      <div className="min-h-screen font-body text-ink">
        <AgeGate onConfirm={confirmAge} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body text-ink">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_420px_at_72%_-12%,rgba(138,178,226,0.10),transparent_70%),radial-gradient(720px_380px_at_12%_-4%,rgba(231,154,107,0.09),transparent_70%)]"
      />

      {route.name === "home" && (
        <>
          <TopBar onMenu={() => setMenuOpen(true)} onSearch={() => setSearchOpen(true)} />
          <main className="mx-auto max-w-[1400px] px-4 pb-36 pt-5 md:px-8 md:pb-44 md:pt-9">
            <Hero onBuy={() => navigate({ name: "product", id: FEATURED_ID })} />

            <div className="no-scrollbar mt-7 flex gap-2.5 overflow-x-auto pb-1 md:mt-10 md:gap-3">
              {CATEGORIES.map((c) => {
                const active = filter === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={
                      "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 md:px-6 md:py-3 " +
                      (active
                        ? "bg-ink text-lemon shadow-[0_10px_22px_-12px_rgba(22,22,15,0.6)]"
                        : "border border-line bg-card text-ink hover:border-ink/35")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div key={filter} className="mt-5 grid grid-cols-2 gap-3.5 md:mt-8 md:grid-cols-4 md:gap-5">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  wishlisted={wishlist.includes(p.id)}
                  onAdd={addProduct}
                  onOpen={openProduct}
                  onToggleWish={toggleWish}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="animate-fade py-20 text-center text-sm font-semibold text-mute">
                No products in this brand yet.
              </p>
            )}

            <Footer />
          </main>
        </>
      )}

      {route.name === "product" && (
        <ProductDetail
          key={route.id}
          id={route.id}
          onBack={goHome}
          onAdd={addToCart}
          onOpen={openProduct}
          wishlisted={wishlist.includes(route.id)}
          onToggleWish={toggleWish}
        />
      )}

      {route.name === "cart" && (
        <CartPage
          rows={cartRows}
          onQty={changeQty}
          onRemove={removeItem}
          onClear={() => {
            setCart([]);
            showToast("Quote list cleared");
          }}
          onCheckout={() => navigate({ name: "checkout" })}
          onBrowse={goHome}
          onBack={goHome}
        />
      )}

      {route.name === "checkout" && (
        <CheckoutPage
          rows={cartRows}
          onBack={() => navigate({ name: "cart" })}
          onPlaceOrder={placeOrder}
          onViewOrders={() => navigate({ name: "account" })}
          onBrowse={goHome}
        />
      )}

      {route.name === "wishlist" && (
        <WishlistPage
          products={wishProducts}
          onOpen={openProduct}
          onAdd={addProduct}
          onToggleWish={toggleWish}
          onBrowse={goHome}
          onBack={goHome}
        />
      )}

      {route.name === "account" && (
        <AccountPage
          user={user}
          orders={orders}
          wishlistCount={wishlist.length}
          cartCount={cartCount}
          notifications={notifications}
          onSignIn={(email) => {
            setUser({ email });
            showToast("Signed in — welcome back");
          }}
          onSignOut={() => {
            setUser(null);
            showToast("Signed out");
          }}
          onToggleNotifications={() => {
            setNotifications((n) => !n);
            showToast(notifications ? "Notifications off" : "Notifications on");
          }}
          onViewOrders={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          onBack={goHome}
        />
      )}

      {route.name === "support" && <SupportPage onBack={goHome} />}

      <BottomNav active={activeTab} cartCount={cartCount} onChange={handleTab} />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleDrawerLink}
        onPickCategory={(c) => {
          setFilter(c);
          setMenuOpen(false);
          navigate({ name: "home" });
        }}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onAdd={addProduct} onOpen={openProduct} />

      {toast && <Toast id={toast.id} message={toast.message} />}
    </div>
  );
}
