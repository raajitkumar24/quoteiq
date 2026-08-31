import {
  askDemoComparison,
  evaluateDecisionReadiness,
  generateAwardScenarios,
  getConfig,
  reasonWithOpenAI,
} from "@/lib/quoteiq";
import type { AnswerPacket, AskRequest } from "@/lib/quoteiq";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AskRequest;
    if (!payload.question || !payload.ledger) {
      return Response.json(
        { error: "question and ledger are required." },
        { status: 400 },
      );
    }
    const config = getConfig();
    if (config.mode === "demo") {
      return Response.json(askDemoComparison(payload));
    }

    const readiness = evaluateDecisionReadiness(payload.ledger);
    if (!readiness.ready) {
      const packet: AnswerPacket = {
        id: crypto.randomUUID(),
        question: payload.question,
        answer:
          "A definitive answer is blocked because decision-critical evidence is unresolved.",
        ledgerId: payload.ledger.id,
        ledgerVersion: payload.ledger.version,
        asOf: payload.ledger.asOf,
        scope: { verifiedOnly: payload.verifiedOnly ?? true },
        evidenceClaimIds: [],
        context: [],
        calculations: [],
        assumptions: [],
        executionTrace: [
          {
            step: "Check decision readiness",
            artifact: readiness.issues.map((issue) => issue.id).join(", "),
            status: "blocked",
          },
        ],
        decisionBoundary: readiness.issues
          .map((issue) => issue.description)
          .join(" "),
        status: "blocked",
      };
      return Response.json(packet);
    }

    const plan = await reasonWithOpenAI({
      task: "query_plan",
      input: {
        question: payload.question,
        ledger: payload.ledger,
        verifiedOnly: payload.verifiedOnly ?? true,
      },
    });
    const scenarios = generateAwardScenarios(payload.ledger, {
      requireTechnicalCompliance: true,
      maxLeadTimeDays: 12,
      maxSupplierShare: payload.question.includes("60%") ? 0.6 : undefined,
    });
    const answer = await reasonWithOpenAI({
      task: "grounded_answer",
      input: {
        question: payload.question,
        plan,
        scenarios,
        ledger: payload.ledger,
      },
    });
    return Response.json({
      id: crypto.randomUUID(),
      question: payload.question,
      answer,
      ledgerId: payload.ledger.id,
      ledgerVersion: payload.ledger.version,
      asOf: payload.ledger.asOf,
      scope: { verifiedOnly: payload.verifiedOnly ?? true },
      evidenceClaimIds: payload.ledger.claims.map((claim) => claim.id),
      context: [],
      calculations: [],
      assumptions: [],
      executionTrace: [
        { step: "Plan query", artifact: plan, status: "passed" },
        {
          step: "Run decision engine",
          artifact: `${scenarios.length} scenarios`,
          status: "passed",
        },
        {
          step: "Ground answer",
          artifact: config.reasoningModel,
          status: "passed",
        },
      ],
      status: "decision_grade",
    } satisfies AnswerPacket);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Query failed." },
      { status: 500 },
    );
  }
}
