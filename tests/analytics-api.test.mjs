import assert from "node:assert/strict";
import test from "node:test";

async function builtWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("analytics-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const environment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};
const context = {
  waitUntil() {},
  passThroughOnException() {},
};

test("analytics API applies the complete enterprise scope", async () => {
  const worker = await builtWorker();
  const response = await worker.fetch(
    new Request(
      "http://localhost/api/analytics?period=30d&category=Freight&businessUnit=Industrial&region=Chennai&status=Decision-ready",
    ),
    environment,
    context,
  );

  assert.equal(response.status, 200);
  const snapshot = await response.json();
  assert.equal(snapshot.period, "30d");
  assert.equal(snapshot.category, "Freight");
  assert.equal(snapshot.businessUnit, "Industrial");
  assert.equal(snapshot.region, "Chennai");
  assert.equal(snapshot.status, "Decision-ready");
  assert.ok(snapshot.buyerKpis.decisionReady > 0);
});

test("analytics export returns a metric-defined CSV attachment", async () => {
  const worker = await builtWorker();
  const response = await worker.fetch(
    new Request(
      "http://localhost/api/analytics/export?period=90d&category=Packaging&businessUnit=Consumer&region=Pune&status=Award%20approved",
    ),
    environment,
    context,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/csv\b/);
  assert.match(
    response.headers.get("content-disposition") ?? "",
    /attachment; filename="quoteiq-analytics-90d-packaging\.csv"/,
  );
  const csv = await response.text();
  assert.match(csv, /QuoteIQ governed analytics export/);
  assert.match(csv, /Consumer/);
  assert.match(csv, /Pune/);
  assert.match(csv, /Decision-impact error/);
});

