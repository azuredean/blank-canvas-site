/** Shared handling for gateway callbacks (async notification + 3DS browser return). */
import {
  amountMatches,
  buildCallbackSignString,
  getPaymentConfig,
  mapGatewayStatus,
  verifyRSASignature,
} from "./cartadicreditopay.server";

export interface CallbackOutcome {
  orderNumber: string | null;
  lookupToken: string | null;
  /** Order state after processing this callback. */
  status: "paid" | "cancelled" | "pending";
  verified: boolean;
}

export async function readCallbackPayload(request: Request): Promise<Record<string, unknown>> {
  if (request.method !== "POST") {
    return Object.fromEntries(new URL(request.url).searchParams.entries());
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>;
  }
  const text = await request.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return Object.fromEntries(new URLSearchParams(text).entries());
  }
}

export async function processCallback(
  payload: Record<string, unknown>,
): Promise<CallbackOutcome> {
  const cfg = getPaymentConfig();
  const signature = (payload["sign_verify"] ?? payload["sign"]) as string | undefined;
  const verified =
    !!signature &&
    !!cfg.publicKey &&
    (await verifyRSASignature(buildCallbackSignString(payload), signature, cfg.publicKey));

  const inner = (payload["data"] as Record<string, unknown> | undefined) ?? {};
  const pick = (key: string) => payload[key] ?? inner[key];
  const orderNumber =
    ((pick("merchant_reference") ?? pick("order_id")) as string | undefined) ?? null;
  const gatewayStatus = pick("status") as string | undefined;
  const paymentId = pick("id") as string | undefined;
  const requestId = pick("request_id") as string | undefined;
  const amountValue = pick("amount_value");

  if (!orderNumber) return { orderNumber: null, lookupToken: null, status: "pending", verified };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("status, lookup_token, total, currency")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!order) return { orderNumber, lookupToken: null, status: "pending", verified };

  const current = order.status as "paid" | "cancelled" | "pending";
  const lookupToken = order.lookup_token;

  // Terminal orders never move again; unverified callbacks never move anything.
  if (current === "paid" || current === "cancelled") {
    return { orderNumber, lookupToken, status: current, verified };
  }
  if (!verified) {
    console.error("cartadicreditopay callback signature invalid — order left pending");
    return { orderNumber, lookupToken, status: "pending", verified: false };
  }

  const mapped = mapGatewayStatus(gatewayStatus);
  if (mapped === "paid" && !amountMatches(Number(order.total), order.currency, amountValue)) {
    console.error("cartadicreditopay callback amount mismatch — refusing to mark paid", orderNumber);
    return { orderNumber, lookupToken, status: "pending", verified: true };
  }

  if (mapped !== "pending") {
    await supabaseAdmin
      .from("orders")
      .update({
        status: mapped,
        gateway_status: gatewayStatus ?? null,
        ...(paymentId ? { payment_id: paymentId } : {}),
        ...(requestId ? { request_id: requestId } : {}),
        gateway_payload: payload as never,
      })
      .eq("order_number", orderNumber);
  }

  return { orderNumber, lookupToken, status: mapped, verified: true };
}
