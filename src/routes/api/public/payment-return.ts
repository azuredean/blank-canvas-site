import { createFileRoute } from "@tanstack/react-router";

const NOTIFY_OK = () =>
  new Response("[success]", { status: 200, headers: { "Content-Type": "text/plain" } });

/** POST on this address is the gateway's async status notification. */
async function handleNotify(request: Request): Promise<Response> {
  try {
    const { readCallbackPayload, processCallback } = await import("@/lib/payment-callback.server");
    const payload = await readCallbackPayload(request);
    await processCallback(payload);
  } catch (err) {
    console.error("cartadicreditopay notify error", err);
  }
  return NOTIFY_OK();
}

/** GET on this address is the shopper coming back from the bank's 3DS page. */
async function handleReturn(request: Request): Promise<Response> {
  const { getPaymentConfig } = await import("@/lib/cartadicreditopay.server");
  const { readCallbackPayload, processCallback } = await import("@/lib/payment-callback.server");
  const cfg = getPaymentConfig();

  let orderNumber: string | null = null;
  let lookupToken: string | null = null;
  let status: "paid" | "cancelled" | "pending" = "pending";
  try {
    const payload = await readCallbackPayload(request);
    const outcome = await processCallback(payload);
    orderNumber = outcome.orderNumber;
    lookupToken = outcome.lookupToken;
    status = outcome.status;
  } catch (err) {
    console.error("cartadicreditopay return error", err);
  }

  const label = status === "paid" ? "success" : status === "cancelled" ? "failed" : "pending";
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${cfg.frontendUrl}/payment-return?order=${encodeURIComponent(
        orderNumber ?? "",
      )}&token=${encodeURIComponent(lookupToken ?? "")}&status=${label}`,
    },
  });
}

export const Route = createFileRoute("/api/public/payment-return")({
  server: {
    handlers: {
      GET: async ({ request }) => handleReturn(request),
      POST: async ({ request }) => handleNotify(request),
    },
  },
});
