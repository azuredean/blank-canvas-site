import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}

export default function SubHeader({ title, onBack, right }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="grid size-11 place-items-center rounded-full text-ink transition hover:bg-paper active:scale-90"
        >
          <ArrowLeft className="size-[22px]" strokeWidth={2.4} />
        </button>
        <h1 className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate text-center font-display text-[17px] font-extrabold tracking-tight">
          {title}
        </h1>
        <div className="grid size-11 place-items-center">{right}</div>
      </div>
    </header>
  );
}
