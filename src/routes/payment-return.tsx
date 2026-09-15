import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Clock, X } from "lucide-react";
import { getOrder } from "@/lib/checkout.functions";
import { formatEur } from "@/lib/prices";

export const Route = createFileRoute("/payment-return")({
  head: () => ({
    meta: [
      { title: "Payment result — Vapofolio" },
      { name: "description", content: "Vapofolio order payment result and confirmation." },
      { property: "og:title", content: "Payment result — Vapofolio" },
      { property: "og:description", content: "Your Vapofolio order payment result." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentReturn,
});

type Order = Awaited<ReturnType<typeof getOrder>>;

function PaymentReturn() {
  const fetchOrder = useServerFn(getOrder);
  const [status, setStatus] = useState("pending");
  const [order, setOrder] = useState<Order>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get("order") ?? "";
    const lookupToken = params.get("token") ?? "";
    setStatus(params.get("status") ?? "pending");
    if (!orderNumber || !lookupToken) {
      setLoading(false);
      return;
    }
    fetchOrder({ data: { orderNumber, lookupToken } })
      .then((row) => setOrder(row))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [fetchOrder]);

  const effective = order?.status === "paid" ? "success" : order?.status === "cancelled" ? "failed" : status;

  const meta =
    effective === "success"
      ? { icon: Check, title: "Payment received", tone: "bg-lemon text-ink" }
      : effective === "failed"
        ? { icon: X, title: "Payment failed", tone: "bg-[#f3d9d7] text-[#c2453f]" }
        : { icon: Clock, title: "Payment processing", tone: "bg-paper text-ink" };
  const Icon = meta.icon;

  return (
    <main className="mx-auto min-h-screen max-w-[560px] px-4 pt-16 font-body text-ink">
      <div className="rounded-[28px] bg-card p-8 text-center md:p-10">
        <span className={`mx-auto grid size-20 place-items-center rounded-full ${meta.tone}`}>
          <Icon className="size-9" strokeWidth={3} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">{meta.title}</h1>

        {loading ? (
          <p className="mt-3 text-sm font-semibold text-mute">Checking your order…</p>
        ) : order ? (
          <div className="mt-4 rounded-2xl bg-paper px-4 py-4 text-left text-[13px] font-semibold text-mute">
            <p>
              Order <span className="font-extrabold text-ink">#{order.order_number}</span>
            </p>
            <p className="mt-1">
              Total <span className="font-extrabold text-ink">{formatEur(Number(order.total))}</span>
            </p>
            <p className="mt-1">
              Confirmation sent to <span className="font-extrabold text-ink">{order.customer_email}</span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm font-semibold text-mute">
            We could not find this order. Contact support@vapofolio.com if you were charged.
          </p>
        )}

        {effective === "pending" && !loading && (
          <p className="mt-4 text-[13px] font-semibold text-mute">
            The bank is still confirming this payment. Refresh in a moment.
          </p>
        )}

        <Link
          to="/"
          className="grad-cta mt-7 inline-block rounded-full px-7 py-4 text-[15px] font-bold text-white transition hover:brightness-105 active:scale-[0.98]"
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}
