export type QuoteIqConfig = {
  mode: "demo" | "live";
  extractionModel: string;
  reasoningModel: string;
  embeddingModel: string;
  googleApiKey?: string;
  openAiApiKey?: string;
};

export function getConfig(): QuoteIqConfig {
  const googleApiKey = process.env.GOOGLE_AI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const explicitlyLive = process.env.QUOTEIQ_MODE === "live";

  if (explicitlyLive && (!googleApiKey || !openAiApiKey)) {
    throw new Error(
      "QUOTEIQ_MODE=live requires GOOGLE_AI_API_KEY and OPENAI_API_KEY.",
    );
  }

  return {
    mode: explicitlyLive ? "live" : "demo",
    extractionModel: process.env.QUOTEIQ_EXTRACTION_MODEL ?? "gemini-2.5-pro",
    reasoningModel: process.env.QUOTEIQ_REASONING_MODEL ?? "gpt-5.4",
    embeddingModel:
      process.env.QUOTEIQ_EMBEDDING_MODEL ?? "text-embedding-3-large",
    googleApiKey,
    openAiApiKey,
  };
}
