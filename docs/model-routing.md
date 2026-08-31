# Model routing

## Principle

Use AI where meaning is fuzzy. Use deterministic software where rules are
knowable.

## Routes

- **Gemini 2.5 Pro:** multimodal commercial-claim extraction from PDFs, tables,
  scans and photographs. JSON output, temperature zero.
- **text-embedding-3-large:** retrieves likely RFQ candidates. Similarity never
  finalizes a match.
- **GPT-5.4:** ambiguous mapping, query planning and grounded explanations. It
  is not used for arithmetic.
- **Deterministic services:** currency, UOM, discounts, totals, landed cost,
  eligibility and decision-readiness.
- **Award optimizer:** the included TypeScript engine provides deterministic
  reference scenarios behind an OR-Tools-compatible boundary.

## Demo versus live mode

- `QUOTEIQ_MODE=demo`: no external requests; deterministic sample ledger.
- `QUOTEIQ_MODE=live`: Gemini and OpenAI calls use server-side keys.

Model IDs are configurable. Changes should pass task-level evaluation gates
before release.
