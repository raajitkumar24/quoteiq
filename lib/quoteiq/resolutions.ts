import type { BidLedger, LedgerEvent } from "./types";

export type FreightResolution =
  | {
      type: "approved_benchmark";
      vendorId: string;
      amount: number;
      uom: string;
      actor: string;
      source: string;
      reason: string;
    }
  | {
      type: "exclude";
      vendorId: string;
      actor: string;
      reason: string;
    };

export function applyFreightResolution(
  ledger: BidLedger,
  resolution: FreightResolution,
): BidLedger {
  const bid = ledger.bids.find(
    (candidate) => candidate.vendorId === resolution.vendorId,
  );
  if (!bid) throw new Error(`Vendor ${resolution.vendorId} does not exist.`);
  if (
    bid.freight.type !== "excluded_unknown" &&
    resolution.type === "approved_benchmark"
  ) {
    throw new Error(
      "A benchmark can only resolve an unknown excluded freight amount.",
    );
  }

  const before = structuredClone(bid);
  const updatedBids = ledger.bids.map((candidate) => {
    if (candidate.vendorId !== resolution.vendorId) return candidate;
    if (resolution.type === "exclude") {
      return { ...candidate, excludedFromRanking: true };
    }
    return {
      ...candidate,
      excludedFromRanking: false,
      freight: {
        type: "per_uom" as const,
        amount: resolution.amount,
        uom: resolution.uom,
      },
    };
  });
  const updated = updatedBids.find(
    (candidate) => candidate.vendorId === resolution.vendorId,
  )!;
  const event: LedgerEvent = {
    id: `event-${ledger.version + 1}-${Date.now()}`,
    at: new Date().toISOString(),
    actor: "human",
    action:
      resolution.type === "exclude"
        ? "vendor_excluded_from_ranking"
        : "freight_benchmark_approved",
    entityId: resolution.vendorId,
    before,
    after: updated,
    reason: resolution.reason,
  };

  return {
    ...ledger,
    version: ledger.version + 1,
    asOf: event.at,
    bids: updatedBids,
    events: [...ledger.events, event],
  };
}
