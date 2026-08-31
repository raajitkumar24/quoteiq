import { getConfig } from "./config";
import {
  EXTRACTION_SYSTEM_PROMPT,
  GROUNDED_ANSWER_SYSTEM_PROMPT,
  LINE_MATCH_SYSTEM_PROMPT,
  QUERY_PLANNER_SYSTEM_PROMPT,
} from "./prompts";
import type { VendorArtifact } from "./types";

async function assertOk(response: Response, provider: string) {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `${provider} request failed (${response.status}): ${detail}`,
    );
  }
}

export async function extractClaimsWithGemini(
  artifact: VendorArtifact,
  rfqContext: unknown,
) {
  const config = getConfig();
  if (!config.googleApiKey) {
    throw new Error("GOOGLE_AI_API_KEY is required for live extraction.");
  }

  const parts: Array<Record<string, unknown>> = [
    {
      text: `${EXTRACTION_SYSTEM_PROMPT}\n\nRFQ context:\n${JSON.stringify(rfqContext)}`,
    },
  ];
  if (artifact.text) parts.push({ text: artifact.text });
  if (artifact.base64) {
    parts.push({
      inline_data: {
        mime_type: artifact.mimeType,
        data: artifact.base64,
      },
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.extractionModel}:generateContent?key=${config.googleApiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
    },
  );
  await assertOk(response, "Gemini");
  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no structured extraction.");
  return JSON.parse(text);
}

export async function embedTexts(texts: string[]) {
  const config = getConfig();
  if (!config.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is required for live embeddings.");
  }
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.openAiApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ model: config.embeddingModel, input: texts }),
  });
  await assertOk(response, "OpenAI embeddings");
  const payload = await response.json();
  return payload.data.map((item: { embedding: number[] }) => item.embedding);
}

export async function reasonWithOpenAI(args: {
  task: "line_match" | "query_plan" | "grounded_answer";
  input: unknown;
}) {
  const config = getConfig();
  if (!config.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is required for live reasoning.");
  }
  const instructions = {
    line_match: LINE_MATCH_SYSTEM_PROMPT,
    query_plan: QUERY_PLANNER_SYSTEM_PROMPT,
    grounded_answer: GROUNDED_ANSWER_SYSTEM_PROMPT,
  }[args.task];
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.openAiApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: config.reasoningModel,
      instructions,
      input: JSON.stringify(args.input),
      temperature: 0,
    }),
  });
  await assertOk(response, "OpenAI reasoning");
  const payload = await response.json();
  return payload.output_text as string;
}
