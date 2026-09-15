/** ISO-3166 alpha-2 codes required by the card gateway. */
export const EU_COUNTRY_OPTIONS: { code: string; name: string }[] = [
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
  { code: "FI", name: "Finland" },
  { code: "DK", name: "Denmark" },
  { code: "SE", name: "Sweden" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czechia" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "HR", name: "Croatia" },
  { code: "LU", name: "Luxembourg" },
  { code: "EE", name: "Estonia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "BG", name: "Bulgaria" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
];

const NAME_TO_CODE = new Map(
  EU_COUNTRY_OPTIONS.map((c) => [c.name.toLowerCase(), c.code] as const),
);

/** Accepts a code or a full country name and returns the alpha-2 code. */
export function toCountryCode(value: string): string | null {
  const raw = value.trim();
  if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();
  return NAME_TO_CODE.get(raw.toLowerCase()) ?? null;
}
