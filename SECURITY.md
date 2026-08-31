# Security policy

QuoteIQ is a reference implementation, not a certified procurement system.
Do not use it for production awards without completing your own security,
privacy, legal, model-risk and procurement-control reviews.

## Secrets

- Keep provider keys in server-side environment variables.
- Never expose keys through `NEXT_PUBLIC_*` variables.
- Never commit real quotations or supplier-confidential information.
- Rotate any credential that is accidentally committed.

## Data controls expected in production

- Tenant isolation and role-based access control.
- Encryption in transit and at rest.
- Malware scanning and file-type validation.
- Configurable retention and deletion.
- Immutable audit events for material changes.
- Model-provider data-processing agreements and regional controls.
- Prompt-injection isolation between source documents and system instructions.

To report a vulnerability, contact the repository owner privately through
GitHub. Include reproduction steps, affected version and impact. Please do not
open a public issue containing an exploit or sensitive data.
