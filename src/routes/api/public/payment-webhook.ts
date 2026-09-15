import { createFileRoute } from "@tanstack/react-router";

const OK = () =>
  new Response("[success]", { status: 200, headers: { "Content-Type": "text/plain" } });

export const Route = createFileRoute("/api/public/payment-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { readCallbackPayload, processCallback } = await import(
            "@/lib/payment-callback.server"
          );
          const payload = await readCallbackPayload(request);
          await processCallback(payload);
        } catch (err) {
          console.error("cartadicreditopay webhook error", err);
        }
        // The gateway retries forever unless it always gets 200 + [success].
        return OK();
      },
    },
  },
});
