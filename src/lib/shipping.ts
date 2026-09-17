/**
 * Wholesale shipping surcharges in EUR by destination country (ISO alpha-2)
 * and order size: [10–29 units, 30–49 units]. Orders of 50+ units ship free.
 */
const RATES: Record<string, [number, number]> = {
  DE: [8, 5], // Germany
  NL: [8, 5], // Netherlands
  BE: [10, 8], // Belgium
  FR: [15, 12], // France
  IT: [15, 12], // Italy
  AT: [15, 12], // Austria
  ES: [15, 10], // Spain
  PL: [15, 10], // Poland
  HU: [15, 10], // Hungary
  RO: [20, 15], // Romania
  SK: [20, 15], // Slovakia
  SI: [20, 15], // Slovenia
  FI: [20, 15], // Finland
  DK: [20, 15], // Denmark
  SE: [20, 15], // Sweden
  HR: [20, 15], // Croatia
  LU: [20, 15], // Luxembourg
  CZ: [20, 15], // Czechia
  IE: [20, 15], // Ireland
  PT: [20, 15], // Portugal
  EE: [20, 15], // Estonia
  LT: [20, 15], // Lithuania
  LV: [20, 15], // Latvia
  GR: [20, 15], // Greece
  BG: [20, 15], // Bulgaria
};

/** Fallback for destinations not listed above (e.g. Malta, Cyprus). */
const DEFAULT_RATE: [number, number] = [20, 15];

export const FREE_SHIPPING_MIN_QTY = 50;
export const MID_TIER_MIN_QTY = 30;

/** Online card payment is paused — customers can build orders but not pay. */
export const PAYMENT_PAUSED = true;

export function shippingFor(countryCode: string | null | undefined, totalQty: number): number {
  if (totalQty >= FREE_SHIPPING_MIN_QTY) return 0;
  const [low, mid] = RATES[(countryCode ?? "").toUpperCase()] ?? DEFAULT_RATE;
  return totalQty >= MID_TIER_MIN_QTY ? mid : low;
}
