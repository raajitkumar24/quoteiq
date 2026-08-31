import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const requiredSnapshots = [
  "docs/images/command-center.png",
  "docs/images/ask-verified-comparison.jpg",
  "docs/images/award-scenarios.jpg",
  "docs/images/trust-learning.jpg",
];

test("README documents the complete product journey", async () => {
  const readme = await readFile("README.md", "utf8");

  for (const section of [
    "## End-to-end buyer journey",
    "## Ask the verified comparison in detail",
    "## Human-in-the-loop policy",
    "## Core domain model",
    "## Evaluation strategy",
    "## Observability and auditability",
    "### 4. Analytics: connect procurement value to system quality",
  ]) {
    assert.match(readme, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("analytics metric dictionary and API documentation are present", async () => {
  const analytics = await readFile("docs/analytics.md", "utf8");
  const api = await readFile("docs/api.md", "utf8");

  assert.match(analytics, /## Metric dictionary/);
  assert.match(analytics, /Decision-ready RFQs per buyer-hour/);
  assert.match(analytics, /## Data lineage/);
  assert.match(api, /GET \/api\/analytics/);
});

test("README product snapshots are present and non-empty", async () => {
  const readme = await readFile("README.md", "utf8");

  for (const snapshot of requiredSnapshots) {
    assert.match(readme, new RegExp(snapshot.replaceAll(".", "\\.")));
    await access(snapshot);
    assert.ok((await stat(snapshot)).size > 10_000, `${snapshot} is unexpectedly small`);
  }
});
