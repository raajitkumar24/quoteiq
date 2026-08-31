# Architecture

## Design objective

QuoteIQ separates semantic interpretation from commercial computation and
organizational decision state. A model output is never itself the source of
truth.

## Runtime layers

1. **Artifact layer** preserves the original submission, MIME type, supplier,
   version and source identity.
2. **Claim layer** stores what the supplier said, the interpretation, source
   locator, conditions and separate confidence dimensions.
3. **Compilation layer** maps claims to RFQ lines and converts them to typed
   commercial values.
4. **Validation layer** reconciles totals, detects missing or contradictory
   terms and calculates decision impact.
5. **Trust layer** routes safe facts or human-review exceptions into a versioned
   Bid Ledger.
6. **Application layer** provides comparison, verified questions and award
   scenarios over a fixed ledger snapshot.
7. **Learning layer** converts corrections into evaluation cases and controlled
   releases.

## Key invariants

- Raw evidence is immutable.
- Every canonical fact refers to evidence.
- Missing values remain unknown.
- Arithmetic is deterministic.
- Material assumptions create human audit events.
- Questions run against a ledger version, not an unbounded raw-document context.
- Award scenarios contain only eligible suppliers with calculable landed cost.

## Provider boundary

`lib/quoteiq/providers.ts` is the only module that calls external model APIs.
Domain and policy modules contain no provider logic. This keeps model migration,
cost routing and data-residency changes isolated.

## Persistence

The reference implementation passes ledger state in API requests and keeps the
interactive demo in client state. A production implementation should persist
immutable artifacts, append-only claim/audit events, versioned ledger snapshots,
review tasks, approvals, evaluation cases and model-release metadata.
