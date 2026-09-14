import { useState } from "react";
import { Bell, LogOut, Package, ShieldCheck } from "lucide-react";
import SubHeader from "../components/SubHeader";
import Logo from "../components/Logo";
import type { Order } from "../data";

interface Props {
  user: { email: string } | null;
  orders: Order[];
  wishlistCount: number;
  cartCount: number;
  notifications: boolean;
  onSignIn: (email: string) => void;
  onSignOut: () => void;
  onToggleNotifications: () => void;
  onViewOrders: () => void;
  onBack: () => void;
}

export default function AccountPage({
  user, orders, wishlistCount, cartCount, notifications,
  onSignIn, onSignOut, onToggleNotifications, onViewOrders, onBack,
}: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    onSignIn(email);
  };

  return (
    <>
      <SubHeader title="Account" onBack={onBack} />

      <main className="mx-auto max-w-[760px] px-4 pb-44 pt-5 md:pb-28 md:pt-8">
        {!user ? (
          <div className="animate-rise rounded-[28px] bg-card p-7 text-center md:p-10">
            <div className="flex justify-center">
              <Logo className="h-14 w-14" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Sign in to VAPOR
            </h2>
            <p className="mt-2 text-sm font-medium text-mute">
              Track quotes, sync your wishlist and speed through enquiries.
            </p>
            <div className="mx-auto mt-7 max-w-sm text-left">
              <label className="text-xs font-bold tracking-[0.14em] text-mute" htmlFor="acct-email">
                EMAIL
              </label>
              <input
                id="acct-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-[15px] font-semibold outline-none transition focus:border-ink/50 focus:bg-card"
              />
              {error && <p className="mt-1.5 text-[13px] font-bold text-[#c2453f]">{error}</p>}
              <button
                onClick={submit}
                className="grad-cta mt-4 w-full rounded-full px-7 py-4 text-[15px] font-bold text-white transition hover:brightness-105 active:scale-[0.98]"
              >
                Sign in
              </button>
              <p className="mt-3 text-center text-[11px] font-semibold text-mute">
                Demo sign-in — no password required. 18+ only.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="animate-rise flex items-center gap-4 rounded-[28px] bg-card p-6">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink font-display text-xl font-extrabold text-lemon">
                {(user.email[0] ?? "V").toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{user.email}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-lemon px-2.5 py-1 text-[11px] font-extrabold">
                    <ShieldCheck className="size-3" strokeWidth={2.6} /> 18+ verified
                  </span>
                  <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold text-mute">
                    Trade since 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="animate-rise grid grid-cols-3 divide-x divide-line rounded-[22px] bg-card py-4" style={{ animationDelay: "70ms" }}>
              {[
                { label: "Quotes", value: orders.length },
                { label: "Wishlist", value: wishlistCount },
                { label: "In list", value: cartCount },
              ].map((s) => (
                <div key={s.label} className="px-2 text-center">
                  <p className="font-display text-2xl font-extrabold">{s.value}</p>
                  <p className="mt-0.5 text-[11px] font-bold tracking-[0.1em] text-mute">{s.label.toUpperCase()}</p>
                </div>
              ))}
            </div>

            <div className="animate-rise rounded-[22px] bg-card p-5" style={{ animationDelay: "130ms" }}>
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
                  <Package className="size-5" strokeWidth={2.2} /> Quotes
                </h3>
                {orders.length > 0 && (
                  <button onClick={onViewOrders} className="text-[13px] font-bold text-mute transition hover:text-ink">
                    Scroll for details
                  </button>
                )}
              </div>
              {orders.length === 0 ? (
                <p className="mt-3 text-sm font-medium text-mute">No quotes yet — add lines from the catalog.</p>
              ) : (
                <div className="mt-3 flex flex-col gap-2.5">
                  {orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between rounded-2xl bg-paper p-4">
                      <div>
                        <p className="text-sm font-extrabold">#{o.id}</p>
                        <p className="text-[12px] font-semibold text-mute">
                          {o.date} · {o.items.reduce((s, i) => s + i.qty, 0)} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-base font-extrabold">{o.items.length} lines</p>
                        <span className="text-[11px] font-extrabold tracking-wide text-[#3f7d4e]">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="animate-rise rounded-[22px] bg-card p-2" style={{ animationDelay: "190ms" }}>
              <button
                onClick={onToggleNotifications}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-4 transition hover:bg-paper"
              >
                <span className="inline-flex items-center gap-3 text-[15px] font-bold">
                  <Bell className="size-5 text-mute" strokeWidth={2.2} /> Drop notifications
                </span>
                <span
                  className={
                    "relative h-7 w-12 rounded-full transition-colors " + (notifications ? "bg-ink" : "bg-line")
                  }
                >
                  <span
                    className={
                      "absolute top-1 size-5 rounded-full bg-white shadow transition-all " +
                      (notifications ? "left-6" : "left-1")
                    }
                  />
                </span>
              </button>
              <div className="flex items-center justify-between px-4 py-4">
                <span className="inline-flex items-center gap-3 text-[15px] font-bold">
                  <ShieldCheck className="size-5 text-mute" strokeWidth={2.2} /> Age verification
                </span>
                <span className="rounded-full bg-lemon px-3 py-1 text-[11px] font-extrabold">VERIFIED</span>
              </div>
              <button
                onClick={onSignOut}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-[15px] font-bold text-[#c2453f] transition hover:bg-paper"
              >
                <LogOut className="size-5" strokeWidth={2.2} /> Sign out
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
