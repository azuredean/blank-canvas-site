export const DEFAULT_MINIMUM_PER_FLAVOR = 10;
export const ELFBAR_MINIMUM_PER_FLAVOR = 50;
export const MAXIMUM_PER_FLAVOR = 9999;

export const minimumOrderQtyForBrand = (brand: string): number =>
  brand === "ELFBAR" ? ELFBAR_MINIMUM_PER_FLAVOR : DEFAULT_MINIMUM_PER_FLAVOR;

export const minimumOrderQtyForProductId = (productId: string): number =>
  productId.startsWith("elfbar-")
    ? ELFBAR_MINIMUM_PER_FLAVOR
    : DEFAULT_MINIMUM_PER_FLAVOR;

export const normalizeOrderQty = (brand: string, quantity: number): number =>
  Math.min(
    MAXIMUM_PER_FLAVOR,
    Math.max(minimumOrderQtyForBrand(brand), Math.floor(Number.isFinite(quantity) ? quantity : 0)),
  );
