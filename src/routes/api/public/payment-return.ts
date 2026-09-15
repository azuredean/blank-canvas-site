import { createFileRoute } from "@tanstack/react-router";

async function handle(request: Request): Promise<Response> {
  const { getPaymentConfig, verifyRSASignature, buildCallbackSignString, mapGatewayStatus } =
    await import("@/lib/cartadicreditopay.server");
  const cfg = getPaymentConfig();

  const url = new URL(request.url);
  let payload: Record<string, unknown> = {};
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      payload = (await request.json()) as Record<string, unknown>;
    } else {
      payload = Object.fromEntries((await request.formData()).entries()) as Record<string, unknown>;
    }
  } else {
    payload = Object.fromEntries(url.searchParams.entries());
  }

  const signature = (payload["sign_verify"] ?? payload["sign"]) as string | undefined;
  const verified =
    !!signature &&
    !!cfg.publicKey &&
    (await verifyRSASignature(buildCallbackSignString(payload), signature, cfg.publicKey));

  const inner = (payload["data"] as Record<string, unknown> | undefined) ?? {};
  const pick = (key: string) => payload[key] ?? inner[key];
  const orderNumber = (pick("merchant_reference") ?? pick("order_id")) as string | undefined;

  const redirect = (status: string, token?: string) =>
    new Response(null, {
      status: 302,
      headers: {
        Location: `${cfg.frontendUrl}/payment-return?order=${encodeURIComponent(
          orderNumber ?? "",
        )}&token=${encodeURIComponent(token ?? "")}&status=${status}`,
      },
    });

  if (!orderNumber) return redirect("pending");

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("status, lookup_token")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!order) return redirect("pending");

  if (order.status === "paid") return redirect("success", order.lookup_token);
  if (order.status === "cancelled") return redirect("failed", order.lookup_token);

  if (!verified) {
    console.error("cartadicreditopay return signature invalid — leaving order pending");
    return redirect("pending", order.lookup_token);
  }

  const gatewayStatus = pick("status") as string | undefined;
  const mapped = mapGatewayStatus(gatewayStatus);
  if (mapped !== "pending") {
    await supabaseAdmin
      .from("orders")
      .update({ status: mapped, gateway_status: gatewayStatus ?? null })
      .eq("order_number", orderNumber);
  }

  return redirect(
    mapped === "paid" ? "success" : mapped === "cancelled" ? "failed" : "pending",
    order.lookup_token,
  );
}

export const Route = createFileRoute("/api/public/payment-return")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});
