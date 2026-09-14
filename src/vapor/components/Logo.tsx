interface Props {
  className?: string;
}

/** Vape-themed mark: a device capsule on a lemon disc with rising vapor wisps. */
export default function Logo({ className = "h-9 w-9" }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Vapor logo">
      <circle cx="24" cy="28" r="12" fill="var(--color-lemon)" />

      <g
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-[vapor_3.2s_ease-in-out_infinite]"
      >
        <path d="M21.5 18.2 C 19.6 15.8, 23.4 13.8, 21.5 11.2 C 20.3 9.5, 22.5 8, 21.8 6.4" />
        <path d="M26.6 17.6 C 25 15.6, 28.2 13.8, 26.6 11.6" opacity="0.5" />
      </g>

      <rect x="20.5" y="22.5" width="7" height="13.5" rx="3.5" fill="var(--color-ink)" />
      <rect x="22" y="20" width="4" height="4" rx="1.6" fill="var(--color-ink)" />
      <circle cx="24" cy="32.5" r="1.3" fill="var(--color-lemon)" />

      <path
        d="M39 11.5 v5 M36.5 14 h5"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="9.5" cy="38" r="1.6" fill="var(--color-ink)" />
    </svg>
  );
}
