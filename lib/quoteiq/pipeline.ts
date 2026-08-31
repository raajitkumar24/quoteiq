import { z } from "zod";
import { getConfig } from "./config";
import { compileDemoLedger } from "./demo-engine";
import { extractClaimsWithGemini } from "./providers";
import { evaluateDecisionReadiness } from "./readiness";
import type {
  BidLedger,
  CommercialClaim,
  CompileRequest,
  VendorBid,
} from "./types";

const extractedClaimSchema = z.object({
  kind: z.enum([
    "unit_price",
    "freight",
    "discount",
    "payment_term",
    "lead_time",
    "compliance",
    "reference_dependency",
    "other",
  ]),
  rawValue: z.string(),
  interpretedValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  currency: z.string().optional(),
  uom: z.string().optional(),
  rfqLineId: z.string().optional(),
  conditions: z.array(z.string()).default([]),
  sourceQuote: z.string(),
  page: z.number().optional(),
  sheet: z.string().optional(),
  row: z.number().optional(),
  extractionConfidence: z.number().min(0).max(1),
  mappingConfidence: z.number().min(0).max(1).default(0),
  normalizationConfidence: z.number().min(0).max(1).default(0),
});

const extractionSchema = z.object({
  claims: z.array(extractedClaimSchema),
  ambiguities: z.array(z.string()).default([]),
  contradictions: z.array(z.string()).default([]),
});

function compileExtraction(
  request: CompileRequest,
  extractions: Array<{
    artifactId: string;
    vendorId: string;
    value: z.infer<typeof extractionSchema>;
  }>,
): BidLedger {
  const claims: CommercialClaim[] = [];
  const bids: VendorBid[] = request.vendors.map((vendor) => ({
    vendorId: vendor.id,
    vendorName: vendor.name,
    offers: [],
    freight: { type: "not_stated" as const },
    technicalCompliance: false,
  }));

  for (const extraction of extractions) {
    const artifact = request.artifacts.find(
      (candidate) => candidate.id === extraction.artifactId,
    )!;
    const bid = bids.find(
      (candidate) => candidate.vendorId === extraction.vendorId,
    )!;
    extraction.value.claims.forEach((item, index) => {
      const id = `${artifact.id}-claim-${index + 1}`;
      const claim: CommercialClaim = {
        id,
        vendorId: extraction.vendorId,
        kind: item.kind,
        rawValue: item.rawValue,
        interpretedValue: item.interpretedValue,
        currency: item.currency,
        uom: item.uom,
        conditions: item.conditions,
        source: {
          artifactId: artifact.id,
          fileName: artifact.fileName,
          page: item.page,
          sheet: item.sheet,
          row: item.row,
          quote: item.sourceQuote,
        },
        confidence: {
          extraction: item.extractionConfidence,
          mapping: item.mappingConfidence,
          normalization: item.normalizationConfidence,
        },
        status:
          item.extractionConfidence >= 0.95 &&
          item.mappingConfidence >= 0.95 &&
          item.normalizationConfidence >= 0.95
            ? "system_verified"
            : "interpreted",
      };
      claims.push(claim);

      if (
        item.kind === "unit_price" &&
        item.rfqLineId &&
        typeof item.interpretedValue === "number"
      ) {
        const line = request.rfqLines.find(
          (candidate) => candidate.id === item.rfqLineId,
        );
        if (line) {
          bid.offers.push({
            rfqLineId: line.id,
            vendorId: bid.vendorId,
            claimIds: [id],
            quotedUnitPrice: item.interpretedValue,
            normalizedUnitPrice: item.interpretedValue,
            currency: item.currency ?? "INR",
            uom: item.uom ?? line.uom,
            lineTotal: item.interpretedValue * line.quantity,
            matchConfidence: item.mappingConfidence,
            status: claim.status,
          });
        }
      }
      if (item.kind === "freight") {
        const normalized = String(
          item.interpretedValue ?? item.rawValue,
        ).toLowerCase();
        bid.freight = normalized.includes("included")
          ? { type: "included", amount: 0 }
          : normalized.includes("unknown") || normalized.includes("extra")
            ? { type: "excluded_unknown" }
            : bid.freight;
      }
      if (
        item.kind === "lead_time" &&
        typeof item.interpretedValue === "number"
      ) {
        bid.leadTimeDays = item.interpretedValue;
      }
      if (item.kind === "payment_term") {
        bid.paymentTerms = String(item.interpretedValue ?? item.rawValue);
      }
      if (item.kind === "compliance" && item.interpretedValue === true) {
        bid.technicalCompliance = true;
      }
    });
  }

  return {
    id: `BL-${request.rfqId}`,
    rfqId: request.rfqId,
    version: 1,
    asOf: new Date().toISOString(),
    rfqLines: request.rfqLines,
    claims,
    bids,
    events: claims.map((claim) => ({
      id: `event-${claim.id}`,
      at: new Date().toISOString(),
      actor: "ai" as const,
      action: "commercial_claim_extracted",
      entityId: claim.id,
      model: getConfig().extractionModel,
    })),
  };
}

export async function compileQuotes(request: CompileRequest) {
  const config = getConfig();
  if (config.mode === "demo") {
    const ledger = compileDemoLedger();
    return {
      mode: config.mode,
      models: {
        extraction: config.extractionModel,
        reasoning: config.reasoningModel,
        embeddings: config.embeddingModel,
      },
      ledger,
      readiness: evaluateDecisionReadiness(ledger),
    };
  }

  const raw = await Promise.all(
    request.artifacts.map(async (artifact) => ({
      artifactId: artifact.id,
      vendorId: artifact.vendorId,
      value: extractionSchema.parse(
        await extractClaimsWithGemini(artifact, {
          rfqId: request.rfqId,
          rfqLines: request.rfqLines,
        }),
      ),
    })),
  );
  const ledger = compileExtraction(request, raw);
  return {
    mode: config.mode,
    models: {
      extraction: config.extractionModel,
      reasoning: config.reasoningModel,
      embeddings: config.embeddingModel,
    },
    ledger,
    readiness: evaluateDecisionReadiness(ledger),
  };
}
