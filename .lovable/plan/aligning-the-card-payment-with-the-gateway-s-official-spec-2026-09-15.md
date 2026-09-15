# Aligning the card payment with the gateway's official spec

I compared the two documents with what is live on the site. The environment settings (production gateway, card form script, device script, merchant number, bound domain) already match the production requirements. But there are a few mismatches with the official interface spec that can cause declines or orders that never flip to "paid".

## What must change

1. **Country must be sent as a 2-letter code.** Checkout currently sends full country names ("Germany"). The spec requires ISO codes ("DE"). This alone can cause failed payments.
2. **The buyer's IP address is a required field and we don't send it.** It will be read on the server from the incoming request.
3. **The device session ID is required, not optional.** Today it is skipped if the device script hasn't loaded. It will be awaited/retried, and the payment blocked with a clear message if it is still missing.
4. **The status-notification address.** The spec sends the after-payment notification to the same "return address" submitted with the order (or the address bound in the merchant account) — it does not document a separate notification field. The single address below will handle both the shopper coming back from the bank (browser visit) and the gateway's status notification (server-to-server), always replying `[success]` to the latter.
5. **Amount check on notifications.** For EUR the gateway reports amounts in cents. The notification amount will be compared against the order total before marking it paid, so an order can never be settled for the wrong amount.
6. **Signature checks tightened to the documented rule** (drop `sign_verify`, sort keys, drop empty values, compact JSON, no number re-typing guesswork). The gateway also signs its payment response; that signature will be verified too.
7. **Status handling** extended for the documented set: `pending`, `unpaid` (3-D Secure in progress), `paid`, `failed`, `canceled`.
8. **Postal code fallback** `000000` when a region has none, and state falls back to city (both as the spec allows).

## Addresses to register in the merchant back office

Return address (also receives the payment-status notification):

```text
https://vapofolio.com/api/public/payment-return
```

Keep the existing webhook address registered as well if the gateway staff configured it for you:

```text
https://vapofolio.com/api/public/payment-webhook
```

Both stay live, both verify signatures, and both are safe to receive the same notification twice.

## Things only you or the gateway staff can do

- Confirm the platform (gateway) public key saved on our side is the **production** one from the document, and that our **production** public key is bound in the merchant back office.
- Confirm the gateway has signed off your sandbox testing before going live.
- Ask them for a production test card, then run one small real payment end-to-end including the bank verification step.
- The product prices on the site are still the placeholder values I set earlier — real prices are needed before taking real money.

## Technical notes

- `src/vapor/pages/CheckoutPage.tsx`: country select emits ISO-3166 alpha-2 values (label/value pairs), device `sid` acquisition awaited with retry and treated as required.
- `src/lib/checkout.functions.ts`: `processPayment` reads client IP from request headers (`getWebRequest` / `cf-connecting-ip`, `x-forwarded-for`), sends `ip`, required `sid`, `state` fallback, `postal_code` fallback `000000`, ISO country; verifies the response `X-SIGNATURE` over body + `X-TIMESTAMP`; stores gateway `request_id`.
- `src/lib/cartadicreditopay.server.ts`: remove numeric coercion from `buildCallbackSignString`; add `verifyResponseSignature(bodyText, timestamp, signature)`; extend `mapGatewayStatus` with `unpaid` → pending.
- `src/routes/api/public/payment-return.ts`: on POST behave as the async notification (verify signature, amount check in minor units, idempotent terminal-state guard, reply `200 [success]`); on GET keep the redirect to the result page.
- `src/routes/api/public/payment-webhook.ts`: share the same verification/amount/idempotency helper (extracted into `src/lib/payment-callback.server.ts`).
- Orders table: add `request_id` column via migration for traceability.
