# Examples

`requests/compile.json` contains a synthetic RFQ and three differently shaped
supplier responses. It is safe to commit and use in demos.

Start QuoteIQ in demo mode, then run:

```bash
curl -X POST http://localhost:3000/api/compile \
  -H "content-type: application/json" \
  --data @examples/requests/compile.json
```

Use the returned ledger as the input to `/api/review`, `/api/scenarios` or
`/api/ask`. Keeping the ledger explicit makes every calculation reproducible
and avoids hidden server session state in the reference implementation.
