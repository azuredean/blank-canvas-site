import { AlertTriangle, Mail } from "lucide-react";
import Logo from "./Logo";
import Reveal from "./Reveal";
import { CONTACT, EU_POLICIES } from "../data";

interface Props {
  onSupport?: () => void;
}

export default function Footer({ onSupport }: Props) {
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="mt-12 flex flex-col gap-4 md:mt-16">
      <Reveal>
        <div className="flex flex-col gap-3 rounded-[24px] bg-ink p-5 text-white md:flex-row md:items-center md:gap-5 md:px-7 md:py-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lemon text-ink">
            <AlertTriangle className="size-5" strokeWidth={2.4} />
          </span>
          <p className="text-[13px] font-semibold leading-relaxed md:text-sm">
            This product contains nicotine. Nicotine is a highly addictive substance. Intended for
            adult smokers and vapers of legal age only. Keep out of the reach of children and pets.
          </p>
          <span className="hidden shrink-0 rounded-full border-2 border-lemon px-3.5 py-1.5 font-display text-xs font-extrabold text-lemon md:block">
            18+
          </span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="rounded-[24px] bg-card px-5 py-6 md:px-7 md:py-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <Logo className="h-9 w-9 shrink-0" />
              <div>
                <p className="font-display text-sm font-extrabold tracking-tight">{CONTACT.company}</p>
                <p className="mt-0.5 text-[12px] font-semibold text-mute">
                  {CONTACT.address} · {CONTACT.city}
                </p>
                <p className="mt-0.5 text-[12px] font-semibold text-mute">B2B wholesale catalog · Adult trade only</p>

                <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-mute">INFORMATION DESK</p>
                <a
                  href={`mailto:${CONTACT.info}`}
                  className="mt-1 inline-flex items-center gap-2 font-display text-[15px] font-extrabold tracking-tight underline decoration-lemon decoration-2 underline-offset-4 transition hover:decoration-ink"
                >
                  <Mail className="size-4" strokeWidth={2.4} />
                  {CONTACT.info}
                </a>
                <p className="mt-2 text-[11px] font-semibold text-mute">
                  Trade quotes ·{" "}
                  <a href={`mailto:${CONTACT.trade}`} className="text-ink underline decoration-line underline-offset-2">
                    {CONTACT.trade}
                  </a>
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-bold text-mute">
              <button type="button" onClick={() => go("terms")} className="transition hover:text-ink">
                Terms
              </button>
              <button type="button" onClick={() => go("privacy")} className="transition hover:text-ink">
                Privacy
              </button>
              <button type="button" onClick={() => go("cookies")} className="transition hover:text-ink">
                Cookies
              </button>
              <button type="button" onClick={() => go("impressum")} className="transition hover:text-ink">
                Impressum
              </button>
              <button type="button" onClick={onSupport} className="transition hover:text-ink">
                Shipping
              </button>
              <button type="button" onClick={onSupport} className="transition hover:text-ink">
                Contact
              </button>
            </nav>
          </div>

          <div id="legal" className="mt-6 scroll-mt-4 border-t border-line pt-5">
            <p className="text-[11px] font-bold tracking-[0.16em] text-mute">EU & EEA MARKET NOTES</p>
            <p className="mt-2 max-w-3xl text-[11px] font-medium leading-relaxed text-mute">
              Indicative only — not legal advice. Destination-market rules govern nicotine strength,
              tank size, flavours and distance sales. We quote and ship only where licensed adult
              trade is permitted. Confirm local law before you enquire. List prices are never shown;
              landed wholesale pricing is issued privately to {CONTACT.info}.
            </p>
            <dl className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {EU_POLICIES.map((row, i) => (
                <div key={row.region} className={i === 0 ? "sm:col-span-2 lg:col-span-3" : undefined}>
                  <dt className="text-[10px] font-extrabold tracking-wide text-ink">{row.region}</dt>
                  <dd className={i === 0 ? "mt-0.5 max-w-3xl text-[10px] font-medium leading-relaxed text-mute" : "mt-0.5 text-[10px] font-medium leading-relaxed text-mute"}>
                    {row.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 grid gap-4 border-t border-line pt-5 text-[10px] font-medium leading-relaxed text-mute sm:grid-cols-2">
            <div id="terms" className="scroll-mt-4">
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-ink">TERMS OF ENQUIRY</p>
              <p className="mt-1.5">
                This site is a B2B quotation catalogue, not a consumer shop. Submitting a quote is an
                invitation to treat, not an offer. We may decline any destination where distance sale
                of nicotine products is restricted (notably BE, DK, FI). Allocation, nicotine strength
                and flavours follow destination law. Age is verified before dispatch — 18+ only.
              </p>
            </div>
            <div id="privacy" className="scroll-mt-4">
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-ink">PRIVACY · GDPR</p>
              <p className="mt-1.5">
                Personal data (name, email, delivery address) is processed to handle trade enquiries
                under Art. 6(1)(b) and (f) GDPR. We do not sell personal data. Retention is limited to
                quote and dispatch records. To access, correct or erase your data, write to{" "}
                <a href={`mailto:${CONTACT.info}`} className="text-ink underline decoration-line underline-offset-2">
                  {CONTACT.info}
                </a>
                . Supervisory authority: Berliner Beauftragte für Datenschutz und Informationsfreiheit.
              </p>
            </div>
            <div id="cookies" className="scroll-mt-4">
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-ink">COOKIES</p>
              <p className="mt-1.5">
                Only essential local storage is used (age gate, quote list, wishlist, account email).
                No advertising, analytics or cross-site tracking cookies are set. Continuing to use
                the catalogue after confirming you are 18+ constitutes acceptance of this essential
                storage.
              </p>
            </div>
            <div id="impressum" className="scroll-mt-4">
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-ink">IMPRESSUM</p>
              <p className="mt-1.5">
                {CONTACT.company}
                <br />
                {CONTACT.address}
                <br />
                {CONTACT.city}
                <br />
                Information: {CONTACT.info}
                <br />
                Trade desk: {CONTACT.trade}
                <br />
                VAT ID is shown on invoice. Responsible for content: the managing directors at the
                Berlin address above (§ 5 DDG / § 18 MStV).
              </p>
            </div>
          </div>

          <p className="mt-5 text-[10px] font-medium leading-relaxed text-mute">
            Not a licensed smoking-cessation medicine and not intended to diagnose, treat or prevent
            any disease. Child-resistant and tamper-evident packaging. Dispose of devices and batteries
            per WEEE Directive 2012/19/EU and the Battery Regulation (EU) 2023/1542; packaging is
            recyclable. Materials intended to comply with REACH and RoHS. Hardware supplied for the
            Union is CE-marked where required. Distance-selling rules for consumers do not apply to
            this B2B catalogue. Catalog © {new Date().getFullYear()} {CONTACT.company}. All rights
            reserved.
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
