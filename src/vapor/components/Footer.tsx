import { AlertTriangle, Check, Globe2, HeartPulse, Recycle, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import Reveal from "./Reveal";

const COMPLIANCE = [
  "Adult trade only — 18+ (21+ where required by local law)",
  "Destination-market rules apply for nicotine strength and tank size",
  "Hardware CE-marked where supplied for the EU",
  "Child-resistant & tamper-evident packaging",
  "Not a licensed smoking-cessation medicine",
  "Keep devices and e-liquid away from children and pets",
];

const SAFETY = [
  "For adult smokers & vapers only — never for non-smokers",
  "Do not use if pregnant, breastfeeding or with heart conditions",
  "Nicotine is a highly addictive substance",
  "If swallowed or unwell, contact a poison centre immediately",
  "Age check required before any dispatch",
];

const ENVIRONMENT = [
  "Dispose of devices & batteries per WEEE Directive 2012/19/EU",
  "Remove the battery and recycle at designated collection points",
  "Packaging is recyclable",
  "Materials intended to comply with REACH & RoHS",
];

function PolicyCard({
  icon: Icon,
  title,
  items,
  delay,
}: {
  icon: typeof ShieldCheck;
  title: string;
  items: string[];
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col rounded-[24px] bg-card p-6 shadow-[0_20px_44px_-34px_rgba(22,22,15,0.4)] md:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lemon text-ink">
            <Icon className="size-5" strokeWidth={2.3} />
          </span>
          <h3 className="font-display text-lg font-extrabold tracking-tight">{title}</h3>
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[13px] font-medium leading-relaxed text-mute">
              <Check className="mt-0.5 size-3.5 shrink-0 text-ink" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-5 md:mt-24">
      <Reveal>
        <div className="flex flex-col gap-4 rounded-[28px] bg-ink p-6 text-white md:flex-row md:items-center md:gap-6 md:p-8">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lemon text-ink">
            <AlertTriangle className="size-6" strokeWidth={2.4} />
          </span>
          <div>
            <p className="font-display text-lg font-extrabold leading-snug tracking-tight md:text-xl">
              This product contains nicotine. Nicotine is a highly addictive substance.
            </p>
            <p className="mt-1.5 text-[13px] font-medium text-white/60">
              Intended for adults of legal age only. Keep out of the reach of children and pets.
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full border-2 border-lemon px-4 py-2 font-display text-sm font-extrabold text-lemon md:block">
            18+
          </span>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <PolicyCard icon={ShieldCheck} title="Trade & Compliance" items={COMPLIANCE} delay={0} />
        <PolicyCard icon={HeartPulse} title="Health & Safety" items={SAFETY} delay={120} />
        <PolicyCard icon={Recycle} title="Recycling & Environment" items={ENVIRONMENT} delay={240} />
      </div>

      <Reveal delay={120}>
        <div className="rounded-[24px] bg-card p-6 shadow-[0_20px_44px_-34px_rgba(22,22,15,0.4)] md:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lemon text-ink">
              <Globe2 className="size-5" strokeWidth={2.3} />
            </span>
            <h3 className="font-display text-lg font-extrabold tracking-tight">
              EU & EEA Member-State Notes
            </h3>
          </div>
          <p className="mt-4 text-[13px] font-medium leading-relaxed text-mute">
            The legal purchase age is 18+ in all EU and EEA member states. Distance-sale, flavour
            and retail rules vary by country. We quote and ship only where permitted by law —
            please check local regulations before placing an enquiry. Prices are provided on
            request and are not listed on this catalog.
          </p>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <div className="flex flex-col items-center justify-between gap-5 rounded-[24px] bg-card px-6 py-5 md:flex-row md:px-7">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <div>
              <p className="font-display text-sm font-extrabold tracking-tight">VAPOR Labs GmbH</p>
              <p className="text-[11px] font-semibold text-mute">Berlin, DE · © 2026 · All rights reserved</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-bold text-mute">
            {["Terms", "Privacy", "Cookies", "Shipping", "Contact"].map((l) => (
              <button key={l} className="transition hover:text-ink">
                {l}
              </button>
            ))}
          </nav>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-xs font-extrabold text-lemon">
            18+
          </span>
        </div>
      </Reveal>
    </footer>
  );
}
