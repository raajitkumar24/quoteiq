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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedPeriod = url.searchParams.get("period") ?? "90d";
  const requestedCategory = url.searchParams.get("category") ?? "all";
  const requestedBusinessUnit = url.searchParams.get("businessUnit") ?? "all";
  const requestedRegion = url.searchParams.get("region") ?? "all";
  const requestedStatus = url.searchParams.get("status") ?? "all";

  if (!(requestedPeriod in analyticsPeriods)) {
    return Response.json(
      { error: "period must be one of 30d, 90d or 180d." },
      { status: 400 },
    );
  }
  if (!categories.includes(requestedCategory as AnalyticsCategory)) {
    return Response.json(
      {
        error:
          "category must be one of all, Packaging, MRO, IT hardware or Freight.",
      },
      { status: 400 },
    );
  }
  if (!(requestedBusinessUnit in analyticsBusinessUnits)) {
    return Response.json(
      { error: "businessUnit is not supported." },
      { status: 400 },
    );
  }
  if (!(requestedRegion in analyticsRegions)) {
    return Response.json(
      { error: "region is not supported." },
      { status: 400 },
    );
  }
  if (!(requestedStatus in analyticsRfqStatuses)) {
    return Response.json(
      { error: "status is not supported." },
      { status: 400 },
    );
  }

  return Response.json(
    getAnalyticsSnapshot(
      requestedPeriod as AnalyticsPeriod,
      requestedCategory as AnalyticsCategory,
      requestedBusinessUnit as AnalyticsBusinessUnit,
      requestedRegion as AnalyticsRegion,
      requestedStatus as AnalyticsRfqStatus,
    ),
    {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
