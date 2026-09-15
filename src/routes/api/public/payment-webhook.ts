import { createFileRoute } from "@tanstack/react-router";

const OK = () =>
  new Response("[success]", { status: 200, headers: { "Content-Type": "text/plain" } });

export const Route = createFileRoute("/api/public/payment-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { getPaymentConfig, verifyRSASignature, buildCallbackSignString, mapGatewayStatus } =
            await import("@/lib/cartadicreditopay.server");
          const cfg = getPaymentConfig();

          const body = (await request.json()) as Record<string, unknown>;
          const signature = (body["sign_verify"] ?? body["sign"]) as string | undefined;
          const verified =
            !!signature &&
            !!cfg.publicKey &&
            (await verifyRSASignature(buildCallbackSignString(body), signature, cfg.publicKey));

          if (!verified) {
            console.error("cartadicreditopay webhook signature invalid — refusing to update order");
            return OK();
          }

          const inner = (body["data"] as Record<string, unknown> | undefined) ?? {};
          const pick = (key: string) => body[key] ?? inner[key];
          const orderNumber = (pick("merchant_reference") ?? pick("order_id")) as
            | string
            | undefined;
          const gatewayStatus = pick("status") as string | undefined;
          const paymentId = pick("id") as string | undefined;
          if (!orderNumber) return OK();

          const mapped = mapGatewayStatus(gatewayStatus);
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("status")
            .eq("order_number", orderNumber)
            .maybeSingle();
          if (!order) return OK();

          const terminal = order.status === "paid" || order.status === "cancelled";
          if (terminal && mapped === "pending") return OK();

          await supabaseAdmin
            .from("orders")
            .update({
              status: mapped,
              gateway_status: gatewayStatus ?? null,
              ...(paymentId ? { payment_id: paymentId } : {}),
              gateway_payload: body as never,
            })
            .eq("order_number", orderNumber);

          return OK();
        } catch (err) {
          console.error("cartadicreditopay webhook error", err);
          return OK();
        }
      },
    },
  },
});
