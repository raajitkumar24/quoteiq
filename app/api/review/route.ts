import {
  applyFreightResolution,
  evaluateDecisionReadiness,
} from "@/lib/quoteiq";
import type { BidLedger, FreightResolution } from "@/lib/quoteiq";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      ledger: BidLedger;
      resolution: FreightResolution;
    };
    if (!payload.ledger || !payload.resolution) {
      return Response.json(
        { error: "ledger and resolution are required." },
        { status: 400 },
      );
    }
    const ledger = applyFreightResolution(payload.ledger, payload.resolution);
    return Response.json({
      ledger,
      readiness: evaluateDecisionReadiness(ledger),
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Review update failed.",
      },
      { status: 500 },
    );
  }
}
