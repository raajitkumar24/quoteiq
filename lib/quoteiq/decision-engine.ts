import type {
  AwardConstraints,
  AwardScenario,
  BidLedger,
  VendorBid,
} from "./types";
import { landedCost, roundMoney } from "./normalization";

type EligibleBid = VendorBid & { total: number };

function eligibleBids(
  ledger: BidLedger,
  constraints: AwardConstraints,
): EligibleBid[] {
  return ledger.bids
    .filter((bid) => !bid.excludedFromRanking)
    .filter(
      (bid) =>
        !constraints.requireTechnicalCompliance || bid.technicalCompliance,
    )
    .filter(
      (bid) =>
        constraints.maxLeadTimeDays == null ||
        (bid.leadTimeDays != null &&
          bid.leadTimeDays <= constraints.maxLeadTimeDays),
    )
    .map((bid) => ({ ...bid, total: landedCost(bid, ledger) ?? Number.NaN }))
    .filter((bid) => Number.isFinite(bid.total))
    .sort((a, b) => a.total - b.total);
}

export function generateAwardScenarios(
  ledger: BidLedger,
  constraints: AwardConstraints,
): AwardScenario[] {
  const eligible = eligibleBids(ledger, constraints);
  if (!eligible.length) {
    return [
      {
        id: "blocked",
        label: "No feasible award",
        allocations: [],
        totalCost: 0,
        feasible: false,
        tradeoffs: ["Resolve commercial or technical eligibility issues."],
        excludedVendors: ledger.bids.map((bid) => bid.vendorId),
      },
    ];
  }

  const cheapest = eligible[0];
  const fastest = [...eligible].sort(
    (a, b) => (a.leadTimeDays ?? Infinity) - (b.leadTimeDays ?? Infinity),
  )[0];
  const scenarios: AwardScenario[] = [
    {
      id: "lowest_cost",
      label: "Lowest verified landed cost",
      allocations: [
        { vendorId: cheapest.vendorId, share: 1, cost: cheapest.total },
      ],
      totalCost: cheapest.total,
      feasible: true,
      tradeoffs: ["Single-source concentration risk."],
      excludedVendors: ledger.bids
        .filter((bid) => bid.excludedFromRanking)
        .map((bid) => bid.vendorId),
    },
    {
      id: "fastest",
      label: "Fastest compliant",
      allocations: [
        { vendorId: fastest.vendorId, share: 1, cost: fastest.total },
      ],
      totalCost: fastest.total,
      feasible: true,
      tradeoffs: [
        `${roundMoney(fastest.total - cheapest.total)} cost premium vs cheapest.`,
      ],
      excludedVendors: ledger.bids
        .filter((bid) => bid.excludedFromRanking)
        .map((bid) => bid.vendorId),
    },
  ];

  const maxShare = constraints.maxSupplierShare ?? 1;
  const minSuppliers = constraints.minSuppliers ?? (maxShare < 1 ? 2 : 1);
  if (eligible.length >= minSuppliers && maxShare < 1) {
    const primaryShare = maxShare;
    const secondaryShare = roundMoney(1 - primaryShare);
    const secondary = eligible[1];
    const total = roundMoney(
      cheapest.total * primaryShare + secondary.total * secondaryShare,
    );
    scenarios.push({
      id: "balanced",
      label: "Lowest-cost diversified split",
      allocations: [
        {
          vendorId: cheapest.vendorId,
          share: primaryShare,
          cost: roundMoney(cheapest.total * primaryShare),
        },
        {
          vendorId: secondary.vendorId,
          share: secondaryShare,
          cost: roundMoney(secondary.total * secondaryShare),
        },
      ],
      totalCost: total,
      feasible: true,
      tradeoffs: [
        `${roundMoney(total - cheapest.total)} premium for supplier diversification.`,
      ],
      excludedVendors: ledger.bids
        .filter((bid) => bid.excludedFromRanking)
        .map((bid) => bid.vendorId),
    });
  }

  return scenarios;
}
