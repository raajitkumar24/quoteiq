import assert from "node:assert/strict";
import test from "node:test";
import { evaluateDecisionReadiness } from "../../lib/quoteiq/readiness";
import { applyFreightResolution } from "../../lib/quoteiq/resolutions";
import { sampleLedger } from "../../lib/quoteiq/sample-data";

test("blocks when unknown freight can change the winner", () => {
  const readiness = evaluateDecisionReadiness(sampleLedger);
  assert.equal(readiness.ready, false);
  assert.equal(readiness.criticalIssueCount, 1);
  assert.equal(readiness.issues[0].decisionImpact.canChangeWinner, true);
});

test("approved benchmark creates a new ledger version and clears the blocker", () => {
  const updated = applyFreightResolution(sampleLedger, {
    type: "approved_benchmark",
    vendorId: "packright",
    amount: 2.5,
    uom: "kg",
    actor: "test-buyer",
    source: "Logistics Master v19",
    reason: "Approved lane policy",
  });
  assert.equal(updated.version, sampleLedger.version + 1);
  assert.equal(evaluateDecisionReadiness(updated).ready, true);
  assert.equal(updated.events.at(-1)?.actor, "human");
});

test("human exclusion is preserved as policy state", () => {
  const updated = applyFreightResolution(sampleLedger, {
    type: "exclude",
    vendorId: "packright",
    actor: "test-buyer",
    reason: "Do not impute missing freight",
  });
  assert.equal(
    updated.bids.find((bid) => bid.vendorId === "packright")
      ?.excludedFromRanking,
    true,
  );
  assert.equal(evaluateDecisionReadiness(updated).ready, true);
});
