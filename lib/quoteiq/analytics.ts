export type AnalyticsPeriod = "30d" | "90d" | "180d";
export type AnalyticsCategory =
  | "all"
  | "Packaging"
  | "MRO"
  | "IT hardware"
  | "Freight";
export type AnalyticsBusinessUnit =
  | "all"
  | "Consumer"
  | "Industrial"
  | "Corporate services";
export type AnalyticsRegion =
  | "all"
  | "Pune"
  | "Ahmedabad"
  | "Chennai"
  | "NCR";
export type AnalyticsRfqStatus =
  | "all"
  | "Compiling"
  | "Needs review"
  | "Decision-ready"
  | "Award approved";

export const analyticsPeriods: Record<AnalyticsPeriod, string> = {
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "180d": "Last 6 months",
};

export const analyticsBusinessUnits: Record<AnalyticsBusinessUnit, string> = {
  all: "All business units",
  Consumer: "Consumer",
  Industrial: "Industrial",
  "Corporate services": "Corporate services",
};

export const analyticsRegions: Record<AnalyticsRegion, string> = {
  all: "All plants",
  Pune: "Pune",
  Ahmedabad: "Ahmedabad",
  Chennai: "Chennai",
  NCR: "NCR",
};

export const analyticsRfqStatuses: Record<AnalyticsRfqStatus, string> = {
  all: "All RFQs",
  Compiling: "Compiling",
  "Needs review": "Needs review",
  "Decision-ready": "Decision-ready",
  "Award approved": "Award approved",
};

export const buyerTrendByPeriod = {
  "30d": [
    { label: "W1", ready: 14, cycle: 3.8, savings: 0.42 },
    { label: "W2", ready: 17, cycle: 3.5, savings: 0.55 },
    { label: "W3", ready: 19, cycle: 3.1, savings: 0.68 },
    { label: "W4", ready: 21, cycle: 2.9, savings: 0.79 },
  ],
  "90d": [
    { label: "W1", ready: 10, cycle: 4.8, savings: 0.31 },
    { label: "W2", ready: 11, cycle: 4.6, savings: 0.36 },
    { label: "W3", ready: 13, cycle: 4.3, savings: 0.41 },
    { label: "W4", ready: 14, cycle: 4.1, savings: 0.45 },
    { label: "W5", ready: 15, cycle: 3.9, savings: 0.49 },
    { label: "W6", ready: 14, cycle: 4.0, savings: 0.48 },
    { label: "W7", ready: 16, cycle: 3.6, savings: 0.56 },
    { label: "W8", ready: 17, cycle: 3.4, savings: 0.61 },
    { label: "W9", ready: 18, cycle: 3.2, savings: 0.65 },
    { label: "W10", ready: 19, cycle: 3.1, savings: 0.69 },
    { label: "W11", ready: 20, cycle: 2.9, savings: 0.73 },
    { label: "W12", ready: 21, cycle: 2.8, savings: 0.81 },
  ],
  "180d": [
    { label: "Mar", ready: 48, cycle: 5.2, savings: 1.22 },
    { label: "Apr", ready: 57, cycle: 4.7, savings: 1.46 },
    { label: "May", ready: 63, cycle: 4.2, savings: 1.71 },
    { label: "Jun", ready: 69, cycle: 3.7, savings: 2.04 },
    { label: "Jul", ready: 78, cycle: 3.3, savings: 2.37 },
    { label: "Aug", ready: 86, cycle: 2.9, savings: 2.74 },
  ],
} satisfies Record<AnalyticsPeriod, Array<Record<string, string | number>>>;

export const categorySavings = [
  { category: "Packaging", spend: 42.8, savings: 2.41, rate: 5.6 },
  { category: "MRO", spend: 31.4, savings: 1.92, rate: 6.1 },
  { category: "IT hardware", spend: 28.7, savings: 1.37, rate: 4.8 },
  { category: "Freight", spend: 21.7, savings: 1.14, rate: 5.3 },
];

export const outcomeFunnel = [
  { label: "RFQs created", value: 236, rate: 100 },
  { label: "Quotes compiled", value: 224, rate: 95 },
  { label: "Decision-ready", value: 186, rate: 79 },
  { label: "Award approved", value: 142, rate: 60 },
];

export const cycleStages = [
  { label: "Collect responses", current: 21.4, baseline: 28.2 },
  { label: "Compile & normalize", current: 1.8, baseline: 8.6 },
  { label: "Resolve issues", current: 3.2, baseline: 6.1 },
  { label: "Compare & approve", current: 4.1, baseline: 5.4 },
];

export const issueDrivers = [
  { name: "Missing commercial term", value: 34, color: "#d5f24a" },
  { name: "RFQ line ambiguity", value: 27, color: "#2f8a68" },
  { name: "Conflicting evidence", value: 18, color: "#e3ad4a" },
  { name: "Policy approval", value: 13, color: "#80a69a" },
  { name: "Low confidence", value: 8, color: "#b8c7c1" },
];

export const supplierPerformance = [
  { supplier: "BoxCo", winRate: "31%", coverage: "98%", response: "1.8d", variance: "+0.4%", status: "Strong" },
  { supplier: "PackRight", winRate: "27%", coverage: "96%", response: "2.4d", variance: "-0.7%", status: "Watch freight" },
  { supplier: "CorrPro", winRate: "22%", coverage: "94%", response: "1.5d", variance: "+1.8%", status: "Fastest" },
  { supplier: "Alpha Packs", winRate: "12%", coverage: "91%", response: "3.1d", variance: "+2.2%", status: "Qualified" },
  { supplier: "OmniBoard", winRate: "8%", coverage: "83%", response: "3.8d", variance: "+3.9%", status: "Coverage risk" },
];

export const qualityTrend = [
  { label: "W1", extraction: 94.7, mapping: 92.6, escalation: 98.8, provenance: 97.9 },
  { label: "W2", extraction: 95.1, mapping: 93.4, escalation: 99.1, provenance: 98.2 },
  { label: "W3", extraction: 95.8, mapping: 94.2, escalation: 99.4, provenance: 98.5 },
  { label: "W4", extraction: 96.2, mapping: 94.8, escalation: 99.7, provenance: 98.8 },
  { label: "W5", extraction: 96.6, mapping: 95.1, escalation: 100, provenance: 99.0 },
  { label: "W6", extraction: 97.1, mapping: 95.7, escalation: 100, provenance: 99.2 },
];

export const latencyProfile = [
  { stage: "Artifact routing", p50: 0.8, p95: 1.4 },
  { stage: "Claim extraction", p50: 74, p95: 126 },
  { stage: "Line matching", p50: 18, p95: 34 },
  { stage: "Normalization", p50: 2, p95: 4 },
  { stage: "Readiness", p50: 1.2, p95: 2.5 },
  { stage: "Ask answer", p50: 5.1, p95: 9.8 },
];

export const interventionDrivers = [
  { label: "Missing context", value: 38, count: 214 },
  { label: "Mapping ambiguity", value: 27, count: 152 },
  { label: "Source conflict", value: 18, count: 101 },
  { label: "Policy requirement", value: 11, count: 62 },
  { label: "Low confidence", value: 6, count: 34 },
];

export const autonomyTasks = [
  { task: "Currency & UOM conversion", level: 3, label: "Execute", evidence: "99.98% · 18.4K cases" },
  { task: "Commercial claim extraction", level: 2, label: "Prepare", evidence: "97.1% · 12.8K claims" },
  { task: "RFQ line matching", level: 2, label: "Prepare", evidence: "95.7% · category-bound" },
  { task: "Freight benchmark proposal", level: 1, label: "Suggest", evidence: "100% policy retrieval" },
  { task: "Supplier exclusion", level: 0, label: "Human only", evidence: "Consequential policy" },
  { task: "Award approval", level: 0, label: "Human only", evidence: "Control Level 2" },
];

export const modelUsage = [
  { task: "Claim extraction", model: "Gemini 2.5 Pro", volume: "5,420 artifacts", cost: "₹18.4K", success: "98.7%", fallback: "1.3%" },
  { task: "Ambiguity adjudication", model: "GPT-5.4", volume: "1,284 issues", cost: "₹9.7K", success: "96.4%", fallback: "0.8%" },
  { task: "Query planning", model: "GPT-5.4", volume: "3,116 queries", cost: "₹7.2K", success: "98.9%", fallback: "0.4%" },
  { task: "Candidate retrieval", model: "text-embedding-3-large", volume: "42.8K lines", cost: "₹1.9K", success: "99.6%", fallback: "0%" },
  { task: "Arithmetic & scenarios", model: "Deterministic", volume: "18.9K runs", cost: "₹0.6K", success: "100%", fallback: "0%" },
];

export const evaluationQueue = [
  { severity: "Critical", suite: "Freight escalation", cases: 24, pass: "100%", owner: "AI Quality" },
  { severity: "High", suite: "RFQ line ambiguity", cases: 61, pass: "98.4%", owner: "Matching" },
  { severity: "Medium", suite: "Payment-term semantics", cases: 37, pass: "94.6%", owner: "Extraction" },
  { severity: "Shadow", suite: "Packaging autonomy L3", cases: 600, pass: "99.4%", owner: "Model Risk" },
];

export const valueRealization = [
  { label: "Identified", value: 6.84, rate: 100 },
  { label: "Approved", value: 5.92, rate: 87 },
  { label: "Realized", value: 5.42, rate: 79 },
];

export const featureAdoption = [
  { label: "Evidence inspected", current: 88, prior: 79 },
  { label: "Ask used", current: 71, prior: 58 },
  { label: "Scenario generated", current: 64, prior: 49 },
  { label: "Review resolved", current: 91, prior: 86 },
];

const periodFactor: Record<AnalyticsPeriod, number> = {
  "30d": 0.36,
  "90d": 1,
  "180d": 1.88,
};

const categoryFactor: Record<AnalyticsCategory, number> = {
  all: 1,
  Packaging: 0.34,
  MRO: 0.25,
  "IT hardware": 0.23,
  Freight: 0.18,
};

const businessUnitFactor: Record<AnalyticsBusinessUnit, number> = {
  all: 1,
  Consumer: 0.46,
  Industrial: 0.36,
  "Corporate services": 0.18,
};

const regionFactor: Record<AnalyticsRegion, number> = {
  all: 1,
  Pune: 0.32,
  Ahmedabad: 0.25,
  Chennai: 0.24,
  NCR: 0.19,
};

const statusFactor: Record<AnalyticsRfqStatus, number> = {
  all: 1,
  Compiling: 0.08,
  "Needs review": 0.13,
  "Decision-ready": 0.79,
  "Award approved": 0.6,
};

export function getScopeFactor(
  period: AnalyticsPeriod,
  category: AnalyticsCategory,
  businessUnit: AnalyticsBusinessUnit = "all",
  region: AnalyticsRegion = "all",
  status: AnalyticsRfqStatus = "all",
) {
  return (
    periodFactor[period] *
    categoryFactor[category] *
    businessUnitFactor[businessUnit] *
    regionFactor[region] *
    statusFactor[status]
  );
}

export function getBuyerKpis(
  period: AnalyticsPeriod,
  category: AnalyticsCategory,
  businessUnit: AnalyticsBusinessUnit = "all",
  region: AnalyticsRegion = "all",
  status: AnalyticsRfqStatus = "all",
) {
  const factor = getScopeFactor(
    period,
    category,
    businessUnit,
    region,
    status,
  );
  return {
    decisionReady: Math.round(186 * factor),
    verifiedSpend: Number((124.6 * factor).toFixed(1)),
    savings: Number((6.84 * factor).toFixed(2)),
    hoursSaved: Math.round(742 * factor),
  };
}

export function getScopedOutcomeFunnel(
  period: AnalyticsPeriod,
  category: AnalyticsCategory,
  businessUnit: AnalyticsBusinessUnit = "all",
  region: AnalyticsRegion = "all",
) {
  const factor =
    periodFactor[period] *
    categoryFactor[category] *
    businessUnitFactor[businessUnit] *
    regionFactor[region];
  return outcomeFunnel.map((item) => ({
    ...item,
    value: Math.max(1, Math.round(item.value * factor)),
  }));
}

export function getScopedCategorySavings(
  period: AnalyticsPeriod,
  category: AnalyticsCategory,
  businessUnit: AnalyticsBusinessUnit = "all",
  region: AnalyticsRegion = "all",
  status: AnalyticsRfqStatus = "all",
) {
  const factor =
    periodFactor[period] *
    businessUnitFactor[businessUnit] *
    regionFactor[region] *
    statusFactor[status];
  return categorySavings
    .filter((item) => category === "all" || item.category === category)
    .map((item) => ({
      ...item,
      spend: Number((item.spend * factor).toFixed(2)),
      savings: Number((item.savings * factor).toFixed(2)),
    }));
}

export function getProductKpis(
  period: AnalyticsPeriod,
  category: AnalyticsCategory,
) {
  const recencyAdjustment = period === "30d" ? 0.25 : period === "180d" ? -0.35 : 0;
  const profile = {
    all: { provenance: 99.2, error: 0.18, cost: 182, p95: 3.7 },
    Packaging: { provenance: 99.4, error: 0.14, cost: 169, p95: 3.4 },
    MRO: { provenance: 98.4, error: 0.31, cost: 211, p95: 4.6 },
    "IT hardware": { provenance: 99.5, error: 0.12, cost: 158, p95: 3.1 },
    Freight: { provenance: 97.9, error: 0.38, cost: 224, p95: 4.9 },
  }[category];
  return {
    provenanceCoverage: Number(
      Math.min(100, profile.provenance + recencyAdjustment).toFixed(1),
    ),
    decisionImpactingErrorRate: Number(
      Math.max(0, profile.error - recencyAdjustment / 5).toFixed(2),
    ),
    criticalEscalationRecall: 100,
    costPerDecisionReadyRfq: Math.round(
      profile.cost * (period === "30d" ? 0.96 : period === "180d" ? 1.04 : 1),
    ),
    p95ProcessingMinutes: Number(
      (profile.p95 * (period === "30d" ? 0.95 : period === "180d" ? 1.05 : 1)).toFixed(1),
    ),
  };
}

export function getAnalyticsSnapshot(
  period: AnalyticsPeriod = "90d",
  category: AnalyticsCategory = "all",
  businessUnit: AnalyticsBusinessUnit = "all",
  region: AnalyticsRegion = "all",
  status: AnalyticsRfqStatus = "all",
) {
  const productQuality = getProductKpis(period, category);
  return {
    asOf: "2026-08-29T18:42:00+05:30",
    period,
    category,
    businessUnit,
    region,
    status,
    buyerKpis: getBuyerKpis(period, category, businessUnit, region, status),
    buyerTrend: buyerTrendByPeriod[period],
    categorySavings: getScopedCategorySavings(
      period,
      category,
      businessUnit,
      region,
      status,
    ),
    outcomeFunnel: getScopedOutcomeFunnel(
      period,
      category,
      businessUnit,
      region,
    ),
    cycleStages,
    issueDrivers,
    supplierPerformance,
    productQuality,
    qualityTrend,
    latencyProfile,
    interventionDrivers,
    autonomyTasks,
    modelUsage,
    evaluationQueue,
    valueRealization,
    featureAdoption,
  };
}
