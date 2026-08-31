# Evaluation strategy

## Evaluation hierarchy

1. Evidence extraction correctness.
2. Semantic interpretation and conditions.
3. RFQ-line alignment.
4. Unit, currency, pack, tax and freight normalization.
5. Apples-to-apples comparison.
6. Feasible shortlist and award decision.
7. Critical escalation recall.

## Golden case

Preserve the RFQ, original supplier artifacts, as-of-time policy/context,
expected claims, source locators, valid mappings, accepted normalization,
required escalations and feasible scenarios. The historical award is a reference,
not automatically the correct label.

## Closed-loop release gate

```text
human correction
→ failure taxonomy
→ new golden case
→ targeted prompt/rule/model change
→ historical regression replay
→ shadow evaluation
→ narrow release
→ post-release monitoring
```

North star: **decision-ready RFQs per buyer-hour**.

Guardrails include decision-impacting errors per RFQ, critical escalation
recall, provenance completeness, calculation reproducibility, recommendation
override rate and autonomous actions reversed.
