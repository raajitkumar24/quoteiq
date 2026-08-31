import assert from "node:assert/strict";
import test from "node:test";
import {
  convertCurrency,
  landedCost,
  normalizePackPrice,
  quotedTotal,
} from "../../lib/quoteiq/normalization";
import { sampleLedger } from "../../lib/quoteiq/sample-data";

test("normalizes a pack price to a unit price", () => {
  assert.equal(normalizePackPrice(520, 1000), 0.52);
});

test("converts foreign currency using an explicit rate", () => {
  assert.equal(convertCurrency(10, 83.58, "USD"), 835.8);
});

test("does not silently calculate unknown freight", () => {
  const packRight = sampleLedger.bids.find(
    (bid) => bid.vendorId === "packright",
  )!;
  assert.equal(quotedTotal(packRight, sampleLedger), 8203000);
  assert.equal(landedCost(packRight, sampleLedger), null);
});

test("uses approved freight only when supplied", () => {
  const packRight = sampleLedger.bids.find(
    (bid) => bid.vendorId === "packright",
  )!;
  assert.equal(
    landedCost(packRight, sampleLedger, { amount: 2.5, quantity: 32000 }),
    8283000,
  );
});
