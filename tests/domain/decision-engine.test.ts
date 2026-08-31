import assert from "node:assert/strict";
import test from "node:test";
import { generateAwardScenarios } from "../../lib/quoteiq/decision-engine";
import { applyFreightResolution } from "../../lib/quoteiq/resolutions";
import { sampleLedger } from "../../lib/quoteiq/sample-data";

test("excludes unresolved vendors from deterministic scenarios", () => {
  const scenarios = generateAwardScenarios(sampleLedger, {
    requireTechnicalCompliance: true,
    maxLeadTimeDays: 12,
    maxSupplierShare: 0.6,
    minSuppliers: 2,
  });
  const balanced = scenarios.find((scenario) => scenario.id === "balanced")!;
  assert.deepEqual(
    balanced.allocations.map((allocation) => allocation.vendorId),
    ["boxco", "corrpro"],
  );
});

test("approved freight allows PackRight to re-enter scenario generation", () => {
  const resolved = applyFreightResolution(sampleLedger, {
    type: "approved_benchmark",
    vendorId: "packright",
    amount: 2.5,
    uom: "kg",
    actor: "test-buyer",
    source: "Logistics Master v19",
    reason: "Approved lane policy",
  });
  const scenarios = generateAwardScenarios(resolved, {
    requireTechnicalCompliance: true,
    maxLeadTimeDays: 12,
    maxSupplierShare: 0.6,
    minSuppliers: 2,
  });
  const balanced = scenarios.find((scenario) => scenario.id === "balanced")!;
  assert.equal(balanced.allocations.length, 2);
  assert.equal(balanced.allocations[0].share, 0.6);
});
