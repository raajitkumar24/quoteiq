import { generateAwardScenarios } from "@/lib/quoteiq";
import type { AwardConstraints, BidLedger } from "@/lib/quoteiq";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      ledger: BidLedger;
      constraints: AwardConstraints;
    };
    if (!payload.ledger || !payload.constraints) {
      return Response.json(
        { error: "ledger and constraints are required." },
        { status: 400 },
      );
    }
    return Response.json({
      ledgerVersion: payload.ledger.version,
      scenarios: generateAwardScenarios(payload.ledger, payload.constraints),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Scenario generation failed.",
      },
      { status: 500 },
    );
  }
}
