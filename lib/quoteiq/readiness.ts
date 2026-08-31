import type { BidLedger, DecisionReadiness, ReviewIssue } from "./types";
import { landedCost, quotedTotal } from "./normalization";

export function evaluateDecisionReadiness(
  ledger: BidLedger,
): DecisionReadiness {
  const expected = ledger.rfqLines.length * ledger.bids.length;
  const present = ledger.bids.reduce(
    (sum, bid) =>
      sum + bid.offers.filter((offer) => offer.lineTotal != null).length,
    0,
  );
  const verifiedClaims = ledger.claims.filter((claim) =>
    ["validated", "system_verified", "human_verified"].includes(claim.status),
  ).length;
  const issues: ReviewIssue[] = [];

  for (const bid of ledger.bids) {
    if (bid.excludedFromRanking) continue;
    if (bid.freight.type === "excluded_unknown") {
      const total = quotedTotal(bid, ledger);
      const comparable = ledger.bids
        .map((candidate) => landedCost(candidate, ledger))
        .filter((value): value is number => value != null)
        .sort((a, b) => a - b);
      const couldWin = comparable.length === 0 || total < comparable[0];
      issues.push({
        id: `freight-${bid.vendorId}`,
        vendorId: bid.vendorId,
        title: `${bid.vendorName} freight amount is missing`,
        description:
          "The quote states freight is extra but does not provide an amount.",
        severity: couldWin ? "blocking" : "high",
        decisionImpact: {
          affectedSpend: total,
          rankingRange: [1, Math.min(3, ledger.bids.length)],
          canChangeWinner: couldWin,
        },
        resolutionOptions: [
          {
            id: "approved_benchmark",
            label: "Apply approved lane benchmark",
            consequence: "Creates a visible provisional landed cost.",
          },
          {
            id: "exclude",
            label: "Exclude from landed-cost ranking",
            consequence: "Preserves missing-as-unknown; reduces competition.",
          },
          {
            id: "clarify",
            label: "Request vendor clarification",
            consequence: "Highest certainty; adds cycle time.",
          },
        ],
      });
    }
  }

  const technicalPasses = ledger.bids.filter(
    (bid) => bid.technicalCompliance,
  ).length;

  return {
    ready: !issues.some((issue) => issue.severity === "blocking"),
    coverage: expected ? present / expected : 0,
    commercialVerification: ledger.claims.length
      ? verifiedClaims / ledger.claims.length
      : 0,
    technicalCompliance: ledger.bids.length
      ? technicalPasses / ledger.bids.length
      : 0,
    criticalIssueCount: issues.filter((issue) => issue.severity === "blocking")
      .length,
    unresolvedAssumptionCount: issues.length,
    issues,
  };
}
