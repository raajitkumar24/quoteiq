import assert from "node:assert/strict";
import test from "node:test";

test("renders QuoteIQ product metadata and populated demo content", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(
    html,
    /<title>QuoteIQ · Evidence-backed procurement intelligence<\/title>/,
  );
  assert.match(html, /Corrugated Packaging FY27/);
  assert.match(html, /30 requested lines/);
  assert.match(html, /Documentation/);
  assert.doesNotMatch(html, /codex-preview/);
});
