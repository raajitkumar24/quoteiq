# Trust layer

## The trust contract

The system promises the buyer:

1. every material value can be inspected at its source;
2. every transformation can be reproduced;
3. missing evidence is not replaced silently;
4. uncertainty is prioritized by decision impact;
5. material assumptions require human approval;
6. a human decision persists across downstream workflows;
7. learning occurs through evaluated releases, not hidden adaptation.

## Fact lifecycle

```text
extracted → interpreted → validated → system/human verified → decision-used
```

These states are intentionally distinct. A model may read a number with high
confidence while the line mapping remains uncertain.

## Human intervention policy

Intervention is based on model confidence, decision impact, organizational
policy and reversibility. A low-confidence description on a low-spend line may
be review-later. A high-confidence missing freight term that changes the winner
is blocking.

## Human decision propagation

The `applyFreightResolution` function demonstrates a key enterprise invariant:
a buyer's benchmark or exclusion becomes ledger state, increments the ledger
version, writes an audit event and changes all downstream scenarios.

## Evidence packets

An Evidence Packet and Answer Packet contain ledger identity and version,
as-of time, source claims, policy/context, deterministic calculations, visible
assumptions, counterfactual boundary, execution trace and approval state.

The execution trace shows observable work and artifacts. It is not hidden model
chain-of-thought.
