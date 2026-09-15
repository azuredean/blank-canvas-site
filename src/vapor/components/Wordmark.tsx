import { CONTACT } from "../data";

interface Props {
  className?: string;
}

export default function Wordmark({ className = "" }: Props) {
  return (
    <span
      className={`relative inline-block whitespace-nowrap pb-1 font-display font-extrabold uppercase leading-none tracking-[-0.055em] text-ink ${className}`}
    >
      {CONTACT.company.toUpperCase()}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-ember via-lemon to-sky"
      />
    </span>
  );
}
