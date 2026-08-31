import {
  analyticsBusinessUnits,
  analyticsPeriods,
  analyticsRegions,
  analyticsRfqStatuses,
  getAnalyticsSnapshot,
  type AnalyticsBusinessUnit,
  type AnalyticsCategory,
  type AnalyticsPeriod,
  type AnalyticsRegion,
  type AnalyticsRfqStatus,
} from "@/lib/quoteiq";

const categories: AnalyticsCategory[] = [
  "all",
  "Packaging",
  "MRO",
  "IT hardware",
  "Freight",
];

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const period = (url.searchParams.get("period") ?? "90d") as AnalyticsPeriod;
  const category = (url.searchParams.get("category") ?? "all") as AnalyticsCategory;
  const businessUnit = (url.searchParams.get("businessUnit") ?? "all") as AnalyticsBusinessUnit;
  const region = (url.searchParams.get("region") ?? "all") as AnalyticsRegion;
  const status = (url.searchParams.get("status") ?? "all") as AnalyticsRfqStatus;

  if (
    !(period in analyticsPeriods) ||
    !categories.includes(category) ||
    !(businessUnit in analyticsBusinessUnits) ||
    !(region in analyticsRegions) ||
    !(status in analyticsRfqStatuses)
  ) {
    return Response.json({ error: "Unsupported analytics export scope." }, { status: 400 });
  }

  const snapshot = getAnalyticsSnapshot(
    period,
    category,
    businessUnit,
    region,
    status,
  );
  const scope = [
    analyticsPeriods[period],
    category === "all" ? "All categories" : category,
    analyticsBusinessUnits[businessUnit],
    analyticsRegions[region],
    analyticsRfqStatuses[status],
  ].join(" · ");
  const rows: Array<Array<string | number>> = [
    ["QuoteIQ governed analytics export"],
    ["Snapshot as of", snapshot.asOf],
    ["Scope", scope],
    ["Data classification", "Synthetic demonstration data"],
    [],
    ["Metric", "Value", "Definition"],
    ["Decision-ready RFQs", snapshot.buyerKpis.decisionReady, "Complete provenance and no unresolved critical issues"],
    ["Verified spend (INR millions)", snapshot.buyerKpis.verifiedSpend, "Qualified comparable commercial facts"],
    ["Savings identified (INR millions)", snapshot.buyerKpis.savings, "Approved scenario versus qualified baseline"],
    ["Buyer hours saved", snapshot.buyerKpis.hoursSaved, "Validated manual benchmark less active buyer time"],
    ["Provenance coverage (%)", snapshot.productQuality.provenanceCoverage, "Material facts with inspectable evidence"],
    ["Decision-impact error (%)", snapshot.productQuality.decisionImpactingErrorRate, "Audited errors capable of changing a decision"],
    ["Critical escalation recall (%)", snapshot.productQuality.criticalEscalationRecall, "Decision-critical uncertainty routed to review"],
    ["Cost per decision-ready RFQ (INR)", snapshot.productQuality.costPerDecisionReadyRfq, "Model and deterministic processing cost"],
    ["P95 processing time (minutes)", snapshot.productQuality.p95ProcessingMinutes, "Artifact to compiled ledger, excluding human review"],
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const fileCategory = category.toLowerCase().replaceAll(" ", "-");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="quoteiq-analytics-${period}-${fileCategory}.csv"`,
      "cache-control": "private, max-age=60",
    },
  });
}

