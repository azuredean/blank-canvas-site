import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import Logo from "./Logo";
import ProductVisual from "./ProductVisual";
import { CATEGORIES, CONTACT, GRID_PRODUCTS, type Filter, type Product } from "../data";

export const NAV_LINKS = [
  "Home",
  "ELFBAR",
  "JNR",
  "Vozol",
  "Fumot",
  "Lost Mary",
  "Safety & Support",
];

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (link: string) => void;
  onPickCategory: (f: Filter) => void;
}

export function MenuDrawer({ open, onClose, onNavigate, onPickCategory }: DrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={
          "fixed inset-0 z-50 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <aside
        className={
          "fixed left-0 top-0 z-50 flex h-full w-[300px] flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-out " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="font-display text-lg font-extrabold tracking-tight">VAPOR</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-full transition hover:bg-paper active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_LINKS.map((l, i) => (
            <button
              key={l}
              onClick={() => onNavigate(l)}
              className={
                "rounded-xl px-4 py-3 text-left text-[15px] font-bold transition hover:bg-paper " +
                (i === 0 ? "bg-lemon/60" : "")
              }
            >
              {l}
            </button>
          ))}
        </nav>

        <p className="mt-8 px-4 text-xs font-bold tracking-[0.14em] text-mute">BROWSE THE SHOP</p>
        <div className="mt-3 flex flex-col gap-1">
          {CATEGORIES.filter((c) => c !== "All").map((c) => (
            <button
              key={c}
              onClick={() => onPickCategory(c)}
              className="rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-mute transition hover:bg-paper hover:text-ink"
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-auto px-4 text-[11px] leading-relaxed text-mute">
          18+ only · Wholesale catalog.
          <br />
          <a href={`mailto:${CONTACT.info}`} className="font-bold text-ink">
            {CONTACT.info}
          </a>
          <br />
          Nicotine is highly addictive. © {new Date().getFullYear()} {CONTACT.company}.
        </p>
      </aside>
    </>
  );
}

interface SearchProps {
  open: boolean;
  onClose: () => void;
  onAdd: (p: Product) => void;
  onOpen: (id: string) => void;
}

export function SearchOverlay({ open, onClose, onAdd, onOpen }: SearchProps) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return GRID_PRODUCTS;
    return GRID_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.brand.toLowerCase().includes(t) ||
        p.kind.toLowerCase().includes(t) ||
        p.options.some((o) => o.toLowerCase().includes(t)),
    );
  }, [q]);

  if (!open) return null;

  return (
    <div className="animate-fade fixed inset-0 z-50 flex flex-col bg-paper">
      <div className="sticky top-0 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[900px] items-center gap-3 px-5 md:h-[72px]">
          <Search className="size-5 shrink-0 text-mute" strokeWidth={2.4} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brands, devices, flavors…"
            className="h-full w-full bg-transparent font-display text-lg font-bold tracking-tight outline-none placeholder:font-body placeholder:text-sm placeholder:font-medium placeholder:text-mute"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[900px] flex-1 overflow-y-auto px-5 py-5">
        <p className="mb-3 text-xs font-bold tracking-[0.14em] text-mute">
          {q ? `${results.length} RESULT${results.length === 1 ? "" : "S"}` : "ALL PRODUCTS"}
        </p>
        <div className="flex flex-col gap-2.5 pb-28">
          {results.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpen(p.id)}
              className="flex cursor-pointer items-center gap-4 rounded-2xl bg-card p-3.5 transition hover:shadow-md"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper">
                <ProductVisual product={p} className="h-12 w-12" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{p.name}</p>
                <p className="text-xs font-semibold text-mute">
                  {p.brand} · {p.puffs ?? p.kind}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(p);
                }}
                disabled={p.stock === "out"}
                aria-label={`Add ${p.name}`}
                className="grad-cta glow-blue grid size-11 shrink-0 place-items-center rounded-full text-white transition hover:scale-110 active:scale-90 disabled:opacity-35"
              >
                <Plus className="size-[18px]" strokeWidth={2.8} />
              </button>
            </div>
          ))}
          {results.length === 0 && (
            <p className="py-16 text-center text-sm font-semibold text-mute">Nothing matches “{q}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Toast({ id, message }: { id: number; message: string }) {
  return (
    <div
      key={id}
      className="animate-toast fixed bottom-28 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-xl md:bottom-32"
    >
      <span className="grid size-5 place-items-center rounded-full bg-lemon text-ink">
        <Check className="size-3" strokeWidth={3.2} />
      </span>
      {message}
    </div>
  );
}
