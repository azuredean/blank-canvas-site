import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  id: z.string().min(1).max(80),
  option: z.string().min(1).max(120),
  qty: z.number().int().min(1).max(99),
});

const customerSchema = z.object({
  email: z.string().email().max(160),
  name: z.string().min(2).max(120),
  address: z.string().min(4).max(200),
  city: z.string().min(1).max(100),
  postal: z.string().min(1).max(30),
  country: z.string().min(2).max(80),
  phone: z.string().max(40).optional(),
});

const createOrderSchema = z.object({
  items: z.array(itemSchema).min(1).max(50),
  customer: customerSchema,
});

/** Creates a pending order with server-recomputed totals. */
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { PRODUCT_PRICES, SHIPPING_COST, CURRENCY } = await import("./prices.server");
    const { toCountryCode } = await import("./countries");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const countryCode = toCountryCode(data.customer.country);
    if (!countryCode) throw new Error("Unsupported delivery country");

    let subtotal = 0;
    const items = data.items.map((item) => {
      const unit = PRODUCT_PRICES[item.id];
      if (unit === undefined) throw new Error(`Unknown product: ${item.id}`);
      subtotal += unit * item.qty;
      return { ...item, unit_price: unit };
    });

    const total = subtotal + SHIPPING_COST;
    const orderNumber = `VF${Date.now().toString().slice(-9)}${Math.floor(Math.random() * 900 + 100)}`;
    const lookupToken = crypto.randomUUID();

    const { error } = await supabaseAdmin.from("orders").insert({
      order_number: orderNumber,
      lookup_token: lookupToken,
      status: "pending",
      currency: CURRENCY,
      subtotal,
      shipping: SHIPPING_COST,
      total,
      items,
      customer_email: data.customer.email,
      customer_name: data.customer.name,
      address: data.customer.address,
      city: data.customer.city,
      postal_code: data.customer.postal,
      country: countryCode,
      phone: data.customer.phone ?? null,
    });
    if (error) throw new Error(error.message);

    return { orderNumber, lookupToken, total, currency: CURRENCY, items };
  });

/** Fetches a 24h iframe token for the hosted card element. */
export const getIframeToken = createServerFn({ method: "POST" }).handler(async () => {
  const { getPaymentConfig, signWithRSA, gatewayHeaders } = await import("./cartadicreditopay.server");
  const cfg = getPaymentConfig();
  const timestamp = Date.now().toString();
  const signature = await signWithRSA(
    `merchant_id=${cfg.merchantId}&site_domain=${cfg.siteDomain}&timestamp=${timestamp}`,
    cfg.privateKey,
  );

  const res = await fetch(`${cfg.apiBase}/v3/merchants/token`, {
    method: "GET",
    headers: gatewayHeaders(cfg, timestamp, signature),
  });
  const bodyText = await res.text();
  let result: {
    success?: boolean;
    code?: string;
    message?: string;
    data?: { token?: string };
  } = {};
  try {
    result = JSON.parse(bodyText);
  } catch {
    /* handled below */
  }

  if (result.success && result.code === "0000" && result.data?.token) {
    return {
      success: true as const,
      token: result.data.token,
      sdkUrl: cfg.sdkUrl,
      shieldUrl: cfg.shieldUrl,
    };
  }
  console.error("cartadicreditopay token failed", res.status, bodyText.slice(0, 500));
  return { success: false as const, error: "Payment form unavailable, please retry." };
});

const processSchema = z.object({
  orderNumber: z.string().min(3).max(40),
  lookupToken: z.string().min(10).max(80),
  cardToken: z.string().min(4).max(400),
  sessionId: z.string().min(4).max(200),
  userAgent: z.string().min(1).max(400),
});

/** Charges the card token against the order total and records the gateway result. */
export const processPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => processSchema.parse(data))
  .handler(async ({ data }) => {
    const {
      getPaymentConfig,
      signWithRSA,
      buildSignString,
      gatewayHeaders,
      mapGatewayStatus,
      verifyResponseSignature,
    } = await import("./cartadicreditopay.server");
    const { toCountryCode } = await import("./countries");
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const cfg = getPaymentConfig();

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", data.orderNumber)
      .eq("lookup_token", data.lookupToken)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");

    const countryCode = toCountryCode(order.country);
    if (!countryCode) {
      return { success: false as const, error: "Unsupported delivery country." };
    }

    const clientIp =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-real-ip") ??
      (getRequestHeader("x-forwarded-for") ?? "").split(",")[0]?.trim() ??
      "";
    if (!clientIp) {
      console.error("cartadicreditopay: missing client IP for order", order.order_number);
    }

    const [firstName, ...rest] = order.customer_name.trim().split(/\s+/);
    const lastName = rest.join(" ") || firstName || "";
    const details = {
      first_name: firstName ?? "",
      last_name: lastName,
      email: order.customer_email,
      address: order.address,
      city: order.city,
      state: order.city,
      country: countryCode,
      postal_code: order.postal_code?.trim() || "000000",
      phone: order.phone ?? "",
    };

    const orderItems = (order.items ?? []) as {
      id: string;
      option: string;
      qty: number;
      unit_price: number;
    }[];

    const paymentBody: Record<string, unknown> = {
      model: "EMBED",
      amount: Number(order.total).toFixed(2),
      currency: order.currency,
      merchant_reference: order.order_number,
      customer_email: order.customer_email,
      payment_method: "card",
      payment_information: { card_token: data.cardToken },
      products: orderItems.map((item) => ({
        sku: `${item.id}|${item.option}`,
        name: item.id,
        price: item.unit_price.toFixed(2),
        quantity: String(item.qty),
        currency: order.currency,
      })),
      billing_details: details,
      shipping_details: details,
      ip: clientIp,
      user_agent: data.userAgent,
      sid: data.sessionId,
      redirect_url: `${cfg.frontendUrl}/api/public/payment-return`,
    };

    const signData = buildSignString(paymentBody);
    const timestamp = Date.now().toString();
    const signature = await signWithRSA(signData, cfg.privateKey);

    const res = await fetch(`${cfg.apiBase}/v3/merchants/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...gatewayHeaders(cfg, timestamp, signature),
      },
      body: signData,
    });
    const bodyText = await res.text();

    if (cfg.publicKey) {
      const ok = await verifyResponseSignature(
        bodyText,
        res.headers.get("X-TIMESTAMP"),
        res.headers.get("X-SIGNATURE"),
        cfg.publicKey,
      );
      if (!ok) console.error("cartadicreditopay: payment response signature not verified");
    }

    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(bodyText) as Record<string, unknown>;
    } catch {
      console.error("cartadicreditopay payment response unparsable");
      return { success: false as const, error: "Payment failed, please try again." };
    }

    const success = raw["success"] === true && raw["code"] === "0000";
    if (!success) {
      console.error("cartadicreditopay payment failed", raw["code"], raw["message"]);
      return {
        success: false as const,
        error: typeof raw["message"] === "string" ? raw["message"] : "Payment declined",
      };
    }

    const outer = (raw["data"] ?? raw) as Record<string, unknown>;
    const payload = ((outer["data"] as Record<string, unknown>) ?? outer) as Record<string, unknown>;
    const gatewayStatus = typeof payload["status"] === "string" ? payload["status"] : undefined;
    const paymentId = typeof payload["id"] === "string" ? payload["id"] : null;
    const requestId = typeof payload["request_id"] === "string" ? payload["request_id"] : null;
    const redirectUrl =
      typeof payload["redirect_url"] === "string" ? payload["redirect_url"] : null;
    const mapped = mapGatewayStatus(gatewayStatus);

    await supabaseAdmin
      .from("orders")
      .update({
        payment_id: paymentId,
        request_id: requestId,
        gateway_status: gatewayStatus ?? null,
        status: mapped === "paid" ? "paid" : order.status === "paid" ? "paid" : mapped,
      })
      .eq("order_number", order.order_number);

    return {
      success: true as const,
      status: mapped,
      paymentId,
      redirectUrl,
    };
  });


const lookupSchema = z.object({
  orderNumber: z.string().min(3).max(40),
  lookupToken: z.string().min(10).max(80),
});

/** Guest-safe order read: requires the order number plus its lookup token. */
export const getOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => lookupSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("order_number, status, currency, total, items, customer_email, created_at")
      .eq("order_number", data.orderNumber)
      .eq("lookup_token", data.lookupToken)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return order ?? null;
  });
