import { useState } from "react";
import { ShieldCheck, XCircle } from "lucide-react";
import Logo from "./Logo";

interface Props {
  onConfirm: () => void;
}

export default function AgeGate({ onConfirm }: Props) {
  const [denied, setDenied] = useState(false);

  return (
    <div className="hero-tint flex min-h-dvh w-full items-center justify-center overflow-y-auto px-5 py-10">
      {!denied ? (
        <div className="animate-rise w-full max-w-md rounded-[32px] bg-card p-7 text-center shadow-[0_40px_90px_-40px_rgba(22,22,15,0.45)] md:p-10">
          <div className="flex justify-center">
            <Logo className="h-14 w-14" />
          </div>
          <p className="mt-5 text-xs font-bold tracking-[0.16em] text-mute">AGE VERIFICATION</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
            Are you 18 or older?
          </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-mute">
            This catalog lists nicotine-containing vapor products for licensed
            adult trade. By entering, you confirm that you are of legal age in
            your country of residence.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="grad-cta relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-14px_rgba(138,178,226,0.8)] transition hover:brightness-105 active:scale-95"
            >
              <ShieldCheck className="size-5" strokeWidth={2.4} />
              I am 18 or older — Enter
            </button>
            <button
              type="button"
              onClick={() => setDenied(true)}
              className="rounded-full border border-line bg-paper px-7 py-4 text-[15px] font-bold text-ink transition hover:border-ink/40 active:scale-95"
            >
              I am under 18
            </button>
          </div>

          <p className="mt-6 text-[11px] font-semibold leading-relaxed text-mute">
            Nicotine is a highly addictive substance. Intended for adult smokers and vapers only.
          </p>
        </div>
      ) : (
        <div className="animate-rise w-full max-w-md rounded-[32px] bg-card p-8 text-center shadow-[0_40px_90px_-40px_rgba(22,22,15,0.45)] md:p-10">
          <div className="flex justify-center">
            <span className="grid size-16 place-items-center rounded-full bg-ink text-lemon">
              <XCircle className="size-8" strokeWidth={2.2} />
            </span>
          </div>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-[-0.03em]">Access denied</h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-mute">
            You must be of legal age to view this catalog. Come back once you are 18 or older — we'll
            be here.
          </p>
          <button
            type="button"
            onClick={() => setDenied(false)}
            className="mt-8 rounded-full border border-line bg-paper px-7 py-3.5 text-sm font-bold text-ink transition hover:border-ink/40 active:scale-95"
          >
            I made a mistake
          </button>
        </div>
      )}
    </div>
  );
}
