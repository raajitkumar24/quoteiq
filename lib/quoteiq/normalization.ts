import type { BidLedger, VendorBid } from "./types";

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function convertCurrency(
  amount: number,
  rateToInr: number,
  from: string,
) {
  if (from.toUpperCase() === "INR") return roundMoney(amount);
  if (!Number.isFinite(rateToInr) || rateToInr <= 0) {
    throw new Error("A positive FX rate is required.");
  }
  return roundMoney(amount * rateToInr);
}

export function normalizePackPrice(packPrice: number, unitsPerPack: number) {
  if (unitsPerPack <= 0) throw new Error("unitsPerPack must be positive.");
  return roundMoney(packPrice / unitsPerPack);
}

export function quotedTotal(bid: VendorBid, ledger: BidLedger) {
  return roundMoney(
    bid.offers.reduce((total, offer) => {
      const line = ledger.rfqLines.find((item) => item.id === offer.rfqLineId);
      if (!line || offer.normalizedUnitPrice == null) return total;
      return total + offer.normalizedUnitPrice * line.quantity;
    }, 0),
  );
}

export function landedCost(
  bid: VendorBid,
  ledger: BidLedger,
  benchmark?: { amount: number; quantity: number },
) {
  const base = quotedTotal(bid, ledger);
  if (bid.freight.type === "included") return base;
  if (bid.freight.type === "fixed")
    return roundMoney(base + bid.freight.amount);
  if (bid.freight.type === "per_uom") {
    const quantity = ledger.rfqLines.reduce(
      (sum, line) => sum + line.quantity,
      0,
    );
    return roundMoney(base + bid.freight.amount * quantity);
  }
  if (bid.freight.type === "excluded_unknown" && benchmark) {
    return roundMoney(base + benchmark.amount * benchmark.quantity);
  }
  return null;
}
