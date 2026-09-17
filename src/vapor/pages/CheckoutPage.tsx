import { useEffect, useRef, useState } from "react";
import { Check, CreditCard, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import SubHeader from "../components/SubHeader";
import type { CartRow } from "./CartPage";
import type { OrderItem } from "../data";
import { EU_COUNTRY_OPTIONS } from "@/lib/countries";
import { cn } from "../utils/cn";
import { createOrder, getIframeToken, processPayment } from "@/lib/checkout.functions";
import { formatEur, priceOf } from "@/lib/prices";
import {
  FREE_SHIPPING_MIN_QTY,
  PAYMENT_PAUSED,
  shippingFor,
} from "@/lib/shipping";
import { minimumOrderQtyForBrand } from "@/lib/order-rules";
import { CONTACT } from "../data";

declare global {
  interface Window {
    Cartadicreditopay?: {
      elements: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        create: (type: string, options: any) => {
          mount: (selector: string) => Promise<void>;
          unmount: () => void;
        };
      };
      getValidateResult: () => Promise<boolean>;
      confirmPay: () => Promise<{ token: string }>;
    };
    cartaDiCreditoPayShield?: { getSessionId: () => string };
  }
}

interface Props {
  rows: CartRow[];
  onBack: () => void;
  onPlaceOrder: (items: OrderItem[]) => string;
  onViewOrders: () => void;
  onBrowse: () => void;
}

interface Form {
  email: string;
  name: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  phone: string;
}

const EMPTY: Form = {
  email: "",
  name: "",
  address: "",
  city: "",
  postal: "",
  country: "",
  phone: "",
};

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.id = id;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

/** The gateway requires a device session id; the script may still be loading. */
async function getShieldSessionId(attempts = 12): Promise<string | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const id = window.cartaDiCreditoPayShield?.getSessionId();
      if (id) return id;
    } catch {
      // keep retrying while the shield script initialises
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}

export default function CheckoutPage({ rows, onBack, onPlaceOrder, onViewOrders, onBrowse }: Props) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [placedId, setPlacedId] = useState<string | null>(null);
  const [cardMounted, setCardMounted] = useState(false);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const mountedOnce = useRef(false);

  const fetchToken = useServerFn(getIframeToken);
  const makeOrder = useServerFn(createOrder);
  const pay = useServerFn(processPayment);

  const count = rows.reduce((s, r) => s + r.qty, 0);
  const subtotal = rows.reduce((s, r) => s + priceOf(r.product.id) * r.qty, 0);
  const shipping = form.country ? shippingFor(form.country, count) : null;
  const total = subtotal + (shipping ?? 0);

  const shortLines = rows.filter(
    (row) => row.qty < minimumOrderQtyForBrand(row.product.brand),
  );

  useEffect(() => {
    if (PAYMENT_PAUSED) return;
    if (mountedOnce.current || rows.length === 0) return;
    mountedOnce.current = true;

    (async () => {
      try {
        const res = await fetchToken({});
        if (!res.success) {
          setIframeError(res.error);
          return;
        }
        await loadScript(res.sdkUrl, "cdc-sdk");
        loadScript(res.shieldUrl, "cdc-shield").catch(() => undefined);
        // The SDK attaches its global a tick after the script's load event.
        for (let i = 0; i < 20 && !window.Cartadicreditopay; i++) {
          await new Promise((r) => setTimeout(r, 150));
        }
        if (!window.Cartadicreditopay) {
          setIframeError("Card form unavailable, please refresh.");
          return;
        }
        const card = window.Cartadicreditopay.elements().create("card", {
          token: res.token,
          language: "en",
          style: { base: { backgroundColor: "#ffffff", color: "#161616", fontSize: "14px" } },
        });
        await card.mount("#cartadicreditopay-card-element");
        setCardMounted(true);
      } catch (err) {
        console.error("card form init failed", err);
        setIframeError("Card form unavailable, please refresh.");
      }
    })();
  }, [fetchToken, rows.length]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async () => {
    if (shortLines.length > 0) {
      const row = shortLines[0];
      if (row) {
        setPayError(
          `${row.product.name} · ${row.option} requires at least ${minimumOrderQtyForBrand(row.product.brand)} units.`,
        );
      }
      return;
    }
    if (!deliveryConfirmed) {
      setPayError("Confirm that you have checked the recipient and delivery details.");
      return;
    }
    const er: Partial<Record<keyof Form, string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Valid email required";
    if (form.name.trim().length < 2) er.name = "Enter your full name";
    if (form.address.trim().length < 4) er.address = "Enter a street address";
    if (!form.city.trim()) er.city = "Required";
    if (!form.postal.trim()) er.postal = "Required";
    if (!form.country) er.country = "Select a country";
    setErrors(er);
    if (Object.keys(er).length) return;
    if (!cardMounted || !window.Cartadicreditopay) {
      setPayError("The card form is still loading.");
      return;
    }

    setPayError(null);
    setSubmitting(true);
    try {
      const valid = await window.Cartadicreditopay.getValidateResult();
      if (!valid) {
        setPayError("Please check your card details.");
        setSubmitting(false);
        return;
      }
      const { token: cardToken } = await window.Cartadicreditopay.confirmPay();

      const order = await makeOrder({
        data: {
          items: rows.map((r) => ({ id: r.product.id, option: r.option, qty: r.qty })),
          customer: {
            email: form.email.trim(),
            name: form.name.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            postal: form.postal.trim(),
            country: form.country,
            ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
          },
        },
      });

      const sessionId = await getShieldSessionId();
      if (!sessionId) {
        setPayError("Secure check could not start. Please refresh and try again.");
        setSubmitting(false);
        return;
      }

      const result = await pay({
        data: {
          orderNumber: order.orderNumber,
          lookupToken: order.lookupToken,
          cardToken,
          sessionId,
          userAgent: navigator.userAgent.slice(0, 400),
        },
      });

      if (!result.success) {
        setPayError(result.error || "Payment declined. Please try another card.");
        setSubmitting(false);
        return;
      }

      const items: OrderItem[] = rows.map((r) => ({
        name: r.product.name,
        option: r.option,
        qty: r.qty,
      }));
      onPlaceOrder(items);

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }
      if (result.status === "paid") {
        setPlacedId(order.orderNumber);
        setSubmitting(false);
        return;
      }
      window.location.href = `/payment-return?order=${encodeURIComponent(
        order.orderNumber,
      )}&token=${encodeURIComponent(order.lookupToken)}&status=pending`;
    } catch {
      setPayError("Card verification failed. Please check your details and retry.");
      setSubmitting(false);
    }
  };

  if (placedId) {
    return (
      <>
        <SubHeader title="Payment received" onBack={onBrowse} />
        <main className="mx-auto max-w-[560px] px-4 pb-8 pt-10">
          <div className="animate-rise rounded-[28px] bg-card p-8 text-center md:p-10">
            <span className="animate-pop mx-auto grid size-20 place-items-center rounded-full bg-lemon text-ink">
              <Check className="size-9" strokeWidth={3} />
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Paid</h2>
            <p className="mt-2 text-sm font-medium text-mute">
              Order <span className="font-extrabold text-ink">#{placedId}</span> is confirmed. A
              receipt is on its way to <span className="font-extrabold text-ink">{form.email}</span>.
            </p>
            <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-[13px] font-semibold text-mute">
              Age check at dispatch — photo ID required. 18+ only.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={onViewOrders}
                className="grad-cta rounded-full px-7 py-4 text-[15px] font-bold text-white transition hover:brightness-105 active:scale-[0.98]"
              >
                View my orders
              </button>
              <button
                onClick={onBrowse}
                className="rounded-full border border-line bg-paper px-7 py-4 text-[15px] font-bold transition hover:border-ink/40 active:scale-[0.98]"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (rows.length === 0) {
    return (
      <>
        <SubHeader title="Checkout" onBack={onBack} />
        <main className="px-4 py-24 text-center">
          <p className="text-sm font-semibold text-mute">Your cart is empty.</p>
          <button
            onClick={onBrowse}
            className="grad-cta mt-5 rounded-full px-7 py-3.5 text-sm font-bold text-white active:scale-95"
          >
            Browse catalog
          </button>
        </main>
      </>
    );
  }

  const field =
    "mt-1.5 w-full rounded-2xl border bg-paper px-4 py-3.5 text-[15px] font-semibold outline-none transition focus:bg-card " +
    "border-line focus:border-ink/50";

  return (
    <>
      <SubHeader title="Checkout" onBack={onBack} />

      <main className="mx-auto max-w-[760px] px-4 pb-8 pt-5 md:pt-8">
        <div className="grid gap-5 md:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-5">
            <div className="animate-rise rounded-[24px] bg-card p-5 md:p-6">
              <h3 className="font-display text-lg font-extrabold tracking-tight">Delivery details</h3>

              <label className="mt-4 block text-xs font-bold tracking-[0.14em] text-mute">EMAIL</label>
              <input className={cn(field, errors.email && "border-[#c2453f]")} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-[12px] font-bold text-[#c2453f]">{errors.email}</p>}

              <label className="mt-4 block text-xs font-bold tracking-[0.14em] text-mute">FULL NAME</label>
              <input className={cn(field, errors.name && "border-[#c2453f]")} value={form.name} onChange={set("name")} placeholder="Alex Fischer" />
              {errors.name && <p className="mt-1 text-[12px] font-bold text-[#c2453f]">{errors.name}</p>}

              <label className="mt-4 block text-xs font-bold tracking-[0.14em] text-mute">ADDRESS</label>
              <input className={cn(field, errors.address && "border-[#c2453f]")} value={form.address} onChange={set("address")} placeholder="Street and number" />
              {errors.address && <p className="mt-1 text-[12px] font-bold text-[#c2453f]">{errors.address}</p>}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold tracking-[0.14em] text-mute">CITY</label>
                  <input className={cn(field, errors.city && "border-[#c2453f]")} value={form.city} onChange={set("city")} placeholder="Berlin" />
                  {errors.city && <p className="mt-1 text-[12px] font-bold text-[#c2453f]">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.14em] text-mute">POSTAL CODE</label>
                  <input className={cn(field, errors.postal && "border-[#c2453f]")} value={form.postal} onChange={set("postal")} placeholder="10115" />
                  {errors.postal && <p className="mt-1 text-[12px] font-bold text-[#c2453f]">{errors.postal}</p>}
                </div>
              </div>

              <label className="mt-4 block text-xs font-bold tracking-[0.14em] text-mute">COUNTRY</label>
              <select className={cn(field, "appearance-none", errors.country && "border-[#c2453f]")} value={form.country} onChange={set("country")}>
                <option value="">Select country…</option>
                {EU_COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              {errors.country && <p className="mt-1 text-[12px] font-bold text-[#c2453f]">{errors.country}</p>}

              <label className="mt-4 block text-xs font-bold tracking-[0.14em] text-mute">PHONE (OPTIONAL)</label>
              <input className={field} value={form.phone} onChange={set("phone")} placeholder="+49 30 123456" />

              <div className="mt-5 rounded-2xl border border-ember/30 bg-ember/10 p-4">
                <p className="flex items-center gap-2 text-[13px] font-extrabold text-ink">
                  <TriangleAlert className="size-4 shrink-0 text-ember" strokeWidth={2.4} />
                  Check the delivery details carefully
                </p>
                <p className="mt-2 text-[12px] font-semibold leading-relaxed text-mute">
                  Returned parcels are destroyed by the carrier or sent to a virtual return address
                  with no physical warehouse to receive them. They cannot be intercepted, reshipped
                  or returned.
                </p>
                <p className="mt-2 text-[12px] font-semibold leading-relaxed text-mute">
                  Please verify the recipient name, address, postal code and phone number before
                  ordering. Any resulting loss or charges are the customer's responsibility.
                </p>
                <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl bg-card/75 p-3 text-[12px] font-bold leading-relaxed text-ink">
                  <input
                    type="checkbox"
                    checked={deliveryConfirmed}
                    onChange={(event) => {
                      setDeliveryConfirmed(event.target.checked);
                      setPayError(null);
                    }}
                    className="mt-0.5 size-4 shrink-0 accent-current"
                  />
                  I have checked the recipient details and understand that returned parcels cannot
                  be recovered or reshipped.
                </label>
              </div>
            </div>

            {PAYMENT_PAUSED ? (
              <div className="animate-rise rounded-[24px] bg-card p-5 md:p-6" style={{ animationDelay: "60ms" }}>
                <h3 className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
                  <CreditCard className="size-5" strokeWidth={2.2} /> Payment
                </h3>
                <div className="mt-4 rounded-2xl bg-paper p-5 text-center">
                  <p className="text-[15px] font-extrabold">Ordering is currently unavailable</p>
                  <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-mute">
                    Prices are being finalised, so orders can't be placed or paid online right now.
                    For a wholesale quote, email {CONTACT.info} with your list.
                  </p>
                </div>
                <div className="mt-4 rounded-2xl border border-line p-4 text-[12px] font-semibold leading-relaxed text-mute">
                  <p>· No dispatch on Saturdays or Sundays.</p>
                  <p>· Free shipping from {FREE_SHIPPING_MIN_QTY} units; below that a destination surcharge applies (shown in the summary).</p>
                  <p>· No after-sales for: wrong recipient details or lost/unsigned parcels, secondary customs clearance stalls, recipient absent at delivery, or partial product loss in transit. Logistics issues are not covered.</p>
                </div>
              </div>
            ) : (
            <div className="animate-rise rounded-[24px] bg-card p-5 md:p-6" style={{ animationDelay: "60ms" }}>
              <h3 className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
                <CreditCard className="size-5" strokeWidth={2.2} /> Credit card
              </h3>
              <div className="mt-4 rounded-2xl border border-line bg-white p-3">
                <div id="cartadicreditopay-card-element" className="min-h-[210px]" />
                {!cardMounted && !iframeError && (
                  <p className="flex items-center gap-2 px-1 py-2 text-[13px] font-semibold text-mute">
                    <Loader2 className="size-4 animate-spin" /> Loading secure card form…
                  </p>
                )}
              </div>
              {iframeError && (
                <p className="mt-3 text-[13px] font-bold text-[#c2453f]">{iframeError}</p>
              )}
              <p className="mt-3 text-[12px] font-semibold text-mute">
                Card details are entered directly with our payment provider — Vapofolio never sees them.
              </p>
            </div>
            )}
          </div>

          <div className="animate-rise h-fit rounded-[24px] bg-card p-5 md:sticky md:top-24" style={{ animationDelay: "90ms" }}>
            <h3 className="font-display text-lg font-extrabold tracking-tight">Summary</h3>
            <div className="mt-3 flex flex-col gap-2.5">
              {rows.map((r) => (
                <div key={`${r.product.id}-${r.option}`} className="flex justify-between gap-3 text-[13px] font-semibold">
                  <span className="min-w-0 text-mute">
                    <span className="block truncate">{r.qty}× {r.product.name}</span>
                    <span className="mt-0.5 block truncate text-[11px]">{r.option}</span>
                  </span>
                  <span className="shrink-0 text-ink">{formatEur(priceOf(r.product.id) * r.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-3 text-[13px] font-semibold text-mute">
              <span>Units</span>
              <span className="text-ink">{count}</span>
            </div>
            <div className="mt-1 flex justify-between text-[13px] font-semibold text-mute">
              <span>Shipping</span>
              <span className="text-ink">
                {shipping === null ? "Pick a country" : shipping === 0 ? "Free" : formatEur(shipping)}
              </span>
            </div>
            {count < FREE_SHIPPING_MIN_QTY && (
              <p className="mt-1 text-[11px] font-semibold text-mute">
                Free shipping from {FREE_SHIPPING_MIN_QTY} units — {FREE_SHIPPING_MIN_QTY - count} more to go.
              </p>
            )}
            <div className="mt-3 flex justify-between border-t border-line pt-3">
              <span className="font-display text-lg font-extrabold">Total</span>
              <span className="font-display text-lg font-extrabold">{formatEur(total)}</span>
            </div>

            {payError && !PAYMENT_PAUSED && <p className="mt-3 text-[13px] font-bold text-[#c2453f]">{payError}</p>}

            {shortLines.length > 0 && (
              <p className="mt-3 rounded-xl bg-paper px-3 py-2.5 text-[12px] font-bold leading-relaxed text-ember">
                Each flavor must meet its minimum — please add more:{" "}
                {shortLines
                  .map(
                    (row) =>
                      `${row.product.name} · ${row.option} (${row.qty}/${minimumOrderQtyForBrand(row.product.brand)})`,
                  )
                  .join(", ")}
              </p>
            )}

            {PAYMENT_PAUSED ? (
              <span className="grad-cta mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold text-white opacity-50">
                Ordering unavailable
              </span>
            ) : (
            <button
              onClick={submit}
              disabled={submitting || shortLines.length > 0 || !deliveryConfirmed}
              className="grad-cta mt-5 flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-14px_rgba(138,178,226,0.8)] transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting
                ? "Processing…"
                : deliveryConfirmed
                  ? `Pay ${formatEur(total)}`
                  : "Confirm delivery details"}
            </button>
            )}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-mute">
              <ShieldCheck className="size-3.5" strokeWidth={2.4} /> Age verified at dispatch · 18+
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
