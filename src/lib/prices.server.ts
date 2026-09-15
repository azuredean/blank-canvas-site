/**
 * Server-side price allow-list, in EUR per single unit.
 * This is the ONLY authoritative price source — client-sent prices are ignored.
 * Every sellable product id must appear here or checkout fails.
 */
export const PRODUCT_PRICES: Record<string, number> = {
  "elfbar-bc45000": 12,
  "elfbar-lush-king-pro-40k": 12,
  "elfbar-moonnight-40k": 12,
  "elfbar-raya-d3-25k": 10,
  "elfbar-gh33000-pro": 12,
  "elfbar-trio-40k": 13,
  "elfbar-gh23000": 10,
  "elfbar-duke-30000": 11,
  "elfbar-elfliq-30ml": 8,
  "lost-mary-mt50000-turbo": 14,
  "fumot-digital-box-12000": 9,
  "fumot-tornado-15000": 9,
  "fumot-eco-4in1-80k": 18,
  "jnr-alien-10k": 8,
  "jnr-falcon-16k": 10,
  "jnr-falcon-x-18k": 11,
  "jnr-mega-box": 12,
  "jnr-shisha-max": 15,
  "jnr-tank-pro": 12,
  "jnr-areo-x": 10,
  "jnr-fox-10000": 8,
  "jnr-falcon-pro": 12,
  "jnr-panda": 9,
  "jnr-mega-box-pro": 14,
  "jnr-shisha-hookah-70k": 19,
  "jnr-crown-shisha-100k": 24,
  "jnr-rage-gorilla-55k": 16,
  "jnr-windwhip-44000": 14,
  "jnr-shisha-ultra-45000": 15,
  "jnr-hexafuse-120k": 26,
  "jnr-lila-kiss-60k": 17,
  "vozol-rave-40k": 13,
  "vozol-vista-40k": 13,
  "vozol-star-40k": 13,
  "vozol-gear-50k": 15,
  "vozol-star-click-50k": 16,
  "vozol-neon-60k": 17,
};

export const SHIPPING_COST = 0;
export const CURRENCY = "EUR";
