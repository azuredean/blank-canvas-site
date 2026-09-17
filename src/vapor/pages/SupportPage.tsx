import { useState } from "react";
import { ChevronDown, LifeBuoy, Mail } from "lucide-react";
import SubHeader from "../components/SubHeader";
import { CONTACT } from "../data";

const FAQS = [
  {
    q: "Who is allowed to enquire?",
    a: "Only adults aged 18 or older (21 in some regions), typically licensed trade. Age is verified before dispatch. Nicotine products are never sold to minors.",
  },
  {
    q: "Why are there no prices on the site?",
    a: "List prices in our supplier sheets are cost prices, not selling prices. We quote privately based on brand, volume and destination. Add lines to your quote list and send an enquiry.",
  },
  {
    q: "Which countries do you ship to?",
    a: "We quote across the EU and EEA wherever distance sales are permitted. Belgium, Denmark and Finland currently restrict cross-border e-cigarette sales, so those destinations may be declined.",
  },
  {
    q: "What is the minimum order?",
    a: "Minimum 10 units per brand. You can mix flavors freely within a brand to reach the minimum.",
  },
  {
    q: "How much is shipping?",
    a: "Orders of 50 units or more ship free. Below that, a surcharge of €5–€20 applies depending on destination and order size — the exact amount is shown at checkout once you select your country.",
  },
  {
    q: "When do orders ship?",
    a: "Orders are packed and dispatched Monday to Friday. There is no dispatch on Saturdays or Sundays.",
  },
  {
    q: "Which delivery issues are not covered?",
    a: "No after-sales is possible for: (1) incorrect recipient details, or parcels lost or unsigned because of them; (2) tracking gaps caused by secondary customs clearance; (3) parcels lost because the recipient was absent at delivery; (4) partial product loss inside the parcel during transit. Logistics issues are not eligible for after-sales.",
  },
  {
    q: "What nicotine strengths are in the catalog?",
    a: "The catalog includes 0%, 2%, 3% and 5% depending on the device, plus TPD-oriented 2% pod systems (JNR Areo X, FOX, Panda). Strengths actually shipped follow destination-market law.",
  },
  {
    q: "Can I return a product?",
    a: "Unopened trade cartons can be discussed within 14 days. Opened pods and e-liquids cannot be returned once unsealed, for hygiene reasons.",
  },
];

interface Props {
  onBack: () => void;
}

export default function SupportPage({ onBack }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <SubHeader title="Safety & Support" onBack={onBack} />

      <main className="mx-auto max-w-[760px] px-4 pb-8 pt-5 md:pt-8">
        <div className="animate-rise flex items-center gap-3 rounded-[28px] bg-ink p-6 text-white md:p-7">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lemon text-ink">
            <LifeBuoy className="size-5" strokeWidth={2.3} />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">We're here to help</h2>
            <p className="mt-0.5 text-[13px] font-medium text-white/60">
              Answers on age policy, quotes, nicotine and returns.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="animate-rise overflow-hidden rounded-[20px] bg-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-bold">{f.q}</span>
                  <ChevronDown
                    className={
                      "size-5 shrink-0 text-mute transition-transform duration-300 " + (isOpen && "rotate-180")
                    }
                    strokeWidth={2.4}
                  />
                </button>
                <div
                  className={
                    "grid transition-all duration-300 ease-out " +
                    (isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
                  }
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm font-medium leading-relaxed text-mute">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="animate-rise mt-4 flex flex-col items-center gap-2 rounded-[22px] bg-card p-6 text-center" style={{ animationDelay: "120ms" }}>
          <Mail className="size-6 text-mute" strokeWidth={2} />
          <p className="text-sm font-bold">Still need help?</p>
          <a
            href={`mailto:${CONTACT.info}`}
            className="text-[15px] font-extrabold underline decoration-lemon decoration-2 underline-offset-4 transition hover:decoration-ink"
          >
            {CONTACT.info}
          </a>
          <p className="text-[11px] font-semibold text-mute">
            Replies within 24 h · Mon–Fri
          </p>
        </div>
      </main>
    </>
  );
}
