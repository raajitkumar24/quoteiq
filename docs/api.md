# API reference

All endpoints accept and return JSON. Demo mode requires no credentials.

## `GET /api/health`

Returns runtime mode, model identifiers and deterministic services.

## `GET /api/analytics`

Returns the governed buyer-outcome and product/AI analytics snapshot used by
the Analytics workspace. Optional query parameters are `period` (`30d`, `90d`,
`180d`), `category` (`all`, `Packaging`, `MRO`, `IT hardware`, `Freight`),
`businessUnit`, `region` and `status`. Unsupported values return HTTP 400.

```bash
curl "http://localhost:3000/api/analytics?period=90d&category=Packaging&businessUnit=Consumer&region=Pune&status=Decision-ready"
```

## `GET /api/analytics/export`

Accepts the same analytics scope parameters and returns a governed CSV with the
snapshot timestamp, visible cohort, synthetic-data classification, KPI values
and metric definitions. The Analytics workspace links directly to this route.

## `POST /api/compile`

Required body fields: `rfqId`, `rfqLines[]`, `vendors[]` and
`artifacts[]`. Artifacts contain text or base64 data plus a MIME type.

Demo mode returns the sample ledger. Live mode invokes multimodal extraction,
validates structured output and constructs a versioned ledger.

## `POST /api/review`

Applies `approved_benchmark` or `exclude` to a ledger. Returns a new ledger
version and recalculated readiness.

## `POST /api/scenarios`

Accepts a ledger and `AwardConstraints`. Only suppliers with calculable landed
cost and valid eligibility can receive an allocation.

## `POST /api/ask`

Accepts `question`, `ledger` and optional `verifiedOnly`. The endpoint
checks readiness before planning or answering and returns an Answer Packet.

Production services should add request IDs, idempotency, typed errors, timeouts,
retry policy and observability.
