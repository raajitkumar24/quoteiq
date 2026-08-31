import assert from "node:assert/strict";
import test from "node:test";
import {
  getAnalyticsSnapshot,
  getBuyerKpis,
} from "../../lib/quoteiq/analytics";

test("analytics scales buyer outcomes by period and category", () => {
  const portfolio = getBuyerKpis("90d", "all");
  const packaging = getBuyerKpis("90d", "Packaging");
  const sixMonths = getBuyerKpis("180d", "all");

  assert.deepEqual(portfolio, {
    decisionReady: 186,
    verifiedSpend: 124.6,
    savings: 6.84,
    hoursSaved: 742,
  });
  assert.ok(packaging.decisionReady < portfolio.decisionReady);
  assert.ok(sixMonths.decisionReady > portfolio.decisionReady);
  assert.ok(packaging.savings > 0);
});

test("analytics snapshot preserves buyer and product decision guardrails", () => {
  const snapshot = getAnalyticsSnapshot("30d", "Freight");

  assert.equal(snapshot.period, "30d");
  assert.equal(snapshot.category, "Freight");
  assert.equal(snapshot.productQuality.criticalEscalationRecall, 100);
  assert.ok(snapshot.productQuality.decisionImpactingErrorRate < 1);
  assert.ok(snapshot.qualityTrend.every((point) => point.provenance >= 97));
  assert.ok(snapshot.autonomyTasks.some((task) => task.label === "Human only"));
  assert.ok(snapshot.evaluationQueue.some((evaluation) => evaluation.severity === "Critical"));
});

