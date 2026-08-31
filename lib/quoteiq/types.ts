export type VerificationStatus =
  | "extracted"
  | "interpreted"
  | "validated"
  | "system_verified"
  | "human_verified"
  | "excluded";

export type SourceLocator = {
  artifactId: string;
  fileName: string;
  page?: number;
  sheet?: string;
  row?: number;
  cell?: string;
  quote: string;
};

export type Confidence = {
  extraction: number;
  mapping: number;
  normalization: number;
};

export type RfqLine = {
  id: string;
  description: string;
  quantity: number;
  uom: string;
  attributes: Record<string, string | number | boolean>;
  mandatory: boolean;
};

export type VendorArtifact = {
  id: string;
  vendorId: string;
  fileName: string;
  mimeType: string;
  text?: string;
  base64?: string;
  version: number;
};

export type CommercialClaim = {
  id: string;
  vendorId: string;
  kind:
    | "unit_price"
    | "freight"
    | "discount"
    | "payment_term"
    | "lead_time"
    | "compliance"
    | "reference_dependency"
    | "other";
  rawValue: string;
  interpretedValue?: string | number | boolean;
  currency?: string;
  uom?: string;
  conditions: string[];
  source: SourceLocator;
  confidence: Confidence;
  status: VerificationStatus;
};

export type LineOffer = {
  rfqLineId: string;
  vendorId: string;
  claimIds: string[];
  quotedUnitPrice?: number;
  normalizedUnitPrice?: number;
  currency: string;
  uom: string;
  lineTotal?: number;
  matchConfidence: number;
  status: VerificationStatus;
};

export type VendorBid = {
  vendorId: string;
  vendorName: string;
  offers: LineOffer[];
  freight:
    | { type: "included"; amount: 0 }
    | { type: "fixed"; amount: number }
    | { type: "per_uom"; amount: number; uom: string }
    | { type: "excluded_unknown" }
    | { type: "not_stated" };
  leadTimeDays?: number;
  paymentTerms?: string;
  technicalCompliance: boolean;
  excludedFromRanking?: boolean;
};

export type LedgerEvent = {
  id: string;
  at: string;
  actor: "system" | "ai" | "human" | "vendor";
  action: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  model?: string;
};

export type BidLedger = {
  id: string;
  rfqId: string;
  version: number;
  asOf: string;
  rfqLines: RfqLine[];
  claims: CommercialClaim[];
  bids: VendorBid[];
  events: LedgerEvent[];
};

export type ReviewIssue = {
  id: string;
  vendorId?: string;
  title: string;
  description: string;
  severity: "blocking" | "high" | "medium" | "low";
  decisionImpact: {
    affectedSpend?: number;
    rankingRange?: [number, number];
    canChangeWinner: boolean;
  };
  resolutionOptions: Array<{
    id: string;
    label: string;
    consequence: string;
  }>;
};

export type DecisionReadiness = {
  ready: boolean;
  coverage: number;
  commercialVerification: number;
  technicalCompliance: number;
  criticalIssueCount: number;
  unresolvedAssumptionCount: number;
  issues: ReviewIssue[];
};

export type AwardConstraints = {
  maxSupplierShare?: number;
  minSuppliers?: number;
  maxLeadTimeDays?: number;
  requireTechnicalCompliance: boolean;
};

export type AwardScenario = {
  id: string;
  label: string;
  allocations: Array<{ vendorId: string; share: number; cost: number }>;
  totalCost: number;
  feasible: boolean;
  tradeoffs: string[];
  excludedVendors: string[];
};

export type AnswerPacket = {
  id: string;
  question: string;
  answer: string;
  ledgerId: string;
  ledgerVersion: number;
  asOf: string;
  scope: Record<string, unknown>;
  evidenceClaimIds: string[];
  context: Array<{ source: string; value: unknown; validAt: string }>;
  calculations: Array<{
    expression: string;
    inputs: Record<string, number>;
    result: number;
  }>;
  assumptions: string[];
  executionTrace: Array<{
    step: string;
    artifact: string;
    status: "passed" | "blocked";
  }>;
  decisionBoundary?: string;
  status: "informational" | "provisional" | "decision_grade" | "blocked";
};

export type CompileRequest = {
  rfqId: string;
  rfqLines: RfqLine[];
  vendors: Array<{ id: string; name: string }>;
  artifacts: VendorArtifact[];
};

export type AskRequest = {
  question: string;
  ledger: BidLedger;
  verifiedOnly?: boolean;
};
