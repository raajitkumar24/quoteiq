# Contributing to QuoteIQ

Thank you for improving QuoteIQ. The project is deliberately structured so
contributors can extend document understanding, procurement ontologies,
decision policies and evaluation coverage independently.

## Development workflow

1. Fork the repository and create a focused branch.
2. Copy `.env.example` to `.env.local`. Keep `QUOTEIQ_MODE=demo` unless
   you are explicitly testing provider integrations.
3. Run `npm ci`, `npm run dev` and `npm test`.
4. Add tests for every change to normalization, readiness, resolution or award
   logic.
5. Open a pull request that explains the user problem, decision boundary and
   evaluation evidence.

## Design principles

- Missing is not zero; ambiguous is not assumed.
- Preserve evidence beside interpretation.
- Use AI for semantic ambiguity and deterministic code for arithmetic.
- Route decision-changing uncertainty to a human.
- Never learn silently from a single user correction.
- Keep provider-specific code behind adapters.

## Pull-request checklist

- [ ] Demo mode works without API keys.
- [ ] No credentials, supplier-confidential data or customer data are committed.
- [ ] New AI behavior includes a prompt change and an evaluation case.
- [ ] New decisions include provenance, assumptions and an audit event.
- [ ] `npm test` passes.

## Reporting security issues

Please follow [SECURITY.md](SECURITY.md) rather than opening a public issue.
