/** CartaDiCreditoPay credit-card gateway helpers (server only). */

export interface PaymentGatewayConfig {
  merchantId: string;
  privateKey: string;
  publicKey: string;
  env: "sandbox" | "production";
  siteDomain: string;
  apiBase: string;
  frontendUrl: string;
  /** Browser SDK URLs, resolved server-side so the client never picks an environment. */
  sdkUrl: string;
  shieldUrl: string;
}

export function getPaymentConfig(): PaymentGatewayConfig {
  const merchantId = process.env["WINTOPAY_MERCHANT_ID"]?.trim();
  const privateKey = process.env["WINTOPAY_RSA_PRIVATE_KEY"]?.trim();
  const publicKey = process.env["WINTOPAY_PUBLIC_KEY"]?.trim() ?? "";
  const env = (process.env["WINTOPAY_ENV"]?.trim() || "sandbox") as "sandbox" | "production";
  const siteDomain = process.env["WINTOPAY_SITE_DOMAIN"]?.trim() || "vapofolio.com";
  const frontendUrl = process.env["FRONTEND_URL"]?.trim();

  if (!merchantId) throw new Error("WINTOPAY_MERCHANT_ID is not configured");
  if (!privateKey) throw new Error("WINTOPAY_RSA_PRIVATE_KEY is not configured");
  if (!frontendUrl) throw new Error("FRONTEND_URL is not configured");

  return {
    merchantId,
    privateKey,
    publicKey,
    env,
    siteDomain,
    frontendUrl: frontendUrl.replace(/\/+$/, ""),
    apiBase:
      env === "production"
        ? "https://api.cartadicreditopay.com"
        : "https://stg-gateway.wintopay.com",
    sdkUrl:
      env === "production"
        ? "https://widget.cartadicreditopay.com/iframe.js"
        : "https://stg-gateway.wintopay.com/icashier/iframe.js",
    shieldUrl:
      env === "production"
        ? "https://js.cartadicreditopay.com/js/shield/v3"
        : "https://stage-js.wintopay.com/js/shield/v3",
  };
}

function base64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(value: string): Uint8Array {
  const bin = atob(value);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function parsePem(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s/g, "");
  return fromBase64(body).buffer as ArrayBuffer;
}

export async function signWithRSA(data: string, privateKeyPem: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "pkcs8",
    parsePem(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(data));
  return base64(new Uint8Array(sig));
}

export async function verifyRSASignature(
  data: string,
  signature: string,
  publicKeyPem: string,
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "spki",
      parsePem(publicKeyPem),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      fromBase64(signature).buffer as ArrayBuffer,
      new TextEncoder().encode(data),
    );
  } catch {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortAndClean(obj: any): any {
  if (obj === null || obj === undefined || obj === "") return undefined;
  if (Array.isArray(obj)) return obj.map(sortAndClean).filter((v) => v !== undefined);
  if (typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: Record<string, any> = {};
    for (const k of Object.keys(obj).sort()) {
      const v = sortAndClean(obj[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  return obj;
}

/** The exact string to sign AND to send as the request body. */
export function buildSignString(body: Record<string, unknown>): string {
  return JSON.stringify(sortAndClean(body));
}

/** Builds the verification string for an inbound callback payload (spec: drop sign_verify, sort, drop empty, compact JSON). */
export function buildCallbackSignString(payload: Record<string, unknown>): string {
  const clone: Record<string, unknown> = { ...payload };
  delete clone["sign"];
  delete clone["sign_verify"];
  return buildSignString(clone);
}

/** Verifies the X-SIGNATURE the gateway returns on a payment response (body + X-TIMESTAMP). */
export async function verifyResponseSignature(
  bodyText: string,
  timestamp: string | null,
  signature: string | null,
  publicKeyPem: string,
): Promise<boolean> {
  if (!signature || !publicKeyPem) return false;
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(bodyText) as Record<string, unknown>;
  } catch {
    return false;
  }
  const withTimestamp = { ...parsed, ...(timestamp ? { "X-TIMESTAMP": timestamp } : {}) };
  const candidates = [buildSignString(withTimestamp), buildSignString(parsed)];
  for (const candidate of candidates) {
    if (await verifyRSASignature(candidate, signature, publicKeyPem)) return true;
  }
  return false;
}

export function gatewayHeaders(
  cfg: PaymentGatewayConfig,
  timestamp: string,
  signature: string,
): Record<string, string> {
  return {
    "X-MERCHANT-ID": cfg.merchantId,
    "X-SITE-DOMAIN": cfg.siteDomain,
    "X-TIMESTAMP": timestamp,
    "X-ADDON-PLATFORM": "Lovable",
    "X-ADDON-VERSION": "V1",
    "X-SIGNATURE": signature,
  };
}

/** Documented statuses: pending, unpaid (3DS in progress), paid, failed, canceled. */
export function mapGatewayStatus(status: string | undefined): "paid" | "cancelled" | "pending" {
  switch ((status ?? "").toLowerCase()) {
    case "paid":
    case "success":
      return "paid";
    case "failed":
    case "canceled":
    case "cancelled":
      return "cancelled";
    case "unpaid":
    case "pending":
    default:
      return "pending";
  }
}

/** EUR/USD/GBP report amounts in minor units; JPY in major units. */
export function amountMatches(
  totalMajor: number,
  currency: string,
  amountValue: unknown,
): boolean {
  if (amountValue === null || amountValue === undefined || amountValue === "") return true;
  const reported = Number(amountValue);
  if (!Number.isFinite(reported)) return true;
  const exponent = currency.toUpperCase() === "JPY" ? 0 : 2;
  const expected = exponent === 0 ? Math.round(totalMajor) : Math.round(totalMajor * 100);
  return Math.abs(expected - Math.round(reported)) < 1;
}

