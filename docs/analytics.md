# Analytics

QuoteIQ Analytics measures whether the product produces more decision-ready procurement work, with less buyer effort, while preserving evidence quality and human control. The dashboard is organized around two personas that share the same filter scope and governed event model.

## Dashboard structure

### Buyer outcomes

The buyer view answers four operating questions:

1. **Throughput:** How many RFQs move from created to compiled, decision-ready and approved?
2. **Commercial impact:** How much verified spend and policy-defined savings are represented?
3. **Velocity:** Where does active cycle time accumulate, and how does it compare with the validated manual baseline?
4. **Trust friction:** Why do buyers intervene, and which supplier-response patterns merit sourcing attention?

It includes:

- decision-ready RFQs, verified spend, identified savings and buyer hours saved;
- weekly decision-readiness and cycle-time trend;
- RFQ outcome funnel;
- savings by category;
- stage-level cycle time versus manual baseline;
- intervention issue mix; and
- supplier competitiveness and response-quality context.

Supplier metrics must not be treated as an autonomous supplier score. They are descriptive signals for a human-led sourcing decision.

### Product & AI operations

The product view treats quality as a decision chain rather than one blended model score. It includes:

- provenance coverage;
- decision-impact error rate;
- critical escalation recall;
- cost per decision-ready RFQ;
- P95 end-to-end processing time;
- extraction, line-mapping, escalation and provenance trends;
- pipeline latency by stage;
- human-intervention root causes;
- earned autonomy by narrow task;
- protected evaluation gates; and
- model/tool volume, cost, success and fallback rates.

It also includes weekly active buyers, eight-week retention and adoption of
trust-building workflows such as evidence inspection, Ask, scenario generation
and review resolution. Product behavior sits beside quality and safety so
increased usage cannot hide a degraded decision chain.

The combination of quality, safety, latency and cost makes regressions diagnosable. For example, higher review volume caused by missing buyer context should not be attributed to the extraction model.

## Global filters

| Filter | Purpose | Example values |
| --- | --- | --- |
| Period | Select the reporting window | Last 30 days, last 90 days, last 6 months |
| Category | Compare procurement domains with different document and policy patterns | Packaging, MRO, IT hardware, Freight |
| Business unit | Attribute adoption and value to the operating organization | Consumer, Industrial, Corporate services |
| Plant / region | Isolate local demand, supplier and policy effects | Pune, Ahmedabad, Chennai, NCR |
| RFQ status | Focus the analysis on a workflow cohort | Compiling, Needs review, Decision-ready, Award approved |

All tiles and charts inherit the same visible filter scope. Reset returns the dashboard to the 90-day, all-category, all-unit, all-plant and all-status cohort.

The filters are operational rather than decorative: they recalculate the
selected cohort, summary metrics and applicable charts. Product quality metrics
respond to period and category. **Export CSV** downloads the selected buyer and
product KPI cohort together with its visible scope and metric definitions.

## Metric dictionary

| Metric | Definition | Guardrail |
| --- | --- | --- |
| Decision-ready RFQs per buyer-hour | RFQs safe for the scoped decision divided by active buyer review hours | Numerator requires complete material provenance and zero unresolved critical issues |
| Decision-ready RFQs | Distinct RFQs that pass the decision-readiness policy in the selected period | Count the ledger version that first passes; do not count subsequent versions again |
| Verified spend | Addressable spend represented by verified and comparable commercial facts | Exclude unresolved or ineligible quote lines |
| Identified savings | Approved scenario value versus the policy-defined qualified baseline | Never compare against an unqualified supplier or fabricated benchmark |
| Buyer hours saved | Validated manual benchmark minus measured active buyer time | Re-baseline when the manual process or workflow changes materially |
| Provenance coverage | Material ledger facts with inspectable source evidence divided by all material facts | Weighting and materiality rules are versioned |
| Decision-impact error | Audited errors capable of changing rank, eligibility, landed cost or allocation divided by decision-ready RFQs | A release-blocking metric; do not dilute with harmless formatting errors |
| Critical escalation recall | Known decision-critical uncertainty correctly sent to review divided by all such evaluation cases | Hard gate for autonomy changes |
| Cost per decision-ready RFQ | Model and deterministic processing cost divided by decision-ready RFQs | Allocate retries and fallback cost to the originating task |
| P95 processing time | 95th percentile artifact-to-ledger time, excluding human review | Report stage-level latency alongside the total |

## Data lineage

Analytics are derived from RFQ lifecycle events, the versioned Bid Ledger, Evidence and Answer Packets, human review events, evaluation results, and model/tool traces. Every snapshot records its `asOf` timestamp, period and category scope. Production implementations should also persist the metric-definition version and cohort query hash.

The prototype uses clearly labeled synthetic demonstration data. The reference endpoint exposes the same shape used by the interface:

```http
GET /api/analytics?period=90d&category=Packaging&businessUnit=Consumer&region=Pune&status=Decision-ready
```

Supported periods are `30d`, `90d` and `180d`. Supported categories are `all`,
`Packaging`, `MRO`, `IT hardware` and `Freight`. The API also accepts the same
business-unit, region and RFQ-status values shown in the interface.

## Interpretation rules

- Read commercial impact beside coverage and qualification, not in isolation.
- Use intervention causes to route improvements to extraction, matching, policy or missing-context work.
- Change autonomy only for a narrow task after its quality gate, sample-size requirement and policy permission all pass.
- Keep critical escalation recall and decision-impact error visible when throughput rises.
- Treat period-over-period changes as directional until cohort composition and workflow changes have been checked.
