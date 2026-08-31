import assert from "node:assert/strict";
import test from "node:test";
import {
  getAnalyticsSnapshot,
  getBuyerKpis,
  getProductKpis,
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
  const snapshot = getAnalyticsSnapshot(
    "30d",
    "Freight",
    "Industrial",
    "Chennai",
    "Decision-ready",
  );

  assert.equal(snapshot.period, "30d");
  assert.equal(snapshot.category, "Freight");
  assert.equal(snapshot.businessUnit, "Industrial");
  assert.equal(snapshot.region, "Chennai");
  assert.equal(snapshot.status, "Decision-ready");
  assert.equal(snapshot.productQuality.criticalEscalationRecall, 100);
  assert.ok(snapshot.productQuality.decisionImpactingErrorRate < 1);
  assert.ok(snapshot.qualityTrend.every((point) => point.provenance >= 97));
  assert.ok(snapshot.autonomyTasks.some((task) => task.label === "Human only"));
  assert.ok(snapshot.evaluationQueue.some((evaluation) => evaluation.severity === "Critical"));
  assert.equal(snapshot.valueRealization.at(-1)?.rate, 79);
  assert.ok(snapshot.featureAdoption.some((feature) => feature.label === "Ask used"));
});

test("every enterprise filter changes the scoped analytics cohort", () => {
  const portfolio = getBuyerKpis("90d", "all", "all", "all", "all");
  const scoped = getBuyerKpis(
    "90d",
    "all",
    "Consumer",
    "Pune",
    "Needs review",
  );

  assert.ok(scoped.decisionReady > 0);
  assert.ok(scoped.decisionReady < portfolio.decisionReady);
  assert.ok(scoped.verifiedSpend < portfolio.verifiedSpend);
  assert.ok(scoped.hoursSaved < portfolio.hoursSaved);
});

test("product quality metrics respond to the selected category", () => {
  const packaging = getProductKpis("90d", "Packaging");
  const freight = getProductKpis("90d", "Freight");

  assert.ok(packaging.provenanceCoverage > freight.provenanceCoverage);
  assert.ok(packaging.decisionImpactingErrorRate < freight.decisionImpactingErrorRate);
  assert.ok(packaging.p95ProcessingMinutes < freight.p95ProcessingMinutes);
});
