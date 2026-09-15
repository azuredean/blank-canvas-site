import type { ReactNode } from "react";

interface Props {
  kicker: string;
  title: string;
  action?: ReactNode;
}

export default function SectionTitle({ kicker, title, action }: Props) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.16em] text-mute">{kicker}</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight md:text-[28px]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
