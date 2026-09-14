import { useState } from "react";
import { Check, Mail, ShieldCheck } from "lucide-react";
import SubHeader from "../components/SubHeader";
import type { CartRow } from "./CartPage";
import type { OrderItem } from "../data";
import { EU_COUNTRIES } from "../data";
import { cn } from "../utils/cn";

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
}

const EMPTY: Form = { email: "", name: "", address: "", city: "", postal: "", country: "" };

export default function CheckoutPage({ rows, onBack, onPlaceOrder, onViewOrders, onBrowse }: Props) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [placedId, setPlacedId] = useState<string | null>(null);

  const count = rows.reduce((s, r) => s + r.qty, 0);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = () => {
    const er: Partial<Record<keyof Form, string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Valid email required";
    if (form.name.trim().length < 2) er.name = "Enter your full name";
    if (form.address.trim().length < 4) er.address = "Enter a street address";
    if (!form.city.trim()) er.city = "Required";
    if (!form.postal.trim()) er.postal = "Required";
    if (!form.country) er.country = "Select a country";
    setErrors(er);
    if (Object.keys(er).length) return;

    const items: OrderItem[] = rows.map((r) => ({
      name: r.product.name,
      option: r.option,
      qty: r.qty,
    }));
    setPlacedId(onPlaceOrder(items));
  };

  if (placedId) {
    return (
      <>
        <SubHeader title="Quote sent" onBack={onBrowse} />
        <main className="mx-auto max-w-[560px] px-4 pb-44 pt-10 md:pb-28">
          <div className="animate-rise rounded-[28px] bg-card p-8 text-center md:p-10">
            <span className="animate-pop mx-auto grid size-20 place-items-center rounded-full bg-lemon text-ink">
              <Check className="size-9" strokeWidth={3} />
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Received</h2>
            <p className="mt-2 text-sm font-medium text-mute">
              Quote <span className="font-extrabold text-ink">#{placedId}</span> is with our trade desk.
              We'll reply to <span className="font-extrabold text-ink">{form.email}</span> with
              landed pricing.
            </p>
            <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-[13px] font-semibold text-mute">
              Age check at dispatch — photo ID required. 18+ only.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={onViewOrders}
                className="grad-cta rounded-full px-7 py-4 text-[15px] font-bold text-white transition hover:brightness-105 active:scale-[0.98]"
              >
                View my quotes
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
        <SubHeader title="Request quote" onBack={onBack} />
        <main className="px-4 py-24 text-center">
          <p className="text-sm font-semibold text-mute">Your quote list is empty.</p>
          <button onClick={onBrowse} className="grad-cta mt-5 rounded-full px-7 py-3.5 text-sm font-bold text-white active:scale-95">
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
      <SubHeader title="Request quote" onBack={onBack} />

      <main className="mx-auto max-w-[760px] px-4 pb-44 pt-5 md:pb-28 md:pt-8">
        <div className="grid gap-5 md:grid-cols-[1fr_320px]">
          <div className="animate-rise rounded-[24px] bg-card p-5 md:p-6">
            <h3 className="font-display text-lg font-extrabold tracking-tight">Trade details</h3>

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
              {EU_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-[12px] font-bold text-[#c2453f]">{errors.country}</p>}

            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-paper px-4 py-3 text-[12px] font-semibold text-mute">
              <Mail className="size-4 shrink-0 text-ink" strokeWidth={2.2} />
              No payment on this form — we send a private quote first.
            </div>
          </div>

          <div className="animate-rise h-fit rounded-[24px] bg-card p-5 md:sticky md:top-24" style={{ animationDelay: "90ms" }}>
            <h3 className="font-display text-lg font-extrabold tracking-tight">Summary</h3>
            <div className="mt-3 flex flex-col gap-2.5">
              {rows.map((r) => (
                <div key={`${r.product.id}-${r.option}`} className="flex justify-between gap-3 text-[13px] font-semibold">
                  <span className="min-w-0 truncate text-mute">
                    {r.qty}× {r.product.name}
                  </span>
                  <span className="shrink-0 text-ink">{r.option}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-3">
              <span className="font-display text-lg font-extrabold">Units</span>
              <span className="font-display text-lg font-extrabold">{count}</span>
            </div>
            <button
              onClick={submit}
              className="grad-cta mt-5 w-full rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-14px_rgba(138,178,226,0.8)] transition hover:brightness-105 active:scale-[0.98]"
            >
              Send quote request
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-mute">
              <ShieldCheck className="size-3.5" strokeWidth={2.4} /> Age verified at dispatch · 18+
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
