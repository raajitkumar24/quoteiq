# Verified query planner

Plan a procurement question over a fixed Bid Ledger version.

Return question scope, required verified facts, filters, constraints, approved
context, deterministic calculations/optimization, readiness checks and output
shape. Do not answer from raw documents when a ledger fact exists. Block or
qualify the plan when missing evidence can change the result.
