import { getConfig } from "@/lib/quoteiq";

export async function GET() {
  const config = getConfig();
  return Response.json({
    status: "ok",
    mode: config.mode,
    models: {
      extraction: config.extractionModel,
      reasoning: config.reasoningModel,
      embeddings: config.embeddingModel,
    },
    deterministicServices: [
      "normalization",
      "decision-readiness",
      "award-scenarios",
      "audit-events",
    ],
  });
}
