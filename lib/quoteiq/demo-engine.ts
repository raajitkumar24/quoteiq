import { generateAwardScenarios } from "./decision-engine";
import { landedCost } from "./normalization";
import { evaluateDecisionReadiness } from "./readiness";
import { sampleLedger } from "./sample-data";
import type { AnswerPacket, AskRequest, BidLedger } from "./types";

export function compileDemoLedger(): BidLedger {
  return structuredClone(sampleLedger);
}

export function askDemoComparison(request: AskRequest): AnswerPacket {
  const readiness = evaluateDecisionReadiness(request.ledger);
  const normalized = request.question.toLowerCase();
  const wantsSplit =
    normalized.includes("split") ||
    normalized.includes("60%") ||
    normalized.includes("divers");

  if (!readiness.ready && (wantsSplit || normalized.includes("cheapest"))) {
    return {
      id: "AP-DEMO-BLOCKED",
      question: request.question,
      answer:
        "A definitive result is not safe because PackRight freight is unresolved and can change the outcome.",
      ledgerId: request.ledger.id,
      ledgerVersion: request.ledger.version,
      asOf: request.ledger.asOf,
      scope: { verifiedOnly: request.verifiedOnly ?? true },
      evidenceClaimIds: readiness.issues.flatMap((issue) =>
        issue.vendorId === "packright" ? ["claim-packright-freight"] : [],
      ),
      context: [],
      calculations: [],
      assumptions: [],
      executionTrace: [
        { step: "Scope question", artifact: "RFQ-2027-014", status: "passed" },
        {
          step: "Check decision readiness",
          artifact: "PackRight freight missing",
          status: "blocked",
        },
      ],
      decisionBoundary:
        "Apply approved freight context, exclude PackRight, or obtain vendor evidence.",
      status: "blocked",
    };
  }

  const scenarios = generateAwardScenarios(request.ledger, {
    requireTechnicalCompliance: true,
    maxLeadTimeDays: 12,
    maxSupplierShare: wantsSplit ? 0.6 : undefined,
    minSuppliers: wantsSplit ? 2 : undefined,
  });
  const scenario = wantsSplit
    ? scenarios.find((item) => item.id === "balanced")
    : scenarios.find((item) => item.id === "lowest_cost");

  if (!scenario) {
    throw new Error("No feasible scenario was generated.");
  }
  const vendorNames = Object.fromEntries(
    request.ledger.bids.map((bid) => [bid.vendorId, bid.vendorName]),
  );
  const allocationText = scenario.allocations
    .map(
      (allocation) =>
        `${Math.round(allocation.share * 100)}% ${vendorNames[allocation.vendorId]}`,
    )
    .join(" / ");

  return {
    id: "AP-DEMO-DECISION",
    question: request.question,
    answer: `${allocationText} is the lowest-cost feasible result at ₹${scenario.totalCost.toLocaleString("en-IN")}.`,
    ledgerId: request.ledger.id,
    ledgerVersion: request.ledger.version,
    asOf: request.ledger.asOf,
    scope: { verifiedOnly: request.verifiedOnly ?? true },
    evidenceClaimIds: request.ledger.claims.map((claim) => claim.id),
    context: [],
    calculations: scenario.allocations.map((allocation) => ({
      expression: "vendor_landed_cost × allocation_share",
      inputs: {
        landedCost:
          landedCost(
            request.ledger.bids.find(
              (bid) => bid.vendorId === allocation.vendorId,
            )!,
            request.ledger,
          ) ?? 0,
        share: allocation.share,
      },
      result: allocation.cost,
    })),
    assumptions: [],
    executionTrace: [
      {
        step: "Scope question",
        artifact: request.ledger.rfqId,
        status: "passed",
      },
      {
        step: "Check decision readiness",
        artifact: `Bid Ledger v${request.ledger.version}`,
        status: "passed",
      },
      {
        step: "Run deterministic decision engine",
        artifact: scenario.id,
        status: "passed",
      },
    ],
    decisionBoundary:
      "The result must be recomputed if evidence, policy or supplier eligibility changes.",
    status: "decision_grade",
  };
}
