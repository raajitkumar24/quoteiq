import {
  analyticsPeriods,
  getAnalyticsSnapshot,
  type AnalyticsCategory,
  type AnalyticsPeriod,
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

  return Response.json(
    getAnalyticsSnapshot(
      requestedPeriod as AnalyticsPeriod,
      requestedCategory as AnalyticsCategory,
    ),
    {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
