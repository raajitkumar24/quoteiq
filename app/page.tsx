"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Calculator,
  BookOpenCheck,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Database,
  FileCheck2,
  FileSearch,
  FileSpreadsheet,
  Filter,
  Gauge,
  GitCompareArrows,
  Layers3,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  Network,
  PieChart as PieChartIcon,
  RefreshCcw,
  Route,
  Save,
  ScanSearch,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TestTube2,
  Timer,
  TrendingUp,
  UserCheck,
  WandSparkles,
  Workflow,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  analyticsPeriods,
  autonomyTasks,
  buyerTrendByPeriod,
  categorySavings,
  cycleStages,
  evaluationQueue,
  getBuyerKpis,
  interventionDrivers,
  issueDrivers,
  latencyProfile,
  modelUsage,
  outcomeFunnel,
  qualityTrend,
  supplierPerformance,
  type AnalyticsCategory,
  type AnalyticsPeriod,
} from "@/lib/quoteiq/analytics";

type View =
  | "overview"
  | "review"
  | "compare"
  | "decision"
  | "analytics"
  | "trust"
  | "system"
  | "docs";
type Evidence = {
  value: string;
  raw: string;
  source: string;
  model: string;
  note: string;
} | null;

const nav: { id: View; label: string; icon: typeof Gauge }[] = [
  { id: "overview", label: "Command center", icon: Gauge },
  { id: "review", label: "Review issues", icon: FileCheck2 },
  { id: "compare", label: "Compare bids", icon: FileSpreadsheet },
  { id: "decision", label: "Award scenarios", icon: Layers3 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "trust", label: "Trust & learning", icon: ShieldCheck },
  { id: "system", label: "AI system", icon: Bot },
  { id: "docs", label: "Documentation", icon: BookOpenCheck },
];

const vendors = [
  ["PackRight", "PDF · v3", "42 facts", "1 issue", "Compiled"],
  ["BoxCo", "Excel · v1", "45 facts", "1 issue", "Compiled"],
  ["CorrPro", "Photo · v2", "41 facts", "1 issue", "Compiled"],
  ["Alpha Packs", "Word · v1", "39 facts", "0 issues", "Verified"],
  ["OmniBoard", "Email · v1", "37 facts", "1 issue", "Compiled"],
];

const issues = [
  {
    id: 0,
    vendor: "PackRight",
    title: "Freight is excluded, but no amount is quoted",
    impact: "Could move PackRight from #1 to #3",
    spend: "₹8.21M bid affected",
    tone: "high",
    source: "PackRight_quote_v3.pdf · page 4",
    quote: "Prices are ex-works. Freight shall be charged extra at actuals.",
    question: "How should freight be treated for this comparison?",
  },
  {
    id: 1,
    vendor: "BoxCo",
    title: "Vendor line maps to two possible RFQ items",
    impact: "Could change the best price on 2 high-volume lines",
    spend: "₹2.10L spend affected",
    tone: "high",
    source: "BoxCo_FY27.xlsx · row 18",
    quote: "5PLY HD 18BF — 650 × 400 — ₹41.80/kg",
    question: "Which requested item did BoxCo quote?",
  },
  {
    id: 2,
    vendor: "CorrPro",
    title: "Payment-term trigger is ambiguous",
    impact: "Does not change the current ranking",
    spend: "Commercial term only",
    tone: "medium",
    source: "CorrPro_ratecard.jpg · footnote",
    quote: "Net 30 days from receipt.",
    question: "Does ‘receipt’ refer to invoice receipt or goods receipt?",
  },
];

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [resolved, setResolved] = useState<number[]>([]);
  const [freightResolution, setFreightResolution] = useState<
    "benchmark" | "exclude" | null
  >(null);
  const [activeIssue, setActiveIssue] = useState(0);
  const [evidence, setEvidence] = useState<Evidence>(null);
  const [query, setQuery] = useState("");
  const [scenario, setScenario] = useState("diversified");
  const [approved, setApproved] = useState(false);
  const remaining = 3 - resolved.length;

  const title =
    view === "overview"
      ? "Corrugated Packaging FY27"
      : nav.find((n) => n.id === view)?.label;

  function openView(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function resolveIssue(id: number, resolution?: "benchmark" | "exclude") {
    setResolved((r) => (r.includes(id) ? r : [...r, id]));
    if (id === 0 && resolution) {
      setFreightResolution(resolution);
      setApproved(false);
    }
    const next = issues.find((i) => !resolved.includes(i.id) && i.id !== id);
    if (next) setActiveIssue(next.id);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Layers3 size={17} />
          </div>
          <div>
            <strong>QuoteIQ</strong>
            <span>Bid intelligence</span>
          </div>
        </div>
        <nav aria-label="Product navigation">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => openView(id)}
              className={view === id ? "nav-active" : ""}
            >
              <Icon size={17} />
              <span>{label}</span>
              {id === "review" && remaining > 0 && <b>{remaining}</b>}
            </button>
          ))}
        </nav>
        <div className="autonomy-card">
          <div className="eyebrow">
            <ShieldCheck size={13} /> AI CONTROL
          </div>
          <strong>Level 2 · Prepare</strong>
          <p>
            AI verifies low-risk facts. You approve decision-critical
            interpretations.
          </p>
          <button onClick={() => openView("system")}>
            View controls <ChevronRight size={14} />
          </button>
        </div>
        <div className="user">
          <div>RK</div>
          <span>
            <strong>Raajit Kumar</strong>
            <small>Category buyer</small>
          </span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <button className="back-link" onClick={() => openView("overview")}>
              RFQs
            </button>
            <span>/</span>
            <strong>{title}</strong>
          </div>
          <div className="top-actions">
            <span className="demo-tag">INTERVIEW DEMO</span>
            <button className="icon-btn" aria-label="Search">
              <Search size={17} />
            </button>
            <button className="outline-btn" onClick={() => openView("system")}>
              <Sparkles size={15} /> How AI works
            </button>
          </div>
        </header>

        <div className="content">
          {view === "overview" && (
            <>
              <PageIntro remaining={remaining} />
              <Overview
                remaining={remaining}
                onReview={() => openView("review")}
                onCompare={() => openView("compare")}
              />
            </>
          )}
          {view === "review" && (
            <Review
              active={activeIssue}
              resolved={resolved}
              onSelect={setActiveIssue}
              onResolve={resolveIssue}
              onCompare={() => openView("compare")}
            />
          )}
          {view === "compare" && (
            <Compare
              onEvidence={setEvidence}
              query={query}
              setQuery={setQuery}
              freightResolution={freightResolution}
              onResolveFreight={(resolution) => resolveIssue(0, resolution)}
              onDecision={() => openView("decision")}
            />
          )}
          {view === "decision" && (
            <Decision
              scenario={scenario}
              setScenario={setScenario}
              approved={approved}
              setApproved={setApproved}
              freightResolution={freightResolution}
            />
          )}
          {view === "analytics" && <Analytics />}
          {view === "trust" && <TrustLearning />}
          {view === "system" && <SystemView />}
          {view === "docs" && <Documentation onNavigate={openView} />}
        </div>
      </section>

      <EvidenceSheet evidence={evidence} close={() => setEvidence(null)} />
    </main>
  );
}

function PageIntro({ remaining }: { remaining: number }) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">RFQ-2027-014 · INDIRECT MATERIALS</div>
        <h1>Corrugated Packaging FY27</h1>
        <p>30 requested lines · 5 vendor responses · ₹8.4M estimated spend</p>
      </div>
      <div className="phase">
        <span className="done">
          <Check size={12} />
        </span>{" "}
        Compile <i />
        <span className={remaining ? "active" : "done"}>
          {remaining ? "2" : <Check size={12} />}
        </span>{" "}
        Verify <i />
        <span>3</span> Decide
      </div>
    </div>
  );
}

function Overview({
  remaining,
  onReview,
  onCompare,
}: {
  remaining: number;
  onReview: () => void;
  onCompare: () => void;
}) {
  const readiness = remaining === 0 ? 100 : 94;
  return (
    <>
      <section className="readiness-card">
        <div
          className="score-ring"
          style={{
            background: `conic-gradient(var(--lime) ${readiness}%,#ffffff1f 0)`,
          }}
        >
          <strong>{readiness}%</strong>
          <span>ready</span>
        </div>
        <div className="readiness-main">
          <div className="eyebrow success">
            <ShieldCheck size={13} /> DECISION READINESS
          </div>
          <h2>
            {remaining
              ? "Almost ready for award analysis"
              : "Ready for award analysis"}
          </h2>
          <p>
            204 commercial facts compiled.{" "}
            {remaining
              ? `${remaining} issues could change the vendor ranking and require your judgment.`
              : "All decision-critical interpretations are verified."}
          </p>
          <div className="readiness-bars">
            <Metric label="Quote coverage" value={98} />
            <Metric
              label="Commercial verification"
              value={remaining ? 94 : 100}
            />
            <Metric label="Technical compliance" value={100} />
          </div>
        </div>
        <button
          className="primary-btn"
          onClick={remaining ? onReview : onCompare}
        >
          {remaining ? `Resolve ${remaining} issues` : "Open comparison"}{" "}
          <ArrowRight size={16} />
        </button>
      </section>
      <div className="grid-two">
        <section className="panel issue-panel">
          <div className="panel-head">
            <div>
              <span className="kicker">WHAT NEEDS YOU</span>
              <h2>Decision-critical review</h2>
            </div>
            <button onClick={onReview}>View all</button>
          </div>
          {issues.map((i) => (
            <button className="issue-row" key={i.id} onClick={onReview}>
              <div className={`issue-icon ${i.tone}`}>
                <CircleHelp size={17} />
              </div>
              <div>
                <span>{i.vendor}</span>
                <strong>{i.title}</strong>
                <small>{i.impact}</small>
              </div>
              <ChevronRight size={17} />
            </button>
          ))}
        </section>
        <section className="panel snapshot">
          <div className="panel-head">
            <div>
              <span className="kicker">CURRENT LEADER</span>
              <h2>Verified bid snapshot</h2>
            </div>
            <span className="live-pill">Provisional</span>
          </div>
          <div className="leader">
            <div>
              <div className="vendor-logo">P</div>
              <span>
                <strong>PackRight</strong>
                <small>Lowest current landed cost</small>
              </span>
            </div>
            <div>
              <strong>₹8.21M</strong>
              <small>Estimated landed cost</small>
            </div>
          </div>
          <div className="tradeoff">
            <AlertTriangle size={16} />
            <p>
              <strong>₹38K cheaper than BoxCo</strong>, but unpriced freight and
              a 5-day longer lead time remain material.
            </p>
          </div>
          <button className="secondary-btn" onClick={onCompare}>
            Open comparison <ArrowRight size={15} />
          </button>
        </section>
      </div>
      <section className="panel vendor-panel">
        <div className="panel-head">
          <div>
            <span className="kicker">SOURCE COVERAGE</span>
            <h2>Vendor responses</h2>
          </div>
          <div className="model-chip">
            <Sparkles size={13} /> Gemini 2.5 Pro · claim extraction
          </div>
        </div>
        <div className="vendor-table">
          <div className="table-row table-head">
            <span>Vendor</span>
            <span>Source</span>
            <span>Facts</span>
            <span>Review</span>
            <span>Status</span>
          </div>
          {vendors.map((v) => (
            <div className="table-row" key={v[0]}>
              <span>
                <div className="mini-logo">{v[0][0]}</div>
                <strong>{v[0]}</strong>
              </span>
              <span>{v[1]}</span>
              <span>{v[2]}</span>
              <span className={v[3] === "0 issues" ? "ok" : "warn"}>
                {v[3]}
              </span>
              <span>
                <i className={v[4] === "Verified" ? "dot verified" : "dot"} />
                {v[4]}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Review({
  active,
  resolved,
  onSelect,
  onResolve,
  onCompare,
}: {
  active: number;
  resolved: number[];
  onSelect: (n: number) => void;
  onResolve: (n: number, resolution?: "benchmark" | "exclude") => void;
  onCompare: () => void;
}) {
  const issue = issues[active];
  const remaining = 3 - resolved.length;
  return (
    <>
      <Subhead
        eyebrow="HUMAN-IN-THE-LOOP"
        title="Review what could change the decision"
        text="The system has hidden 17 low-impact warnings and surfaced only the three that require buyer judgment."
      />
      <div className="review-layout">
        <aside className="review-list panel">
          <div className="review-summary">
            <div className="impact-count">{remaining}</div>
            <div>
              <strong>
                {remaining ? "issues remaining" : "review complete"}
              </strong>
              <span>
                {remaining
                  ? "Estimated review time · 2 min"
                  : "Ready for comparison"}
              </span>
            </div>
          </div>
          {issues.map((i) => (
            <button
              key={i.id}
              onClick={() => onSelect(i.id)}
              className={`${active === i.id ? "selected" : ""} ${resolved.includes(i.id) ? "resolved" : ""}`}
            >
              <div className={`impact-dot ${i.tone}`} />{" "}
              <span>
                <small>
                  {i.vendor} ·{" "}
                  {i.tone === "high" ? "HIGH IMPACT" : "MEDIUM IMPACT"}
                </small>
                <strong>{i.title}</strong>
                <em>
                  {resolved.includes(i.id) ? (
                    <>
                      <CheckCircle2 size={12} /> Resolved
                    </>
                  ) : (
                    i.spend
                  )}
                </em>
              </span>
              <ChevronRight size={15} />
            </button>
          ))}
        </aside>
        <section className="review-detail panel">
          <div className="detail-toolbar">
            <span className={`risk-badge ${issue.tone}`}>
              {issue.tone === "high" ? "DECISION-CRITICAL" : "REVIEW"}
            </span>
            <span>Issue {active + 1} of 3</span>
          </div>
          <div className="detail-body">
            <div className="eyebrow">{issue.vendor} · COMMERCIAL TERM</div>
            <h2>{issue.title}</h2>
            <p className="impact-line">
              <AlertTriangle size={15} /> {issue.impact}
            </p>
            <div className="source-map">
              <div className="source-top">
                <FileSearch size={16} />
                <span>
                  <strong>Original evidence</strong>
                  <small>{issue.source}</small>
                </span>
                <button>Open source</button>
              </div>
              <blockquote>“{issue.quote}”</blockquote>
              <div className="highlight-label">AI source highlight</div>
            </div>
            <div className="interpretation">
              <div>
                <Sparkles size={16} />
                <span>
                  <strong>AI interpretation</strong>
                  <small>GPT-5.4 · semantic adjudication</small>
                </span>
              </div>
              <p>
                {active === 0
                  ? "Freight is excluded from quoted prices. No reliable landed-cost comparison is possible until a benchmark or vendor clarification is applied."
                  : active === 1
                    ? "Dimensions match RFQ line PKG-018 more strongly (0.86) than PKG-021 (0.74), but flute grade is missing."
                    : "The term most likely means invoice receipt, but the source does not explicitly define the trigger."}
              </p>
              <div className="confidence-row">
                <span>
                  Extraction <b>99%</b>
                </span>
                <span>
                  Interpretation <b>{active === 0 ? "97%" : "78%"}</b>
                </span>
                <span>
                  Decision impact{" "}
                  <b className="high-text">{active === 2 ? "Low" : "High"}</b>
                </span>
              </div>
            </div>
            <h3>{issue.question}</h3>
            <div className="resolution-options">
              {active === 0 && (
                <>
                  <button onClick={() => onResolve(0, "benchmark")}>
                    <strong>Use approved lane benchmark</strong>
                    <span>₹2.50/kg · Pune Zone 2</span>
                  </button>
                  <button onClick={() => onResolve(0, "exclude")}>
                    <strong>Exclude from landed-cost ranking</strong>
                    <span>Keep PackRight visible with a qualification</span>
                  </button>
                </>
              )}
              {active === 1 && (
                <>
                  <button onClick={() => onResolve(1)}>
                    <strong>Map to PKG-018</strong>
                    <span>5-ply · 650 × 400 × 350</span>
                  </button>
                  <button onClick={() => onResolve(1)}>
                    <strong>Request vendor clarification</strong>
                    <span>Keep both lines unresolved</span>
                  </button>
                </>
              )}
              {active === 2 && (
                <>
                  <button onClick={() => onResolve(2)}>
                    <strong>Invoice receipt</strong>
                    <span>Apply Net 30 from invoice received date</span>
                  </button>
                  <button onClick={() => onResolve(2)}>
                    <strong>Goods receipt</strong>
                    <span>Apply Net 30 from GRN date</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="detail-footer">
            <button className="text-btn">Review later</button>
            {remaining === 0 ||
            (remaining === 1 && !resolved.includes(active)) ? (
              <button className="dark-btn" onClick={onCompare}>
                Open verified comparison <ArrowRight size={15} />
              </button>
            ) : (
              <span>
                Resolution recompiles every downstream view automatically.
              </span>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function Compare({
  onEvidence,
  query,
  setQuery,
  freightResolution,
  onResolveFreight,
  onDecision,
}: {
  onEvidence: (e: Evidence) => void;
  query: string;
  setQuery: (s: string) => void;
  freightResolution: "benchmark" | "exclude" | null;
  onResolveFreight: (resolution: "benchmark" | "exclude") => void;
  onDecision: () => void;
}) {
  const [queryStage, setQueryStage] = useState<
    "idle" | "running" | "blocked" | "preview" | "complete"
  >("idle");
  const [traceIndex, setTraceIndex] = useState(-1);
  const [notice, setNotice] = useState("");
  const [saved, setSaved] = useState(false);
  const [queryIntent, setQueryIntent] = useState<
    "freight" | "split" | "explain"
  >("freight");
  const traceByIntent = {
    freight: [
      {
        icon: ScanSearch,
        title: "Question scoped",
        detail: "Minimize landed cost · all 5 vendors · 30 RFQ lines",
      },
      {
        icon: ListChecks,
        title: "Required facts identified",
        detail: "Normalized price · annual quantity · freight treatment",
      },
      {
        icon: ShieldCheck,
        title: "Decision readiness checked",
        detail: "14 facts verified · 1 decision-critical input missing",
      },
      {
        icon: Database,
        title: "Approved context retrieved",
        detail: "Pune Zone 2 benchmark · Freight Policy v4.2",
      },
      {
        icon: Calculator,
        title: "Counterfactual calculated",
        detail: "PackRight raw vs benchmarked landed cost",
      },
      {
        icon: GitCompareArrows,
        title: "Answer safety verified",
        detail: "Ranking changes #1 → #2 · human confirmation required",
      },
    ],
    split: [
      {
        icon: ScanSearch,
        title: "Question scoped",
        detail: "Diversified award · all compliant vendors · all RFQ lines",
      },
      {
        icon: ListChecks,
        title: "Constraints identified",
        detail: "Maximum 60% per vendor · full line coverage",
      },
      {
        icon: ShieldCheck,
        title: "Decision readiness checked",
        detail: "Technical and commercial inputs verified",
      },
      {
        icon: Database,
        title: "Policy context retrieved",
        detail: "Supplier concentration ceiling · delivery policy",
      },
      {
        icon: Calculator,
        title: "Allocation optimized",
        detail: "OR-Tools evaluated feasible volume splits",
      },
      {
        icon: GitCompareArrows,
        title: "Scenario verified",
        detail: "Cost, coverage, delivery and concentration reconciled",
      },
    ],
    explain: [
      {
        icon: ScanSearch,
        title: "Question scoped",
        detail: "Explain OmniBoard ranking · current verified snapshot",
      },
      {
        icon: ListChecks,
        title: "Required evidence identified",
        detail: "Price, freight, lead time and data completeness",
      },
      {
        icon: ShieldCheck,
        title: "Decision readiness checked",
        detail: "Explanation is safe; award use remains qualified",
      },
      {
        icon: Database,
        title: "Ledger evidence retrieved",
        detail: "OmniBoard email claims and unresolved fields",
      },
      {
        icon: Calculator,
        title: "Comparable cost checked",
        detail: "Quoted price tested against missing freight",
      },
      {
        icon: GitCompareArrows,
        title: "Explanation grounded",
        detail: "Every ranking reason linked to ledger evidence",
      },
    ],
  };
  const executionTrace = traceByIntent[queryIntent];
  const traceLength = executionTrace.length;
  const freightApplied =
    freightResolution === "benchmark" ||
    (queryStage === "complete" &&
      queryIntent === "freight" &&
      freightResolution !== "exclude");
  const packRightExcluded = freightResolution === "exclude";

  useEffect(() => {
    if (queryStage !== "running") return;
    const timers = Array.from({ length: traceLength }, (_, index) =>
      setTimeout(() => setTraceIndex(index), 420 * (index + 1)),
    );
    const done = setTimeout(
      () =>
        setQueryStage(
          (queryIntent === "freight" || queryIntent === "split") &&
            !freightResolution
            ? "blocked"
            : "complete",
        ),
      420 * (traceLength + 1),
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [queryStage, queryIntent, freightResolution, traceLength]);

  function submitQuery(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setTraceIndex(-1);
    const normalizedQuery = query.toLowerCase();
    setQueryIntent(
      normalizedQuery.includes("split") ||
        normalizedQuery.includes("60%") ||
        normalizedQuery.includes("divers")
        ? "split"
        : normalizedQuery.includes("omni") || normalizedQuery.includes("why")
          ? "explain"
          : "freight",
    );
    setNotice("");
    setSaved(false);
    setQueryStage("running");
  }

  const rows = [
    [
      "PKG-001",
      "5-ply BC · 18 BF",
      "₹41.16",
      "₹42.40",
      "₹42.30",
      "₹41.90",
      "₹39.80*",
    ],
    [
      "PKG-002",
      "3-ply B · 16 BF",
      "₹37.24",
      "₹38.20",
      "₹39.00",
      "₹36.80",
      "₹38.00",
    ],
    [
      "PKG-003",
      "5-ply · 650×400×350",
      "₹42.00",
      "₹41.80",
      "₹43.10",
      "₹42.30",
      "—",
    ],
    [
      "PKG-004",
      "3-ply · 500×350×300",
      "₹38.00",
      "₹38.60",
      "₹37.90",
      "₹39.20",
      "₹38.20",
    ],
  ];
  return (
    <>
      <Subhead
        eyebrow="VERIFIED BID LEDGER"
        title="One comparison. Every value traceable."
        text="Prices are normalized to INR/kg, taxes excluded. Click any value to inspect its source and transformation."
        action={
          <button className="dark-btn" onClick={onDecision}>
            Build award scenarios <ArrowRight size={15} />
          </button>
        }
      />
      <section className="panel comparison-panel">
        <div className="comparison-toolbar">
          <div>
            <button className="filter-active">Commercial</button>
            <button>Terms</button>
            <button>Compliance</button>
          </div>
          <span>
            <ShieldCheck size={14} />{" "}
            {freightApplied || packRightExcluded ? "202" : "201"} / 204 facts
            verified
          </span>
        </div>
        <div className="comparison-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>RFQ line</th>
                <th>Specification</th>
                <th>
                  <span className="rank">
                    {packRightExcluded ? "—" : freightApplied ? "#2" : "#1*"}
                  </span>
                  PackRight
                  <small>
                    {packRightExcluded
                      ? "Excluded from landed ranking"
                      : freightApplied
                        ? "₹8.29M landed"
                        : "₹8.21M · freight unresolved"}
                  </small>
                </th>
                <th>
                  <span className="rank win">
                    {freightApplied || packRightExcluded ? "#1" : "#2"}
                  </span>
                  BoxCo<small>₹8.27M landed</small>
                </th>
                <th>
                  CorrPro<small>₹8.62M landed</small>
                </th>
                <th>
                  Alpha<small>₹8.51M landed</small>
                </th>
                <th>
                  OmniBoard<small>₹8.44M qualified</small>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={r[0]}>
                  {r.map((c, ci) =>
                    ci < 2 ? (
                      <td key={ci}>
                        <strong>{c}</strong>
                      </td>
                    ) : (
                      <td key={ci}>
                        <button
                          onClick={() =>
                            onEvidence({
                              value: c,
                              raw:
                                ci === 2 && ri === 0
                                  ? "₹42/kg"
                                  : "₹" + c.replace("₹", ""),
                              source:
                                ci === 2
                                  ? "PackRight_quote_v3.pdf · page 4"
                                  : "Vendor response · pricing table",
                              model: "Gemini 2.5 Pro · extracted",
                              note:
                                ci === 2 && ri === 0
                                  ? "2% early-payment discount applied; freight remains unresolved until the approved benchmark is human-confirmed."
                                  : "No semantic transformation beyond canonical INR/kg normalization.",
                            })
                          }
                          className={ci === 3 ? "best-cell" : ""}
                        >
                          {c}
                          {ci === 2 && ri === 0 && <small>2% discount</small>}
                        </button>
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="terms-strip">
          <Term
            label="Freight"
            values={`${packRightExcluded ? "Excluded" : freightApplied ? "Benchmark approved" : "Unknown*"} · Included · Included · Extra · Extra`}
          />
          <Term label="Lead time" values="12d · 7d · 5d · 9d · Unknown" />
          <Term label="Payment" values="7d · 30d · 30d · 45d · 30d" />
        </div>
      </section>
      <section className={`verified-ask ${queryStage}`}>
        <div className="verified-ask-head">
          <div className="ask-icon">
            <MessageSquareText size={19} />
          </div>
          <div>
            <strong>Ask the verified comparison</strong>
            <span>
              Answers are scoped, evidence-backed and connected to sourcing
              actions.
            </span>
          </div>
          <div className="ask-contract">
            <ShieldCheck size={13} /> Ask → Verify → Act
          </div>
        </div>
        <div className="query-scope">
          <span className="kicker">ACTIVE SCOPE</span>
          <button>
            All 5 vendors <X size={11} />
          </button>
          <button>
            30 RFQ lines <X size={11} />
          </button>
          <button>
            Verified facts only <X size={11} />
          </button>
          <button>
            INR/kg <X size={11} />
          </button>
          <button>
            Taxes excluded <X size={11} />
          </button>
          <span className="scope-time">
            <Clock3 size={12} /> Snapshot · 29 Aug, 18:42
          </span>
        </div>
        {queryStage === "idle" && (
          <div className="query-starter">
            <div className="suggestions">
              <button
                onClick={() => setQuery("Who is cheapest after freight?")}
              >
                Who is cheapest after freight?
              </button>
              <button
                onClick={() =>
                  setQuery("Create a split with max 60% per vendor")
                }
              >
                Create a diversified split
              </button>
              <button
                onClick={() => setQuery("Why isn’t OmniBoard ranked first?")}
              >
                Why not OmniBoard?
              </button>
            </div>
            <div className="active-assumptions">
              <SlidersHorizontal size={13} />
              <span>
                <strong>No conversational assumptions</strong>
                <small>Questions cannot silently change the Bid Ledger.</small>
              </span>
            </div>
          </div>
        )}
        <form className="verified-query-form" onSubmit={submitQuery}>
          <Sparkles size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a sourcing question…"
            aria-label="Ask the verified comparison"
          />
          <button type="submit" disabled={queryStage === "running"}>
            {queryStage === "running" ? (
              <span className="query-spinner" />
            ) : (
              <ArrowRight size={17} />
            )}
          </button>
        </form>

        {queryStage === "running" && (
          <div className="query-running">
            <div className="running-title">
              <div className="query-pulse">
                <BrainCircuit size={18} />
              </div>
              <span>
                <strong>Building a verified answer</strong>
                <small>
                  Showing reproducible work—not private model chain-of-thought.
                </small>
              </span>
              <b>
                {Math.min(traceIndex + 2, executionTrace.length)}/
                {executionTrace.length}
              </b>
            </div>
            <div className="stream-trace">
              {executionTrace.map(({ icon: Icon, title, detail }, i) => (
                <div
                  key={title}
                  className={`${i <= traceIndex ? "done" : ""} ${i === traceIndex + 1 ? "active" : ""}`}
                >
                  <span>
                    {i <= traceIndex ? <Check size={12} /> : <Icon size={13} />}
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <small>{i <= traceIndex ? detail : "Waiting…"}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {queryStage === "blocked" && (
          <div className="query-result blocked-result">
            <div className="answer-status provisional">
              <AlertTriangle size={15} />
              <span>
                <strong>Provisional answer</strong>
                <small>One unresolved input can change the winner</small>
              </span>
            </div>
            <div className="blocked-grid">
              <div>
                <span className="kicker">DIRECT ANSWER</span>
                <h2>
                  {queryIntent === "split"
                    ? "A diversified optimum is not yet safe."
                    : "A definitive ranking is not yet safe."}
                </h2>
                <p>
                  {queryIntent === "split" ? (
                    <>
                      PackRight is a candidate for the optimized split, but its
                      freight amount is missing. The system will not allocate
                      volume against an unverified landed cost.
                    </>
                  ) : (
                    <>
                      PackRight appears cheapest at <strong>₹8.21M</strong>, but
                      its freight amount is missing. Depending on freight, it
                      could rank between <strong>#1 and #3</strong>.
                    </>
                  )}
                </p>
                <div className="ranking-range">
                  {queryIntent === "split" ? (
                    <>
                      <div>
                        <span>Constraint</span>
                        <strong>≤60% / vendor</strong>
                        <small>Buyer-requested concentration ceiling</small>
                      </div>
                      <ArrowRight size={15} />
                      <div>
                        <span>Blocked input</span>
                        <strong>PackRight freight</strong>
                        <small>Amount not provided by vendor</small>
                      </div>
                      <ArrowRight size={15} />
                      <div>
                        <span>Safe outcome</span>
                        <strong>Optimization paused</strong>
                        <small>Resolve or exclude before allocation</small>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span>Best case</span>
                        <strong>#1 · ₹8.21M</strong>
                        <small>
                          Freight treated as zero · invalid for award
                        </small>
                      </div>
                      <ArrowRight size={15} />
                      <div>
                        <span>Approved benchmark</span>
                        <strong>#2 · ₹8.29M</strong>
                        <small>₹2.50/kg · policy-permitted</small>
                      </div>
                      <ArrowRight size={15} />
                      <div>
                        <span>High freight</span>
                        <strong>#3 · ₹8.36M</strong>
                        <small>₹4.70/kg sensitivity</small>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <aside>
                <span className="kicker">WHY THE SYSTEM STOPPED</span>
                <div>
                  <ShieldCheck size={14} />
                  <span>
                    <strong>Extraction is reliable</strong>
                    <small>“Freight extra at actuals” · 99%</small>
                  </span>
                </div>
                <div>
                  <AlertTriangle size={14} />
                  <span>
                    <strong>Context is incomplete</strong>
                    <small>Vendor freight amount is unknown</small>
                  </span>
                </div>
                <div>
                  <GitCompareArrows size={14} />
                  <span>
                    <strong>Impact is material</strong>
                    <small>Supplier ranking changes</small>
                  </span>
                </div>
              </aside>
            </div>
            <div className="resolution-bar">
              <div>
                <strong>Resolve within the workflow</strong>
                <span>
                  The answer will recompile from the new verified ledger
                  version.
                </span>
              </div>
              <button onClick={() => setQueryStage("preview")}>
                <Calculator size={14} /> Apply approved ₹2.50/kg benchmark
              </button>
              <button
                onClick={() =>
                  setNotice(
                    "Vendor clarification drafted. Human approval is required before sending.",
                  )
                }
              >
                <Send size={14} /> Request vendor clarification
              </button>
            </div>
            {notice && (
              <div className="query-notice">
                <CheckCircle2 size={14} />
                {notice}
              </div>
            )}
          </div>
        )}

        {queryStage === "preview" && (
          <div className="query-result assumption-preview">
            <div className="answer-status review">
              <UserCheck size={15} />
              <span>
                <strong>Human approval required</strong>
                <small>Preview the decision-changing ledger update</small>
              </span>
            </div>
            <div className="preview-layout">
              <div>
                <span className="kicker">PROPOSED CONTEXT</span>
                <h2>Apply Pune Zone 2 freight benchmark</h2>
                <p>
                  Freight Policy v4.2 permits the approved lane benchmark for
                  provisional comparisons when vendor freight is missing.
                </p>
                <div className="context-proof">
                  <Database size={14} />
                  <span>
                    <strong>Logistics Master v19</strong>
                    <small>
                      ₹2.50/kg · valid until 30 Sep · owner: Logistics COE
                    </small>
                  </span>
                  <ShieldCheck size={14} />
                </div>
              </div>
              <div className="change-preview">
                <div className="change-head">
                  <span>FIELD</span>
                  <span>BEFORE</span>
                  <span>AFTER</span>
                </div>
                <div>
                  <b>Freight basis</b>
                  <span>Unknown</span>
                  <strong>Approved benchmark</strong>
                </div>
                <div>
                  <b>Freight amount</b>
                  <span>—</span>
                  <strong>₹80,000</strong>
                </div>
                <div>
                  <b>Landed cost</b>
                  <span>₹8.21M</span>
                  <strong>₹8.29M</strong>
                </div>
                <div>
                  <b>PackRight rank</b>
                  <span>#1</span>
                  <strong>#2</strong>
                </div>
              </div>
            </div>
            <div className="preview-footer">
              <button
                className="text-btn"
                onClick={() => setQueryStage("blocked")}
              >
                Cancel
              </button>
              <span>
                <LockKeyhole size={12} /> Creates Bid Ledger v4 and an immutable
                approval event
              </span>
              <button
                className="dark-btn"
                onClick={() => {
                  onResolveFreight("benchmark");
                  setQueryStage("complete");
                }}
              >
                <Check size={14} /> Approve and recompute
              </button>
            </div>
          </div>
        )}

        {queryStage === "complete" && (
          <div className="query-result complete-result">
            <div className="answer-status decision-grade">
              <ShieldCheck size={15} />
              <span>
                <strong>Decision-grade answer</strong>
                <small>
                  {queryIntent === "freight"
                    ? freightResolution === "exclude"
                      ? "Buyer exclusion honored · comparable bids ranked · no benchmark substituted"
                      : "Critical inputs verified · calculation reconciled · human assumption approved"
                    : queryIntent === "split"
                      ? "Feasible allocation · constraints reconciled · ready for buyer review"
                      : "Explanation grounded · all claims linked to ledger evidence"}
                </small>
              </span>
              <b>AP-014-04</b>
            </div>
            <div className="answer-workspace">
              <Tabs defaultValue="answer" className="answer-tabs">
                <TabsList variant="line" className="answer-tab-list">
                  <TabsTrigger value="answer">Answer</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence & context</TabsTrigger>
                  <TabsTrigger value="trace">Execution trace</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="answer">
                  <FinalQueryAnswer
                    intent={queryIntent}
                    freightResolution={freightResolution}
                  />
                </TabsContent>
                <TabsContent value="evidence">
                  <AnswerEvidence
                    intent={queryIntent}
                    freightResolution={freightResolution}
                  />
                </TabsContent>
                <TabsContent value="trace">
                  <div className="completed-trace">
                    {executionTrace.map(({ icon: Icon, title, detail }) => (
                      <div key={title}>
                        <span>
                          <Check size={12} />
                        </span>
                        <Icon size={14} />
                        <div>
                          <strong>{title}</strong>
                          <small>{detail}</small>
                        </div>
                      </div>
                    ))}
                    {queryIntent === "freight" && (
                      <div className="trace-human">
                        <span>
                          <Check size={12} />
                        </span>
                        <UserCheck size={14} />
                        <div>
                          <strong>
                            {freightResolution === "exclude"
                              ? "Human exclusion honored"
                              : "Human assumption approved"}
                          </strong>
                          <small>
                            {freightResolution === "exclude"
                              ? "PackRight removed from landed-cost ranking · no value imputed"
                              : "Raajit Kumar · ₹2.50/kg benchmark · Bid Ledger v4"}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="actions">
                  <QueryActions onDecision={onDecision} setNotice={setNotice} />
                </TabsContent>
              </Tabs>
              <aside className="answer-action-rail">
                <span className="kicker">NEXT BEST ACTIONS</span>
                <button
                  onClick={() => {
                    setNotice(
                      queryIntent === "split"
                        ? "Balanced split added to Award Scenarios."
                        : queryIntent === "explain"
                          ? "OmniBoard data gaps highlighted in the comparison."
                          : "Lowest-cost scenario created from Answer Packet AP-014-04.",
                    );
                  }}
                >
                  <Target size={15} />
                  <span>
                    <strong>
                      {queryIntent === "split"
                        ? "Add balanced scenario"
                        : queryIntent === "explain"
                          ? "Highlight OmniBoard gaps"
                          : "Create lowest-cost scenario"}
                    </strong>
                    <small>Uses verified answer inputs</small>
                  </span>
                  <ChevronRight size={14} />
                </button>
                <button onClick={onDecision}>
                  <Layers3 size={15} />
                  <span>
                    <strong>Open Award Scenarios</strong>
                    <small>Continue the governed decision workflow</small>
                  </span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() =>
                    setNotice(
                      queryIntent === "explain"
                        ? "Missing-data clarification drafted for OmniBoard."
                        : "Vendor clarification drafted; answer packet attached as context.",
                    )
                  }
                >
                  <Send size={15} />
                  <span>
                    <strong>
                      {queryIntent === "explain"
                        ? "Request missing data"
                        : "Confirm freight with PackRight"}
                    </strong>
                    <small>Draft clarification</small>
                  </span>
                  <ChevronRight size={14} />
                </button>
                <button
                  className={saved ? "saved" : ""}
                  onClick={() => {
                    setSaved(true);
                    setNotice(
                      "Answer Packet AP-014-04 saved to the RFQ audit trail.",
                    );
                  }}
                >
                  <Save size={15} />
                  <span>
                    <strong>
                      {saved ? "Answer Packet saved" : "Save Answer Packet"}
                    </strong>
                    <small>Versioned audit artifact</small>
                  </span>
                  {saved ? <Check size={14} /> : <ChevronRight size={14} />}
                </button>
              </aside>
            </div>
            {notice && (
              <div className="query-notice success">
                <CheckCircle2 size={14} />
                {notice}
              </div>
            )}
            <div className="follow-up">
              <span>
                Follow-up uses the same visible scope and verified snapshot.
              </span>
              <button
                onClick={() => {
                  setQuery(
                    queryIntent === "split"
                      ? "What if no vendor can receive more than 50%?"
                      : queryIntent === "explain"
                        ? "What data must OmniBoard clarify?"
                        : "What if PackRight freight is ₹1.50/kg?",
                  );
                  setQueryStage("idle");
                  setNotice("");
                }}
              >
                Ask a follow-up <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function FinalQueryAnswer({
  intent,
  freightResolution,
}: {
  intent: "freight" | "split" | "explain";
  freightResolution: "benchmark" | "exclude" | null;
}) {
  if (intent === "split" && freightResolution === "exclude")
    return (
      <div className="final-answer">
        <span className="kicker">OPTIMIZED SCENARIO</span>
        <h2>60% BoxCo / 40% CorrPro is the safest diversified split.</h2>
        <p>
          The allocation costs <strong>₹8.41M</strong>, a{" "}
          <strong>₹140K (1.69%)</strong> premium over 100% BoxCo. It honors the
          buyer’s PackRight exclusion while satisfying complete line coverage
          and the 60% concentration ceiling.
        </p>
        <div className="answer-kpis">
          <div>
            <span>Total landed cost</span>
            <strong>₹8.41M</strong>
            <small>Feasible optimum</small>
          </div>
          <div>
            <span>Max supplier share</span>
            <strong>60%</strong>
            <small>Policy compliant</small>
          </div>
          <div>
            <span>Excluded supplier</span>
            <strong>PackRight</strong>
            <small>Prior human decision</small>
          </div>
        </div>
        <div className="counterfactual">
          <GitCompareArrows size={15} />
          <span>
            <strong>Material trade-off</strong>The exclusion adds ₹100K versus
            the benchmarked PackRight split and avoids imputing missing freight.
          </span>
        </div>
      </div>
    );
  if (intent === "split")
    return (
      <div className="final-answer">
        <span className="kicker">OPTIMIZED SCENARIO</span>
        <h2>60% BoxCo / 40% PackRight is the lowest-cost diversified split.</h2>
        <p>
          The allocation costs <strong>₹8.31M</strong>, only{" "}
          <strong>₹40K (0.48%)</strong> above the single-source minimum, while
          satisfying complete line coverage and the 60% supplier concentration
          ceiling.
        </p>
        <div className="answer-kpis">
          <div>
            <span>Total landed cost</span>
            <strong>₹8.31M</strong>
            <small>Feasible optimum</small>
          </div>
          <div>
            <span>Max supplier share</span>
            <strong>60%</strong>
            <small>Policy compliant</small>
          </div>
          <div>
            <span>Qualified coverage</span>
            <strong>100%</strong>
            <small>30 / 30 lines</small>
          </div>
        </div>
        <div className="counterfactual">
          <GitCompareArrows size={15} />
          <span>
            <strong>Material trade-off</strong>Diversification adds ₹40K versus
            100% BoxCo and reduces single-source exposure.
          </span>
        </div>
      </div>
    );
  if (intent === "explain")
    return (
      <div className="final-answer">
        <span className="kicker">GROUNDED EXPLANATION</span>
        <h2>
          OmniBoard is not ranked first because its low quoted rate is not fully
          comparable.
        </h2>
        <p>
          Its ₹8.44M qualified total excludes freight and one requested line is
          not quoted. Lead time is also unknown. The system therefore cannot
          treat the apparent price as a verified landed-cost winner.
        </p>
        <div className="answer-kpis">
          <div>
            <span>Quoted position</span>
            <strong>#2*</strong>
            <small>Before missing terms</small>
          </div>
          <div>
            <span>Coverage</span>
            <strong>29 / 30</strong>
            <small>1 line unquoted</small>
          </div>
          <div>
            <span>Critical gaps</span>
            <strong>2</strong>
            <small>Freight + lead time</small>
          </div>
        </div>
        <div className="counterfactual">
          <AlertTriangle size={15} />
          <span>
            <strong>Decision boundary</strong>OmniBoard can be ranked
            definitively only after freight and delivery evidence are supplied.
          </span>
        </div>
      </div>
    );
  if (freightResolution === "exclude")
    return (
      <div className="final-answer">
        <span className="kicker">DIRECT ANSWER</span>
        <h2>BoxCo is the cheapest supplier with verified landed cost.</h2>
        <p>
          PackRight is excluded from this ranking because the buyer chose not to
          impute missing freight. Its quoted <strong>₹8.21M</strong> remains
          visible, but is not treated as comparable or award-ready.
        </p>
        <div className="answer-kpis">
          <div>
            <span>Winner</span>
            <strong>BoxCo</strong>
            <small>₹8.27M landed</small>
          </div>
          <div>
            <span>Excluded</span>
            <strong>PackRight</strong>
            <small>Freight unresolved</small>
          </div>
          <div>
            <span>Human policy</span>
            <strong>No imputation</strong>
            <small>Prior review decision</small>
          </div>
        </div>
        <div className="counterfactual">
          <GitCompareArrows size={15} />
          <span>
            <strong>Decision boundary</strong>PackRight can re-enter the ranking
            when vendor-confirmed freight evidence is attached and verified.
          </span>
        </div>
      </div>
    );
  return (
    <div className="final-answer">
      <span className="kicker">DIRECT ANSWER</span>
      <h2>BoxCo is cheapest after freight at ₹8.27M.</h2>
      <p>
        PackRight is second at <strong>₹8.29M</strong> after applying the
        human-approved Pune freight benchmark. The gap is only{" "}
        <strong>₹20K (0.24%)</strong>, while BoxCo delivers five days faster.
      </p>
      <div className="answer-kpis">
        <div>
          <span>Winner</span>
          <strong>BoxCo</strong>
          <small>₹8.27M landed</small>
        </div>
        <div>
          <span>Runner-up</span>
          <strong>PackRight</strong>
          <small>₹8.29M landed</small>
        </div>
        <div>
          <span>Material trade-off</span>
          <strong>5 days</strong>
          <small>BoxCo faster</small>
        </div>
      </div>
      <div className="counterfactual">
        <GitCompareArrows size={15} />
        <span>
          <strong>Decision boundary</strong>PackRight becomes cheapest if its
          confirmed freight is below <b>₹1.87/kg</b>.
        </span>
      </div>
    </div>
  );
}

function AnswerEvidence({
  intent,
  freightResolution,
}: {
  intent: "freight" | "split" | "explain";
  freightResolution: "benchmark" | "exclude" | null;
}) {
  if (intent === "split" && freightResolution === "exclude")
    return (
      <div className="answer-evidence">
        <div className="answer-evidence-head">
          <div>
            <span className="kicker">ANSWER PACKET · AP-014-04</span>
            <h3>
              30 lines · 4 eligible vendors · 3 constraints · 1 optimization
            </h3>
          </div>
          <span>
            <ShieldCheck size={13} /> Exclusion enforced
          </span>
        </div>
        <div className="answer-evidence-grid">
          <section>
            <span className="kicker">VERIFIED INPUTS</span>
            <div>
              <FileSpreadsheet size={14} />
              <span>
                <strong>BoxCo landed cost</strong>
                <small>₹8.27M · freight included</small>
              </span>
              <b>Verified</b>
            </div>
            <div>
              <FileSpreadsheet size={14} />
              <span>
                <strong>CorrPro landed cost</strong>
                <small>₹8.62M · freight included</small>
              </span>
              <b>Verified</b>
            </div>
          </section>
          <section>
            <span className="kicker">POLICY CONTEXT</span>
            <div>
              <UserCheck size={14} />
              <span>
                <strong>PackRight exclusion</strong>
                <small>Buyer decision carried from Review Issues</small>
              </span>
              <b>Applied</b>
            </div>
            <div>
              <Calculator size={14} />
              <span>
                <strong>OR-Tools allocation</strong>
                <small>Eligible suppliers only · ≤60% each</small>
              </span>
              <b>Passed</b>
            </div>
          </section>
        </div>
        <div className="answer-calculation">
          <span className="kicker">OPTIMIZATION OUTPUT</span>
          <div>
            <span>BoxCo · 60%</span>
            <b>₹4.96M</b>
          </div>
          <div>
            <span>CorrPro · 40%</span>
            <b>₹3.45M</b>
          </div>
          <div>
            <strong>Balanced total</strong>
            <strong>₹8.41M</strong>
          </div>
        </div>
      </div>
    );
  if (intent === "split")
    return (
      <div className="answer-evidence">
        <div className="answer-evidence-head">
          <div>
            <span className="kicker">ANSWER PACKET · AP-014-04</span>
            <h3>30 lines · 5 vendors · 3 constraints · 1 optimization</h3>
          </div>
          <span>
            <ShieldCheck size={13} /> Feasibility verified
          </span>
        </div>
        <div className="answer-evidence-grid">
          <section>
            <span className="kicker">VERIFIED INPUTS</span>
            <div>
              <FileSpreadsheet size={14} />
              <span>
                <strong>Normalized landed costs</strong>
                <small>Bid Ledger · current verified values</small>
              </span>
              <b>Current</b>
            </div>
            <div>
              <ShieldCheck size={14} />
              <span>
                <strong>Technical coverage</strong>
                <small>30 / 30 mandatory lines</small>
              </span>
              <b>100%</b>
            </div>
          </section>
          <section>
            <span className="kicker">POLICY CONTEXT</span>
            <div>
              <Database size={14} />
              <span>
                <strong>Concentration ceiling</strong>
                <small>Maximum 60% per supplier</small>
              </span>
              <b>Applied</b>
            </div>
            <div>
              <Calculator size={14} />
              <span>
                <strong>OR-Tools allocation</strong>
                <small>Feasible minimum-cost split</small>
              </span>
              <b>Passed</b>
            </div>
          </section>
        </div>
        <div className="answer-calculation">
          <span className="kicker">OPTIMIZATION OUTPUT</span>
          <div>
            <span>BoxCo · 60%</span>
            <b>₹4.96M</b>
          </div>
          <div>
            <span>PackRight · 40%</span>
            <b>₹3.35M</b>
          </div>
          <div>
            <strong>Balanced total</strong>
            <strong>₹8.31M</strong>
          </div>
        </div>
      </div>
    );
  if (intent === "explain")
    return (
      <div className="answer-evidence">
        <div className="answer-evidence-head">
          <div>
            <span className="kicker">ANSWER PACKET · AP-014-04</span>
            <h3>5 ledger facts · 2 unresolved fields</h3>
          </div>
          <span>
            <ShieldCheck size={13} /> Every reason sourced
          </span>
        </div>
        <div className="answer-evidence-grid">
          <section>
            <span className="kicker">OMNIBOARD EVIDENCE</span>
            <div>
              <FileSearch size={14} />
              <span>
                <strong>Email response</strong>
                <small>“Freight extra” · no amount</small>
              </span>
              <b>99%</b>
            </div>
            <div>
              <FileSpreadsheet size={14} />
              <span>
                <strong>RFQ line coverage</strong>
                <small>29 / 30 lines quoted</small>
              </span>
              <b>Verified</b>
            </div>
          </section>
          <section>
            <span className="kicker">COMPARISON CONTEXT</span>
            <div>
              <AlertTriangle size={14} />
              <span>
                <strong>Lead time</strong>
                <small>Not provided by vendor</small>
              </span>
              <b>Missing</b>
            </div>
            <div>
              <GitCompareArrows size={14} />
              <span>
                <strong>Ranking qualification</strong>
                <small>Cannot compare landed cost safely</small>
              </span>
              <b>Active</b>
            </div>
          </section>
        </div>
      </div>
    );
  if (freightResolution === "exclude")
    return (
      <div className="answer-evidence">
        <div className="answer-evidence-head">
          <div>
            <span className="kicker">ANSWER PACKET · AP-014-04</span>
            <h3>5 sourced facts · 1 human policy decision · 1 ranking</h3>
          </div>
          <span>
            <ShieldCheck size={13} /> No missing value imputed
          </span>
        </div>
        <div className="answer-evidence-grid">
          <section>
            <span className="kicker">SOURCE EVIDENCE</span>
            <div>
              <FileSearch size={14} />
              <span>
                <strong>PackRight commercial terms</strong>
                <small>PDF p4 · “freight extra at actuals”</small>
              </span>
              <b>99%</b>
            </div>
            <div>
              <FileSpreadsheet size={14} />
              <span>
                <strong>BoxCo landed pricing</strong>
                <small>Excel row 18 · freight included</small>
              </span>
              <b>100%</b>
            </div>
          </section>
          <section>
            <span className="kicker">HUMAN DECISION CONTEXT</span>
            <div>
              <UserCheck size={14} />
              <span>
                <strong>Exclude unresolved bid</strong>
                <small>PackRight omitted from landed-cost ranking</small>
              </span>
              <b>Signed</b>
            </div>
            <div>
              <ShieldCheck size={14} />
              <span>
                <strong>Missing is not zero</strong>
                <small>No benchmark or freight amount substituted</small>
              </span>
              <b>Enforced</b>
            </div>
          </section>
        </div>
        <div className="answer-calculation">
          <span className="kicker">REPRODUCIBLE RANKING</span>
          <div>
            <span>BoxCo verified landed cost</span>
            <b>₹8.27M</b>
          </div>
          <div>
            <span>PackRight quoted cost</span>
            <b>₹8.21M + unknown freight</b>
          </div>
          <div>
            <strong>Comparable winner</strong>
            <strong>BoxCo</strong>
          </div>
        </div>
      </div>
    );
  return (
    <div className="answer-evidence">
      <div className="answer-evidence-head">
        <div>
          <span className="kicker">ANSWER PACKET · AP-014-04</span>
          <h3>7 facts · 3 context sources · 2 calculations</h3>
        </div>
        <span>
          <ShieldCheck size={13} /> 100% claims sourced
        </span>
      </div>
      <div className="answer-evidence-grid">
        <section>
          <span className="kicker">SOURCE EVIDENCE</span>
          <div>
            <FileSearch size={14} />
            <span>
              <strong>PackRight commercial terms</strong>
              <small>PDF p4 · “freight extra at actuals”</small>
            </span>
            <b>99%</b>
          </div>
          <div>
            <FileSpreadsheet size={14} />
            <span>
              <strong>BoxCo landed pricing</strong>
              <small>Excel row 18 · freight included</small>
            </span>
            <b>100%</b>
          </div>
          <div>
            <FileSpreadsheet size={14} />
            <span>
              <strong>Annual quantity</strong>
              <small>RFQ schedule · 32,000kg</small>
            </span>
            <b>Verified</b>
          </div>
        </section>
        <section>
          <span className="kicker">AGGREGATED CONTEXT</span>
          <div>
            <Database size={14} />
            <span>
              <strong>Pune benchmark</strong>
              <small>₹2.50/kg · Logistics Master v19</small>
            </span>
            <b>Valid</b>
          </div>
          <div>
            <ShieldCheck size={14} />
            <span>
              <strong>Freight Policy v4.2</strong>
              <small>Provisional benchmark permitted</small>
            </span>
            <b>Current</b>
          </div>
          <div>
            <UserCheck size={14} />
            <span>
              <strong>Human approval</strong>
              <small>Raajit Kumar · Bid Ledger v4</small>
            </span>
            <b>Signed</b>
          </div>
        </section>
      </div>
      <div className="answer-calculation">
        <span className="kicker">REPRODUCIBLE CALCULATION</span>
        <div>
          <span>PackRight quoted total</span>
          <b>₹8.21M</b>
        </div>
        <div>
          <span>32,000kg × ₹2.50 benchmark</span>
          <b>₹80K</b>
        </div>
        <div>
          <strong>PackRight landed cost</strong>
          <strong>₹8.29M</strong>
        </div>
        <div>
          <strong>BoxCo landed cost</strong>
          <strong>₹8.27M</strong>
        </div>
      </div>
    </div>
  );
}

function QueryActions({
  onDecision,
  setNotice,
}: {
  onDecision: () => void;
  setNotice: (s: string) => void;
}) {
  return (
    <div className="query-actions-grid">
      <button onClick={onDecision}>
        <Layers3 />
        <span>
          <strong>Add to Award Scenarios</strong>
          <small>
            Create a governed scenario using the verified calculation.
          </small>
        </span>
        <ArrowRight />
      </button>
      <button
        onClick={() =>
          setNotice("Filtered landed-cost comparison saved for this RFQ.")
        }
      >
        <FileSpreadsheet />
        <span>
          <strong>Save comparison view</strong>
          <small>
            Preserve the scope, filters and current Bid Ledger version.
          </small>
        </span>
        <ArrowRight />
      </button>
      <button
        onClick={() =>
          setNotice(
            "PackRight clarification drafted with the unresolved claim attached.",
          )
        }
      >
        <Send />
        <span>
          <strong>Send vendor clarification</strong>
          <small>
            Prepare a message with exact source evidence and required response.
          </small>
        </span>
        <ArrowRight />
      </button>
      <button
        onClick={() =>
          setNotice("Answer Packet AP-014-04 exported to the RFQ audit trail.")
        }
      >
        <BookOpenCheck />
        <span>
          <strong>Export Answer Packet</strong>
          <small>
            Decision-ready evidence, calculations, assumptions and trace.
          </small>
        </span>
        <ArrowRight />
      </button>
    </div>
  );
}

function Decision({
  scenario,
  setScenario,
  approved,
  setApproved,
  freightResolution,
}: {
  scenario: string;
  setScenario: (s: string) => void;
  approved: boolean;
  setApproved: (b: boolean) => void;
  freightResolution: "benchmark" | "exclude" | null;
}) {
  const diversified =
    freightResolution === "benchmark"
      ? {
          vendor: "60% BoxCo · 40% PackRight",
          cost: "₹8.31M",
          note: "Only ₹40K above lowest cost",
          risk: "Reduces concentration risk",
          blocked: false,
        }
      : freightResolution === "exclude"
        ? {
            vendor: "60% BoxCo · 40% CorrPro",
            cost: "₹8.41M",
            note: "₹140K above lowest verified cost",
            risk: "Honors PackRight exclusion",
            blocked: false,
          }
        : {
            vendor: "Awaiting PackRight freight resolution",
            cost: "—",
            note: "Cannot optimize an unverified landed cost",
            risk: "Decision-critical input unresolved",
            blocked: true,
          };
  const scenarios = [
    {
      id: "cost",
      label: "Lowest landed cost",
      vendor: "100% BoxCo",
      cost: "₹8.27M",
      note: "Saves ₹170K vs qualified baseline",
      risk: "Single-source exposure",
      blocked: false,
    },
    {
      id: "speed",
      label: "Fastest compliant",
      vendor: "100% CorrPro",
      cost: "₹8.62M",
      note: "5-day delivery across all lines",
      risk: "₹350K premium",
      blocked: false,
    },
    {
      id: "diversified",
      label: "Balanced split",
      ...diversified,
    },
  ];
  const selected = scenarios.find((s) => s.id === scenario)!;
  return (
    <>
      <Subhead
        eyebrow="DECISION ENGINE"
        title="Compare policies, not AI opinions"
        text="The optimizer generates feasible scenarios from verified facts and your explicit constraints."
      />
      {approved ? (
        <section className="approval-success">
          <div>
            <CheckCircle2 size={28} />
          </div>
          <span className="kicker">HUMAN APPROVED</span>
          <h2>Award recommendation recorded</h2>
          <p>
            {selected.vendor} · {selected.cost} landed cost
          </p>
          <div className="audit-line">
            <LockKeyhole size={14} /> Decision, evidence, assumptions and
            approver saved to the immutable audit trail.
          </div>
          <button onClick={() => setApproved(false)}>Review decision</button>
        </section>
      ) : (
        <div className="decision-grid">
          <section>
            <div className="constraint-bar">
              <span>
                <ShieldCheck size={14} /> QUALIFICATION RULES APPLIED
              </span>
              <b>100% technical compliance</b>
              <b>≤12 day lead time</b>
              <b>Concentration tested per scenario</b>
            </div>
            <div className="scenario-list">
              {scenarios.map((s) => (
                <button
                  onClick={() => setScenario(s.id)}
                  disabled={s.blocked}
                  className={
                    scenario === s.id ? "scenario selected" : "scenario"
                  }
                  key={s.id}
                >
                  <div className="radio">
                    <i />
                  </div>
                  <div>
                    <span>{s.label}</span>
                    <strong>{s.vendor}</strong>
                    <small>{s.note}</small>
                  </div>
                  <div>
                    <strong>{s.cost}</strong>
                    <small>{s.risk}</small>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <aside className="rationale-card">
            <div className="eyebrow">
              <Sparkles size={13} /> GPT-5.4 EXPLANATION
            </div>
            <h2>Why this scenario?</h2>
            <p>
              {selected.blocked
                ? "The optimizer stopped because PackRight freight is unresolved. Choose a verified single-source scenario or resolve the issue before calculating a balanced award."
                : scenario === "diversified" && freightResolution === "exclude"
                  ? "The balanced split honors the buyer’s PackRight exclusion and uses CorrPro as the second verified supplier."
                  : scenario === "diversified"
                    ? "The balanced split preserves nearly all available savings while keeping every supplier below the 60% concentration ceiling."
                    : "This scenario optimizes the selected objective while preserving the visible qualification rules and trade-offs."}
            </p>
            <dl>
              <div>
                <dt>Landed cost</dt>
                <dd>{selected.cost}</dd>
              </div>
              <div>
                <dt>Cost premium</dt>
                <dd>
                  {selected.blocked
                    ? "—"
                    : scenario === "diversified" &&
                        freightResolution === "exclude"
                      ? "1.69%"
                      : scenario === "diversified"
                        ? "0.48%"
                        : scenario === "speed"
                          ? "4.23%"
                          : "0%"}
                </dd>
              </div>
              <div>
                <dt>Qualified coverage</dt>
                <dd>{selected.blocked ? "—" : "100%"}</dd>
              </div>
              <div>
                <dt>Max supplier share</dt>
                <dd>
                  {selected.blocked
                    ? "—"
                    : scenario === "diversified"
                      ? "60%"
                      : "100%"}
                </dd>
              </div>
            </dl>
            <div className="rationale-note">
              <Target size={15} />
              <span>
                <strong>Material trade-off</strong>BoxCo is faster; PackRight
                {scenario === "diversified" && freightResolution === "exclude"
                  ? " is excluded, so CorrPro adds resilience at a ₹140K portfolio premium."
                  : scenario === "diversified"
                    ? " adds resilience at a ₹40K portfolio premium."
                    : " remains the comparison baseline for cost and speed."}
              </span>
            </div>
            <button
              className="approve-btn"
              disabled={selected.blocked}
              onClick={() => setApproved(true)}
            >
              {selected.blocked ? (
                <>
                  <LockKeyhole size={16} /> Resolve freight before approval
                </>
              ) : (
                <>
                  <Check size={16} /> Approve recommendation
                </>
              )}
            </button>
            <small className="human-note">
              AI cannot award suppliers at Control Level 2.
            </small>
          </aside>
        </div>
      )}
    </>
  );
}

function Analytics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("90d");
  const [category, setCategory] = useState<AnalyticsCategory>("all");
  const [businessUnit, setBusinessUnit] = useState("All business units");
  const [region, setRegion] = useState("All plants");
  const [rfqStatus, setRfqStatus] = useState("All RFQs");
  const [analyticsView, setAnalyticsView] = useState("buyer");
  const kpis = getBuyerKpis(period, category);
  const trend = buyerTrendByPeriod[period];
  const savingsData =
    category === "all"
      ? categorySavings
      : categorySavings.filter((item) => item.category === category);
  const scopeLabel = [
    analyticsPeriods[period],
    category === "all" ? "All categories" : category,
    businessUnit,
    region,
    rfqStatus,
  ].join(" · ");

  function resetFilters() {
    setPeriod("90d");
    setCategory("all");
    setBusinessUnit("All business units");
    setRegion("All plants");
    setRfqStatus("All RFQs");
  }

  return (
    <>
      <Subhead
        eyebrow="PORTFOLIO INTELLIGENCE"
        title="Measure decisions, trust and system quality"
        text="One governed analytics layer for procurement outcomes and the AI product operating them. Every metric is scoped to an immutable ledger snapshot."
      />

      <section className="analytics-filterbar panel">
        <div className="analytics-filter-title">
          <Filter size={15} />
          <span>
            <strong>Analytics scope</strong>
            <small>{scopeLabel}</small>
          </span>
        </div>
        <label>
          Period
          <select
            aria-label="Analytics period"
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as AnalyticsPeriod)
            }
          >
            {Object.entries(analyticsPeriods).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select
            aria-label="Analytics category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as AnalyticsCategory)
            }
          >
            <option value="all">All categories</option>
            <option>Packaging</option>
            <option>MRO</option>
            <option>IT hardware</option>
            <option>Freight</option>
          </select>
        </label>
        <label>
          Business unit
          <select
            aria-label="Analytics business unit"
            value={businessUnit}
            onChange={(event) => setBusinessUnit(event.target.value)}
          >
            <option>All business units</option>
            <option>Consumer</option>
            <option>Industrial</option>
            <option>Corporate services</option>
          </select>
        </label>
        <label>
          Plant / region
          <select
            aria-label="Analytics plant or region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option>All plants</option>
            <option>Pune</option>
            <option>Ahmedabad</option>
            <option>Chennai</option>
            <option>NCR</option>
          </select>
        </label>
        <label>
          RFQ status
          <select
            aria-label="Analytics RFQ status"
            value={rfqStatus}
            onChange={(event) => setRfqStatus(event.target.value)}
          >
            <option>All RFQs</option>
            <option>Compiling</option>
            <option>Needs review</option>
            <option>Decision-ready</option>
            <option>Award approved</option>
          </select>
        </label>
        <button className="analytics-reset" onClick={resetFilters}>
          <RefreshCcw size={13} /> Reset
        </button>
      </section>

      <section className="analytics-northstar">
        <div className="analytics-northstar-icon">
          <Target size={19} />
        </div>
        <div>
          <span>NORTH-STAR METRIC</span>
          <strong>Decision-ready RFQs per buyer-hour</strong>
          <small>
            RFQs safe for the scoped decision ÷ active buyer review hours
          </small>
        </div>
        <div className="analytics-northstar-value">
          <strong>0.46</strong>
          <span>
            <ArrowUpRight size={13} /> 44% vs manual baseline
          </span>
        </div>
        <div className="analytics-trust-note">
          <ShieldCheck size={14} />
          <span>
            <strong>Metric contract</strong>
            <small>
              Requires complete provenance and zero unresolved critical issues.
            </small>
          </span>
        </div>
      </section>

      <Tabs
        className="analytics-tabs"
        value={analyticsView}
        onValueChange={setAnalyticsView}
      >
        <div className="analytics-viewbar">
          <div>
            <span className="eyebrow">PERSONA VIEW</span>
            <strong>
              {analyticsView === "buyer"
                ? "Procurement outcomes"
                : "Product & AI operations"}
            </strong>
          </div>
          <TabsList>
            <TabsTrigger value="buyer">
              <FileSpreadsheet size={14} /> Buyer outcomes
            </TabsTrigger>
            <TabsTrigger value="product">
              <Activity size={14} /> Product & AI
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="buyer" className="analytics-tab-content">
          <div className="analytics-kpis buyer-kpis">
            <AnalyticsKpi
              icon={FileCheck2}
              label="Decision-ready RFQs"
              value={kpis.decisionReady.toLocaleString("en-IN")}
              change="+18% vs prior period"
              detail="79% of created RFQs"
              title="RFQs with complete provenance and no unresolved decision-critical issues."
            />
            <AnalyticsKpi
              icon={CircleDollarSign}
              label="Verified spend"
              value={`₹${kpis.verifiedSpend}M`}
              change="+12% coverage"
              detail="Across qualified comparisons"
              title="Addressable spend backed by verified, comparable commercial facts."
            />
            <AnalyticsKpi
              icon={TrendingUp}
              label="Savings identified"
              value={`₹${kpis.savings}M`}
              change="5.5% weighted rate"
              detail="Against qualified baseline"
              title="Difference between approved scenario and the policy-defined qualified baseline."
            />
            <AnalyticsKpi
              icon={Timer}
              label="Buyer hours saved"
              value={kpis.hoursSaved.toLocaleString("en-IN")}
              change="3.99h per ready RFQ"
              detail="Compilation + comparison"
              title="Estimated active work avoided versus the validated manual benchmark."
            />
          </div>

          <div className="analytics-grid analytics-grid-primary">
            <AnalyticsPanel
              eyebrow="VELOCITY"
              title="Decision readiness is rising as cycle time falls"
              subtitle="Weekly output and median active cycle time"
              icon={TrendingUp}
            >
              <div
                className="analytics-chart analytics-line-chart"
                role="img"
                aria-label="Decision-ready RFQs and cycle time trend"
              >
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={trend} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="#e7ece9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#718078" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 9, fill: "#718078" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: "#718078" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dfe6e2", fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Line yAxisId="left" type="monotone" dataKey="ready" name="Decision-ready RFQs" stroke="#2f8a68" strokeWidth={2.5} dot={{ r: 2 }} />
                    <Line yAxisId="right" type="monotone" dataKey="cycle" name="Cycle time (hours)" stroke="#d7ee48" strokeWidth={2.5} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel
              eyebrow="THROUGHPUT"
              title="RFQ outcome funnel"
              subtitle="Conversion from created RFQ to human-approved award"
              icon={Route}
            >
              <div className="analytics-funnel">
                {outcomeFunnel.map((item, index) => (
                  <div className="analytics-funnel-row" key={item.label}>
                    <div>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="analytics-funnel-track">
                      <i style={{ width: `${item.rate}%` }} />
                    </div>
                    <small>
                      {item.rate}%{index ? ` · ${outcomeFunnel[index - 1].value - item.value} exited` : ""}
                    </small>
                  </div>
                ))}
              </div>
              <div className="analytics-insight">
                <ArrowUpRight size={14} />
                <span>
                  <strong>Largest controllable drop: decision readiness</strong>
                  <small>
                    38 RFQs are waiting on vendor clarification or policy context.
                  </small>
                </span>
              </div>
            </AnalyticsPanel>
          </div>

          <div className="analytics-grid analytics-grid-secondary">
            <AnalyticsPanel
              eyebrow="COMMERCIAL IMPACT"
              title="Identified savings by category"
              subtitle="₹ millions against qualified baseline"
              icon={CircleDollarSign}
            >
              <div className="analytics-chart" role="img" aria-label="Savings by procurement category">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={savingsData} layout="vertical" margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#edf1ef" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: "#718078" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="category" width={76} tick={{ fontSize: 9, fill: "#42584d" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dfe6e2", fontSize: 10 }} />
                    <Bar dataKey="savings" name="Savings ₹M" fill="#2f8a68" radius={[0, 4, 4, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel
              eyebrow="BUYER EFFORT"
              title="Cycle time by workflow stage"
              subtitle="Current active hours versus manual baseline"
              icon={Clock3}
            >
              <div className="analytics-cycle">
                {cycleStages.map((stage) => (
                  <div key={stage.label}>
                    <div>
                      <span>{stage.label}</span>
                      <strong>{stage.current}h</strong>
                      <small>{Math.round((1 - stage.current / stage.baseline) * 100)}% faster</small>
                    </div>
                    <div className="analytics-cycle-track">
                      <i style={{ width: `${Math.min(100, (stage.current / stage.baseline) * 100)}%` }} />
                      <b title={`Manual baseline: ${stage.baseline} hours`} />
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel
              eyebrow="TRUST FRICTION"
              title="Why buyers intervene"
              subtitle="Share of material review issues"
              icon={PieChartIcon}
            >
              <div className="analytics-pie-layout">
                <div className="analytics-chart" role="img" aria-label="Buyer intervention issue types">
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie data={issueDrivers} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={2}>
                        {issueDrivers.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dfe6e2", fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="analytics-pie-center">
                    <strong>563</strong>
                    <span>reviews</span>
                  </div>
                </div>
                <div className="analytics-legend-list">
                  {issueDrivers.map((item) => (
                    <div key={item.name}>
                      <i style={{ background: item.color }} />
                      <span>{item.name}</span>
                      <strong>{item.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </AnalyticsPanel>
          </div>

          <AnalyticsPanel
            eyebrow="SUPPLIER INTELLIGENCE"
            title="Competitiveness and response quality"
            subtitle="Use as sourcing context—not as an autonomous supplier score"
            icon={GitCompareArrows}
            wide
          >
            <div className="analytics-table-wrap">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Win rate</th>
                    <th>Quote coverage</th>
                    <th>Median response</th>
                    <th>Price variance</th>
                    <th>Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierPerformance.map((supplier) => (
                    <tr key={supplier.supplier}>
                      <td><strong>{supplier.supplier}</strong></td>
                      <td>{supplier.winRate}</td>
                      <td>{supplier.coverage}</td>
                      <td>{supplier.response}</td>
                      <td>{supplier.variance}</td>
                      <td><span className="analytics-status">{supplier.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnalyticsPanel>
        </TabsContent>

        <TabsContent value="product" className="analytics-tab-content">
          <div className="analytics-kpis product-kpis">
            <AnalyticsKpi icon={ShieldCheck} label="Provenance coverage" value="99.2%" change="+0.7pp" detail="Material facts with source" title="Share of material ledger facts linked to inspectable source evidence." />
            <AnalyticsKpi icon={AlertTriangle} label="Decision-impact error" value="0.18%" change="-0.11pp" detail="Per decision-ready RFQ" title="Errors that can change ranking, eligibility, landed cost or allocation." inverse />
            <AnalyticsKpi icon={Target} label="Critical escalation recall" value="100%" change="Hard gate met" detail="24 / 24 eval cases" title="Share of known decision-critical uncertainty correctly routed to review." />
            <AnalyticsKpi icon={CircleDollarSign} label="Cost / ready RFQ" value="₹182" change="-14%" detail="Models + deterministic tools" title="Inference and processing cost divided by decision-ready RFQs." inverse />
            <AnalyticsKpi icon={Timer} label="P95 processing" value="3m 42s" change="-38s" detail="Artifact to compiled ledger" title="95th percentile end-to-end compilation time, excluding human review." inverse />
          </div>

          <div className="analytics-grid analytics-product-top">
            <AnalyticsPanel eyebrow="QUALITY TREND" title="Decision-chain quality, not one model score" subtitle="Weekly audited performance across four protected metrics" icon={Activity}>
              <div className="analytics-chart" role="img" aria-label="AI product quality trend">
                <ResponsiveContainer width="100%" height={235}>
                  <LineChart data={qualityTrend} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#e7ece9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#718078" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[90, 100]} tick={{ fontSize: 9, fill: "#718078" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dfe6e2", fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Line type="monotone" dataKey="extraction" name="Extraction" stroke="#2f8a68" strokeWidth={2.2} dot={false} />
                    <Line type="monotone" dataKey="mapping" name="Line mapping" stroke="#d9a83e" strokeWidth={2.2} dot={false} />
                    <Line type="monotone" dataKey="escalation" name="Escalation recall" stroke="#1b4839" strokeWidth={2.2} dot={false} />
                    <Line type="monotone" dataKey="provenance" name="Provenance" stroke="#83aa9a" strokeWidth={2.2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel eyebrow="PIPELINE PERFORMANCE" title="Latency profile by system stage" subtitle="P50 and P95 seconds; model calls dominate wall time" icon={Timer}>
              <div className="analytics-chart" role="img" aria-label="QuoteIQ pipeline latency profile">
                <ResponsiveContainer width="100%" height={235}>
                  <BarChart data={latencyProfile} layout="vertical" margin={{ top: 8, right: 18, left: 12, bottom: 0 }}>
                    <CartesianGrid stroke="#edf1ef" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: "#718078" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="stage" width={92} tick={{ fontSize: 9, fill: "#42584d" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dfe6e2", fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="p50" name="P50 seconds" fill="#84aa9b" radius={[0, 3, 3, 0]} barSize={8} />
                    <Bar dataKey="p95" name="P95 seconds" fill="#d5f24a" radius={[0, 3, 3, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsPanel>
          </div>

          <div className="analytics-grid analytics-product-middle">
            <AnalyticsPanel eyebrow="INTERVENTION ROUTER" title="Root causes of human review" subtitle="Use the cause—not the click—to improve the right system" icon={UserCheck}>
              <div className="analytics-driver-list">
                {interventionDrivers.map((driver) => (
                  <div key={driver.label}>
                    <div><span>{driver.label}</span><strong>{driver.count}</strong></div>
                    <div className="analytics-driver-track"><i style={{ width: `${driver.value}%` }} /></div>
                    <small>{driver.value}% of interventions</small>
                  </div>
                ))}
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel eyebrow="EARNED AUTONOMY" title="Control level by narrow task" subtitle="Capability ∩ policy ∩ permission = actual autonomy" icon={ShieldCheck}>
              <div className="analytics-autonomy-list">
                {autonomyTasks.map((task) => (
                  <div key={task.task}>
                    <span><strong>{task.task}</strong><small>{task.evidence}</small></span>
                    <div className="analytics-levels" aria-label={`${task.label}, autonomy level ${task.level}`}>
                      {[0, 1, 2, 3].map((level) => <i className={level <= task.level ? "active" : ""} key={level} />)}
                    </div>
                    <b>{task.label}</b>
                  </div>
                ))}
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel eyebrow="EVALUATION HEALTH" title="Protected release queue" subtitle="No production change bypasses its regression and shadow gates" icon={TestTube2}>
              <div className="analytics-eval-list">
                {evaluationQueue.map((item) => (
                  <div key={item.suite}>
                    <span className={`analytics-severity ${item.severity.toLowerCase()}`}>{item.severity}</span>
                    <span><strong>{item.suite}</strong><small>{item.cases} cases · {item.owner}</small></span>
                    <b>{item.pass}</b>
                  </div>
                ))}
              </div>
              <div className="analytics-insight safe">
                <ShieldCheck size={14} />
                <span><strong>All hard gates currently pass</strong><small>Packaging L3 remains in shadow until 1,000 cases.</small></span>
              </div>
            </AnalyticsPanel>
          </div>

          <AnalyticsPanel eyebrow="UNIT ECONOMICS" title="Model usage, reliability and cost" subtitle="Provider cost is allocated to the task and decision outcome it supports" icon={Calculator} wide>
            <div className="analytics-table-wrap">
              <table className="analytics-table">
                <thead><tr><th>Task</th><th>Model / tool</th><th>Volume</th><th>Period cost</th><th>Success</th><th>Fallback</th></tr></thead>
                <tbody>
                  {modelUsage.map((item) => (
                    <tr key={item.task}>
                      <td><strong>{item.task}</strong></td>
                      <td>{item.model}</td>
                      <td>{item.volume}</td>
                      <td>{item.cost}</td>
                      <td>{item.success}</td>
                      <td>{item.fallback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnalyticsPanel>
        </TabsContent>
      </Tabs>

      <footer className="analytics-definition-bar">
        <Database size={15} />
        <span>
          <strong>Metric lineage</strong>
          <small>
            RFQ events + versioned Bid Ledger + Evidence / Answer Packets + model and tool traces. Snapshot 29 Aug 2026, 18:42 IST. Demo data is synthetic.
          </small>
        </span>
        <span className="analytics-freshness">All sources fresh</span>
      </footer>
    </>
  );
}

function AnalyticsKpi({
  icon: Icon,
  label,
  value,
  change,
  detail,
  title,
  inverse = false,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  change: string;
  detail: string;
  title: string;
  inverse?: boolean;
}) {
  return (
    <article className="analytics-kpi" title={title}>
      <div><Icon size={15} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small className={inverse ? "inverse" : ""}>
        <ArrowUpRight size={11} /> {change}
      </small>
      <p>{detail}</p>
    </article>
  );
}

function AnalyticsPanel({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: typeof Gauge;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className={`analytics-panel panel${wide ? " analytics-wide" : ""}`}>
      <header>
        <div className="analytics-panel-icon"><Icon size={15} /></div>
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function TrustLearning() {
  const [traceStep, setTraceStep] = useState(0);
  const [packetSection, setPacketSection] = useState("decision");
  const [learningStep, setLearningStep] = useState(0);

  const trace = [
    {
      icon: ScanSearch,
      label: "Observe",
      title: "Preserve the vendor's exact statement",
      owner: "Artifact service",
      output: "Immutable source map",
      text: "PackRight's original PDF, submission timestamp, quote version and exact page coordinates are retained. The commercial fact can never become detached from its source.",
      fact: "“Prices are ex-works. Freight shall be charged extra at actuals.”",
      meta: "PackRight_quote_v3.pdf · page 4 · SHA verified",
    },
    {
      icon: FileSearch,
      label: "Interpret",
      title: "Convert the statement into typed claims",
      owner: "Gemini 2.5 Pro",
      output: "Commercial claim",
      text: "The model extracts meaning without inventing the missing number. Freight treatment is excluded; freight amount remains unknown; price basis is ex-works.",
      fact: "freight.included = false  ·  freight.amount = unknown",
      meta: "Extraction 99% · source-grounding 100%",
    },
    {
      icon: Database,
      label: "Context",
      title: "Assemble decision-time context",
      owner: "Context service",
      output: "Versioned context bundle",
      text: "The system retrieves the RFQ destination, annual quantity, approved lane benchmark, applicable policy and current rankings as they existed when the decision was made.",
      fact: "Pune Zone 2 · 32,000 kg · benchmark ₹2.50/kg",
      meta: "5 sources · newest 2 days · policy v4.2",
    },
    {
      icon: BrainCircuit,
      label: "Reason",
      title: "Interpret policy; delegate arithmetic",
      owner: "GPT-5.4 + rules",
      output: "Decision proposition",
      text: "GPT-5.4 identifies the permitted policy path. Deterministic services apply the benchmark and calculate landed cost; the LLM never performs commercial arithmetic.",
      fact: "Proposition: apply approved benchmark provisionally",
      meta: "Policy match 0.98 · calculation test passed",
    },
    {
      icon: GitCompareArrows,
      label: "Simulate",
      title: "Measure whether uncertainty matters",
      owner: "Scenario engine",
      output: "Counterfactual impact",
      text: "The engine calculates both worlds. Ignoring freight ranks PackRight #1; applying the approved benchmark moves it to #2. The assumption is therefore decision-critical.",
      fact: "₹8.21M → ₹8.29M  ·  rank #1 → #2",
      meta: "₹80K delta · award outcome changes",
    },
    {
      icon: ClipboardCheck,
      label: "Packet",
      title: "Package a decision that can be inspected",
      owner: "Trust service",
      output: "Evidence Packet",
      text: "Evidence, context, policy, calculations, assumptions, alternatives and unresolved risk are frozen together into one versioned packet.",
      fact: "Packet EP-014-03 · completeness 100%",
      meta: "12 sources · 4 calculations · 1 assumption",
    },
    {
      icon: UserCheck,
      label: "Review",
      title: "Ask for judgment at the right boundary",
      owner: "Intervention policy",
      output: "Human-verified decision",
      text: "Although extraction confidence is high, the outcome can change and policy requires buyer approval. Raajit confirms use of the approved benchmark.",
      fact: "Human decision: Apply ₹2.50/kg benchmark",
      meta: "Reason: approved procurement policy · reversible",
    },
  ];
  const current = trace[traceStep];

  const packetNav = [
    ["decision", "Decision summary", Target],
    ["evidence", "Source evidence", FileSearch],
    ["context", "Context bundle", Database],
    ["logic", "Logic & calculations", Calculator],
    ["alternatives", "Alternatives", GitCompareArrows],
    ["audit", "Audit & approvals", LockKeyhole],
  ] as const;

  const learning = [
    {
      icon: UserCheck,
      label: "Capture",
      title: "Record the intervention",
      text: "Store the complete as-of-time context, AI proposal, human choice, reason, impact and every model, prompt, policy and tool version.",
    },
    {
      icon: Route,
      label: "Classify",
      title: "Diagnose what the decision means",
      text: "This is a policy-backed context choice—not an extraction failure or a personal preference. It should improve retrieval and policy execution, not retrain document extraction.",
    },
    {
      icon: TestTube2,
      label: "Evaluate",
      title: "Turn it into a replayable test",
      text: "Create an eval requiring the system to retrieve the valid Pune benchmark, preserve the unknown vendor freight amount and correctly escalate the ranking impact.",
    },
    {
      icon: WandSparkles,
      label: "Improve",
      title: "Test the smallest safe change",
      text: "A candidate context-routing rule is tested against this case, 74 similar freight cases and the full category regression set.",
    },
    {
      icon: Workflow,
      label: "Shadow",
      title: "Observe before changing behavior",
      text: "The candidate runs silently on new corrugated-packaging RFQs. Buyers still see the existing production behavior while the system measures disagreements.",
    },
    {
      icon: CheckCircle2,
      label: "Release",
      title: "Promote within the narrowest scope",
      text: "After passing thresholds, the rule becomes eligible for PackRight + Pune Zone 2 provisional comparisons. Human approval remains required.",
    },
  ];
  const learnCurrent = learning[learningStep];
  const TraceIcon = current.icon;
  const LearnIcon = learnCurrent.icon;

  return (
    <>
      <Subhead
        eyebrow="TRUST & LEARNING LAB"
        title="Follow one decision from evidence to earned autonomy"
        text="Trust is not a confidence badge. It is an inspectable chain from source evidence to human judgment, plus a guarded learning system that improves without silently changing production behavior."
      />
      <section className="trust-thesis">
        <div className="thesis-mark">
          <ShieldCheck size={24} />
        </div>
        <div>
          <span className="kicker">THE TRUST CONTRACT</span>
          <h2>
            The AI may interpret. It may never silently establish commercial
            truth.
          </h2>
          <p>
            Every decision must be grounded, impact-tested, inspectable and
            governed before it can influence an award.
          </p>
        </div>
        <div className="trust-equation">
          <span>Evidence</span>
          <b>+</b>
          <span>Context</span>
          <b>+</b>
          <span>Impact</span>
          <b>+</b>
          <span>Human judgment</span>
          <strong>= Decision-grade truth</strong>
        </div>
      </section>
      <section className="trust-query-bridge">
        <div>
          <MessageSquareText size={17} />
          <span>
            <small>NEW TRUSTED ENTRY POINT</small>
            <strong>Ask the verified comparison</strong>
          </span>
        </div>
        <ArrowRight />
        <div>
          <ScanSearch size={17} />
          <span>
            <small>VISIBLE EXECUTION</small>
            <strong>Scope + readiness + tools</strong>
          </span>
        </div>
        <ArrowRight />
        <div>
          <BookOpenCheck size={17} />
          <span>
            <small>INSPECTABLE OUTPUT</small>
            <strong>Versioned Answer Packet</strong>
          </span>
        </div>
        <ArrowRight />
        <div>
          <LockKeyhole size={17} />
          <span>
            <small>GOVERNED ACTION</small>
            <strong>Preview + human approval</strong>
          </span>
        </div>
        <p>
          The conversational surface reuses the Verified Bid Ledger, Evidence
          Packets, intervention policy and learning router. It cannot create a
          separate version of commercial truth.
        </p>
      </section>

      <Tabs defaultValue="trace" className="trust-tabs">
        <TabsList variant="line" className="trust-tab-list">
          <TabsTrigger value="trace">
            <Workflow /> 1. Watch a decision form
          </TabsTrigger>
          <TabsTrigger value="packet">
            <BookOpenCheck /> 2. Open Evidence Packet
          </TabsTrigger>
          <TabsTrigger value="learn">
            <RefreshCcw /> 3. Watch the system learn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trace">
          <div className="trust-explainer">
            <div>
              <span className="kicker">LIVE CASE · PACKRIGHT FREIGHT</span>
              <h2>High confidence can still require a human</h2>
            </div>
            <p>
              The extraction is 99% confident. The system escalates because the
              missing amount changes the recommended supplier—not because the
              model is uncertain about the sentence.
            </p>
          </div>
          <section className="trace-shell panel">
            <div className="trace-rail">
              {trace.map(({ icon: Icon, label }, i) => (
                <button
                  key={label}
                  onClick={() => setTraceStep(i)}
                  className={`${traceStep === i ? "active" : ""} ${i < traceStep ? "visited" : ""}`}
                >
                  <span>
                    {i < traceStep ? <Check size={13} /> : <Icon size={15} />}
                  </span>
                  <small>0{i + 1}</small>
                  <strong>{label}</strong>
                </button>
              ))}
            </div>
            <div className="trace-inspector">
              <div className="trace-copy">
                <div className="trace-owner">
                  <TraceIcon size={17} />
                  <span>
                    <small>
                      STAGE {traceStep + 1} · {current.owner}
                    </small>
                    <strong>{current.output}</strong>
                  </span>
                </div>
                <h2>{current.title}</h2>
                <p>{current.text}</p>
                <div className="trace-fact">
                  <span className="kicker">DECISION ARTIFACT</span>
                  <strong>{current.fact}</strong>
                  <small>{current.meta}</small>
                </div>
                <div className="trace-actions">
                  <button
                    disabled={traceStep === 0}
                    onClick={() => setTraceStep((s) => s - 1)}
                  >
                    <ArrowLeft size={14} /> Previous
                  </button>
                  <button
                    className="dark-btn"
                    disabled={traceStep === trace.length - 1}
                    onClick={() => setTraceStep((s) => s + 1)}
                  >
                    Next stage <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="trace-visual">
                <div className="trace-document">
                  <div>
                    <span>PACKRIGHT INDUSTRIES</span>
                    <small>QUOTE · VERSION 3</small>
                  </div>
                  <p>Commercial terms</p>
                  <i>Prices are ex-works.</i>
                  <mark>Freight shall be charged extra at actuals.</mark>
                  <i>GST will be applicable separately.</i>
                </div>
                <div className="trace-context-stack">
                  <span>Context attached</span>
                  <div>
                    <Database size={13} />
                    <b>Pune Zone 2 benchmark</b>
                    <small>₹2.50/kg · valid</small>
                  </div>
                  <div>
                    <ShieldCheck size={13} />
                    <b>Freight policy v4.2</b>
                    <small>Provisional benchmark allowed</small>
                  </div>
                  <div>
                    <GitCompareArrows size={13} />
                    <b>Ranking simulation</b>
                    <small>#1 → #2 · material</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="trust-principle">
              <AlertTriangle size={15} />
              <span>
                <strong>Design principle</strong> Confidence answers “How sure
                is the interpretation?” Impact answers “Is it safe to act?” Both
                are required.
              </span>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="packet">
          <div className="trust-explainer">
            <div>
              <span className="kicker">EVIDENCE PACKET · EP-014-03</span>
              <h2>One inspectable object behind every recommendation</h2>
            </div>
            <p>
              This is not hidden chain-of-thought. It is the reproducible
              evidence, context, rules, calculations, assumptions and approvals
              that a buyer or auditor can verify.
            </p>
          </div>
          <section className="packet-shell panel">
            <aside className="packet-nav">
              <div className="packet-status">
                <ShieldCheck size={17} />
                <span>
                  <strong>Decision-ready</strong>
                  <small>12/12 required sections</small>
                </span>
              </div>
              {packetNav.map(([id, label, Icon]) => (
                <button
                  className={packetSection === id ? "active" : ""}
                  onClick={() => setPacketSection(id)}
                  key={id}
                >
                  <Icon size={14} />
                  {label}
                  {id === "decision" && <span>1</span>}
                  <ChevronRight size={13} />
                </button>
              ))}
              <div className="packet-meta">
                <span>Packet version</span>
                <strong>3 · immutable</strong>
                <span>Created</span>
                <strong>29 Aug · 18:42</strong>
                <span>Decision owner</span>
                <strong>Raajit Kumar</strong>
              </div>
            </aside>
            <div className="packet-content">
              {packetSection === "decision" && <PacketDecision />}
              {packetSection === "evidence" && <PacketEvidence />}
              {packetSection === "context" && <PacketContext />}
              {packetSection === "logic" && <PacketLogic />}
              {packetSection === "alternatives" && <PacketAlternatives />}
              {packetSection === "audit" && <PacketAudit />}
            </div>
            <aside className="packet-integrity">
              <span className="kicker">PACKET INTEGRITY</span>
              <div className="integrity-ring">
                <strong>100%</strong>
                <span>complete</span>
              </div>
              <dl>
                <div>
                  <dt>Facts sourced</dt>
                  <dd>18/18</dd>
                </div>
                <div>
                  <dt>Context fresh</dt>
                  <dd>5/5</dd>
                </div>
                <div>
                  <dt>Calculations tested</dt>
                  <dd>4/4</dd>
                </div>
                <div>
                  <dt>Assumptions visible</dt>
                  <dd>1/1</dd>
                </div>
              </dl>
              <div className="packet-warning">
                <AlertTriangle size={14} />
                <span>
                  <strong>1 governed assumption</strong>Freight benchmark
                  requires human confirmation.
                </span>
              </div>
            </aside>
          </section>
        </TabsContent>

        <TabsContent value="learn">
          <div className="trust-explainer">
            <div>
              <span className="kicker">CLOSED LEARNING LOOP</span>
              <h2>A correction becomes an eval before it becomes behavior</h2>
            </div>
            <p>
              The buyer&apos;s decision updates this RFQ immediately. It cannot
              modify production behavior until it is classified, tested,
              reviewed and released within a narrow scope.
            </p>
          </div>
          <div className="learning-warning">
            <LockKeyhole size={16} />
            <div>
              <strong>Production behavior remains unchanged</strong>
              <span>
                Human feedback is evidence for improvement—not permission for
                online self-training.
              </span>
            </div>
            <span className="locked-pill">GUARDRAIL ACTIVE</span>
          </div>
          <section className="learning-shell panel">
            <div className="human-event">
              <div className="event-avatar">RK</div>
              <div>
                <span className="kicker">HUMAN DECISION CAPTURED</span>
                <h3>Apply approved ₹2.50/kg Pune benchmark</h3>
                <p>
                  Reason: approved procurement policy · Scope: this comparison ·
                  Outcome impact: PackRight #1 → #2
                </p>
              </div>
              <span>
                <CheckCircle2 size={14} /> Verified
              </span>
            </div>
            <div className="learning-rail">
              {learning.map(({ icon: Icon, label }, i) => (
                <button
                  key={label}
                  onClick={() => setLearningStep(i)}
                  className={`${learningStep === i ? "active" : ""} ${i < learningStep ? "done" : ""}`}
                >
                  <span>
                    {i < learningStep ? (
                      <Check size={13} />
                    ) : (
                      <Icon size={15} />
                    )}
                  </span>
                  <small>0{i + 1}</small>
                  <strong>{label}</strong>
                </button>
              ))}
            </div>
            <div className="learning-inspector">
              <div className="learning-copy">
                <div className="model-icon">
                  <LearnIcon size={18} />
                </div>
                <span className="kicker">
                  CONTROLLED LEARNING · STAGE {learningStep + 1}
                </span>
                <h2>{learnCurrent.title}</h2>
                <p>{learnCurrent.text}</p>
                <div className="learning-scope">
                  <span className="kicker">LEARNING SCOPE</span>
                  <div>
                    <b>Global</b>
                    <i />
                    <b>Category</b>
                    <i />
                    <b className="selected">Vendor + lane</b>
                    <i />
                    <b>User</b>
                  </div>
                  <small>
                    Apply the narrowest scope supported by evidence.
                  </small>
                </div>
                <button
                  className="dark-btn"
                  disabled={learningStep === learning.length - 1}
                  onClick={() => setLearningStep((s) => s + 1)}
                >
                  {learningStep === learning.length - 1
                    ? "Released with approval"
                    : "Advance learning case"}
                  <ArrowRight size={14} />
                </button>
              </div>
              <div className="feedback-router">
                <span className="kicker">FEEDBACK ROUTER</span>
                <h3>What did the human actually correct?</h3>
                <div>
                  <button>Query interpretation</button>
                  <button>Evidence retrieval</button>
                  <button>Extraction error</button>
                  <button className="selected">
                    Policy-backed context <Check size={12} />
                  </button>
                  <button>Reasoning or action error</button>
                  <button>User preference / exception</button>
                </div>
                <p>
                  <Route size={13} /> Route to{" "}
                  <strong>context retrieval + policy evaluation</strong>. Do not
                  update the extraction model or silently store a preference.
                </p>
              </div>
            </div>
          </section>
          <div className="learning-bottom">
            <section className="panel eval-card">
              <div className="section-title">
                <div>
                  <span className="kicker">RELEASE GATE</span>
                  <h2>Evidence required to earn autonomy</h2>
                </div>
                <span className="assist">Exception review</span>
              </div>
              <div className="eval-metrics">
                <MetricLine
                  name="Verified task accuracy"
                  value="99.4%"
                  target="Threshold ≥99%"
                  good
                />
                <MetricLine
                  name="Critical escalation recall"
                  value="100%"
                  target="Hard threshold"
                  good
                />
                <MetricLine
                  name="Decision-impacting errors"
                  value="0 / 600"
                  target="Hard threshold"
                  good
                />
                <MetricLine
                  name="Buyer override rate"
                  value="0.7%"
                  target="Threshold <1%"
                  good
                />
              </div>
            </section>
            <section className="panel scope-card">
              <span className="kicker">WHAT THE SYSTEM LEARNS</span>
              <h2>Different signals update different systems</h2>
              <div>
                <span>Fact correction</span>
                <ArrowRight size={12} />
                <b>Extraction or mapping eval</b>
              </div>
              <div className="active">
                <span>Policy context</span>
                <ArrowRight size={12} />
                <b>Retrieval + rules</b>
              </div>
              <div>
                <span>Preference override</span>
                <ArrowRight size={12} />
                <b>User / org memory</b>
              </div>
              <div>
                <span>One-off exception</span>
                <ArrowRight size={12} />
                <b>Audit only</b>
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function PacketDecision() {
  return (
    <div className="packet-section">
      <span className="kicker">DECISION SUMMARY</span>
      <h2>Balanced award · 60% BoxCo / 40% PackRight</h2>
      <p className="packet-lede">
        Recommend a diversified award at <strong>₹8.31M landed cost</strong>. It
        preserves 99.5% of available savings while keeping every supplier below
        the 60% concentration ceiling.
      </p>
      <div className="packet-kpis">
        <div>
          <span>Landed cost</span>
          <strong>₹8.31M</strong>
          <small>₹40K above lowest</small>
        </div>
        <div>
          <span>Qualified coverage</span>
          <strong>100%</strong>
          <small>30 / 30 lines</small>
        </div>
        <div>
          <span>Max supplier share</span>
          <strong>60%</strong>
          <small>Policy compliant</small>
        </div>
      </div>
      <div className="packet-assumption">
        <AlertTriangle size={16} />
        <span>
          <strong>Governed assumption</strong>PackRight freight was not quoted.
          Approved Pune Zone 2 benchmark of ₹2.50/kg is applied provisionally
          and requires buyer confirmation.
        </span>
      </div>
      <div className="packet-rationale">
        <span className="kicker">WHY THIS DECISION</span>
        <p>
          BoxCo provides lower landed cost and faster delivery. PackRight adds
          supply resilience at a 0.48% portfolio premium. The split satisfies
          technical, delivery and concentration constraints.
        </p>
      </div>
    </div>
  );
}
function PacketEvidence() {
  return (
    <div className="packet-section">
      <span className="kicker">SOURCE EVIDENCE · 18 FACTS</span>
      <h2>Every commercial fact retains its source map</h2>
      <div className="evidence-list">
        <div>
          <FileSearch />
          <span>
            <strong>PackRight freight treatment</strong>
            <small>“Freight shall be charged extra at actuals.”</small>
            <em>PDF · p4 · extraction 99%</em>
          </span>
        </div>
        <div>
          <FileSpreadsheet />
          <span>
            <strong>BoxCo normalized unit price</strong>
            <small>₹42.40/kg · freight included</small>
            <em>Excel · row 18 · extraction 100%</em>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <strong>Technical compliance</strong>
            <small>Both suppliers meet 30/30 mandatory lines</small>
            <em>RFQ checklist · human verified</em>
          </span>
        </div>
      </div>
      <div className="packet-note">
        <ShieldCheck size={14} /> No recommendation can cite a fact without
        valid provenance.
      </div>
    </div>
  );
}
function PacketContext() {
  return (
    <div className="packet-section">
      <span className="kicker">AS-OF-TIME CONTEXT · 5 SOURCES</span>
      <h2>Only context available at decision time</h2>
      <div className="context-list">
        <div>
          <span>RFQ delivery destination</span>
          <strong>Pune Zone 2</strong>
          <small>RFQ-2027-014 · current</small>
        </div>
        <div>
          <span>Approved freight benchmark</span>
          <strong>₹2.50/kg</strong>
          <small>Logistics master · valid until 30 Sep</small>
        </div>
        <div>
          <span>Freight policy</span>
          <strong>Version 4.2</strong>
          <small>Provisional benchmark permitted</small>
        </div>
        <div>
          <span>Annual quantity</span>
          <strong>32,000 kg</strong>
          <small>RFQ schedule · verified</small>
        </div>
        <div>
          <span>Supplier concentration ceiling</span>
          <strong>60%</strong>
          <small>Sourcing policy · mandatory</small>
        </div>
      </div>
      <div className="packet-note">
        <Clock3 size={14} /> Context snapshot frozen at 29 Aug, 18:41 UTC to
        prevent future-data leakage.
      </div>
    </div>
  );
}
function PacketLogic() {
  return (
    <div className="packet-section">
      <span className="kicker">REPRODUCIBLE LOGIC</span>
      <h2>Model interpretation separated from computation</h2>
      <div className="logic-flow">
        <div>
          <BrainCircuit />
          <span>
            <small>GPT-5.4</small>
            <strong>Policy path</strong>
            <em>Benchmark permitted</em>
          </span>
        </div>
        <ArrowRight />
        <div>
          <Calculator />
          <span>
            <small>Rules engine</small>
            <strong>Landed cost</strong>
            <em>₹8.21M + ₹80K</em>
          </span>
        </div>
        <ArrowRight />
        <div>
          <GitCompareArrows />
          <span>
            <small>Optimizer</small>
            <strong>New ranking</strong>
            <em>#1 → #2</em>
          </span>
        </div>
      </div>
      <div className="calculation-table">
        <div>
          <span>Quoted commercial total</span>
          <b>₹8.21M</b>
        </div>
        <div>
          <span>Freight: 32,000kg × ₹2.50</span>
          <b>₹80K</b>
        </div>
        <div>
          <span>Normalized landed cost</span>
          <b>₹8.29M</b>
        </div>
      </div>
      <div className="packet-note">
        <Calculator size={14} /> LLMs select the valid tool path. Typed services
        perform and test all arithmetic.
      </div>
    </div>
  );
}
function PacketAlternatives() {
  return (
    <div className="packet-section">
      <span className="kicker">COUNTERFACTUALS</span>
      <h2>Show what changes when assumptions change</h2>
      <div className="alternative-list">
        <div>
          <span>Ignore freight</span>
          <strong>PackRight #1 · ₹8.21M</strong>
          <small className="danger">Invalid: understates landed cost</small>
        </div>
        <div className="selected">
          <span>Apply approved benchmark</span>
          <strong>PackRight #2 · ₹8.29M</strong>
          <small>Recommended provisional treatment</small>
        </div>
        <div>
          <span>Exclude PackRight</span>
          <strong>BoxCo #1 · ₹8.27M</strong>
          <small>Valid but reduces competition</small>
        </div>
        <div>
          <span>Wait for clarification</span>
          <strong>Decision blocked</strong>
          <small>Highest certainty · adds cycle time</small>
        </div>
      </div>
      <div className="packet-note">
        <GitCompareArrows size={14} /> The benchmark changes the leader, so the
        assumption is classified as decision-critical.
      </div>
    </div>
  );
}
function PacketAudit() {
  return (
    <div className="packet-section">
      <span className="kicker">IMMUTABLE AUDIT TRAIL</span>
      <h2>Who decided what, using which system version</h2>
      <div className="audit-timeline">
        <div>
          <span />
          <div>
            <strong>Claim extracted</strong>
            <small>Gemini 2.5 Pro · prompt qc-extract-2.8</small>
            <em>18:38:12</em>
          </div>
        </div>
        <div>
          <span />
          <div>
            <strong>Context bundle assembled</strong>
            <small>Policy v4.2 · benchmark master v19</small>
            <em>18:38:14</em>
          </div>
        </div>
        <div>
          <span />
          <div>
            <strong>Impact simulation passed</strong>
            <small>Normalizer 3.4 · optimizer 1.9</small>
            <em>18:38:15</em>
          </div>
        </div>
        <div>
          <span className="human" />
          <div>
            <strong>Human confirmed benchmark</strong>
            <small>Raajit Kumar · reason: approved policy</small>
            <em>18:42:06</em>
          </div>
        </div>
      </div>
      <div className="packet-note">
        <LockKeyhole size={14} /> Packet version 3 is immutable. Any change
        creates a new linked version.
      </div>
    </div>
  );
}

function Documentation({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("overview");
  const pages = [
    {
      id: "overview",
      category: "Start here",
      title: "Problem statement & product overview",
      summary:
        "Why Quote Compiler exists, who it serves and the business outcome it creates.",
      keywords:
        "problem messy quotes procurement buyer business overview value proposition",
    },
    {
      id: "scope",
      category: "Start here",
      title: "Product scope & boundaries",
      summary:
        "What the current product does, supported quote sources and deliberate non-goals.",
      keywords:
        "scope pdf excel image word email non goals supplier award outreach",
    },
    {
      id: "journey",
      category: "Start here",
      title: "End-to-end buyer journey",
      summary:
        "The complete Compile → Verify → Compare → Ask → Decide workflow.",
      keywords: "journey workflow compile verify compare ask award",
    },
    {
      id: "compiler",
      category: "Core product",
      title: "Quote compilation",
      summary: "How vendor documents become source-grounded commercial claims.",
      keywords: "extraction claims gemini pdf photo document compile",
    },
    {
      id: "ledger",
      category: "Core product",
      title: "Verified Bid Ledger",
      summary:
        "The canonical, versioned commercial data layer behind every product view.",
      keywords: "ledger canonical claims source map status version provenance",
    },
    {
      id: "readiness",
      category: "Core product",
      title: "Decision readiness & HITL",
      summary:
        "How the product decides what can be automated and what requires buyer judgment.",
      keywords: "human loop readiness confidence impact policy review issues",
    },
    {
      id: "compare",
      category: "Workflows",
      title: "Compare Bids",
      summary:
        "Side-by-side normalized comparison with cell-level evidence and transformations.",
      keywords: "comparison matrix normalized price unit freight evidence cell",
    },
    {
      id: "ask",
      category: "Workflows",
      title: "Ask the verified comparison",
      summary: "The Ask → Verify → Act conversational decision workflow.",
      keywords:
        "query answer execution trace context answer packet actions provisional blocked",
    },
    {
      id: "decision",
      category: "Workflows",
      title: "Award scenarios",
      summary:
        "Deterministic scenario generation, trade-offs and human approval.",
      keywords:
        "award scenario optimizer OR tools cost speed split concentration",
    },
    {
      id: "analytics",
      category: "Workflows",
      title: "Analytics",
      summary:
        "Buyer outcomes and product/AI operating health in one governed measurement layer.",
      keywords:
        "analytics dashboard savings spend cycle time throughput quality provenance latency cost filters autonomy",
    },
    {
      id: "packets",
      category: "Trust system",
      title: "Evidence & Answer Packets",
      summary:
        "The inspectable artifacts behind decisions and conversational answers.",
      keywords: "packet evidence context assumptions calculations audit answer",
    },
    {
      id: "learning",
      category: "Trust system",
      title: "Trust & closed-loop learning",
      summary:
        "How corrections become evaluated improvements without unsafe online learning.",
      keywords: "learning correction feedback eval shadow release autonomy",
    },
    {
      id: "models",
      category: "System design",
      title: "Models, tools & responsibilities",
      summary:
        "Exactly which AI model or deterministic service performs each task.",
      keywords: "gemini gpt text embedding deterministic OR tools model router",
    },
    {
      id: "logic",
      category: "System design",
      title: "Decision logic & governance",
      summary: "Confidence, impact, policy, reversibility and autonomy rules.",
      keywords:
        "decision logic governance confidence impact policy reversibility",
    },
    {
      id: "metrics",
      category: "System design",
      title: "Success metrics",
      summary:
        "North-star, quality, trust, efficiency and autonomy measurements.",
      keywords:
        "metrics north star decision ready errors interventions provenance override",
    },
    {
      id: "glossary",
      category: "Reference",
      title: "Glossary",
      summary: "Definitions of the product's core procurement and AI concepts.",
      keywords: "definitions glossary claim context ledger packet readiness",
    },
  ];
  const normalized = search.trim().toLowerCase();
  const matches = normalized
    ? pages.filter((page) =>
        `${page.title} ${page.summary} ${page.keywords}`
          .toLowerCase()
          .includes(normalized),
      )
    : pages;
  const categories = Array.from(new Set(pages.map((page) => page.category)));
  const selected = pages.find((page) => page.id === active)!;

  return (
    <>
      <div className="docs-head">
        <div>
          <span className="eyebrow">
            QUOTE COMPILER · PRODUCT DOCUMENTATION
          </span>
          <h1>Understand the product from problem to production controls</h1>
          <p>
            Business overview, workflow guidance, trust architecture, decision
            logic, models and success measures—grounded only in the product you
            can explore here.
          </p>
        </div>
        <div className="docs-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search documentation…"
            aria-label="Search product documentation"
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="docs-layout">
        <aside className="docs-nav panel">
          {normalized ? (
            <>
              <span className="docs-nav-title">
                {matches.length} SEARCH RESULT{matches.length === 1 ? "" : "S"}
              </span>
              {matches.length ? (
                matches.map((page) => (
                  <button
                    key={page.id}
                    className={active === page.id ? "active" : ""}
                    onClick={() => {
                      setActive(page.id);
                      setSearch("");
                    }}
                  >
                    <Search size={13} />
                    <span>
                      <strong>{page.title}</strong>
                      <small>{page.summary}</small>
                    </span>
                  </button>
                ))
              ) : (
                <div className="docs-empty">
                  <Search size={18} />
                  <strong>No documentation found</strong>
                  <span>Try “model”, “evidence”, “award” or “metric”.</span>
                </div>
              )}
            </>
          ) : (
            categories.map((category) => (
              <div className="docs-nav-group" key={category}>
                <span className="docs-nav-title">{category}</span>
                {pages
                  .filter((page) => page.category === category)
                  .map((page) => (
                    <button
                      key={page.id}
                      className={active === page.id ? "active" : ""}
                      onClick={() => setActive(page.id)}
                    >
                      <span>
                        <strong>{page.title}</strong>
                        <small>{page.summary}</small>
                      </span>
                      <ChevronRight size={13} />
                    </button>
                  ))}
              </div>
            ))
          )}
        </aside>
        <article className="docs-article panel">
          <div className="docs-breadcrumb">
            <BookOpenCheck size={13} /> Documentation <ChevronRight size={11} />{" "}
            {selected.category} <ChevronRight size={11} />{" "}
            <strong>{selected.title}</strong>
          </div>
          <DocArticle id={active} onNavigate={onNavigate} />
          <div className="docs-feedback">
            <span>
              <strong>Documentation contract</strong>
              <small>
                This page describes capabilities present in the product. It does
                not claim autonomous awarding, silent learning or unsupported
                workflows.
              </small>
            </span>
            <ShieldCheck size={18} />
          </div>
        </article>
      </div>
    </>
  );
}

function DocArticle({
  id,
  onNavigate,
}: {
  id: string;
  onNavigate: (view: View) => void;
}) {
  if (id === "overview")
    return (
      <div className="doc-body">
        <span className="doc-label">START HERE · 6 MIN READ</span>
        <h1>Problem statement & product overview</h1>
        <p className="doc-lede">
          Quote Compiler converts inconsistent vendor responses into a
          normalized, evidence-backed comparison that enterprise buyers can
          trust and act on.
        </p>
        <DocCallout icon={Target} title="The business problem">
          A category buyer may receive the same RFQ response as an Excel with
          different columns, a PDF with commercial terms in footnotes, a Word
          document, a phone photograph or a terse email. Manually rebuilding
          these into one spreadsheet is slow, error-prone and difficult to
          audit.
        </DocCallout>
        <h2>What the product does</h2>
        <p>
          The product starts with an existing RFQ and vendor responses. It
          extracts commercial claims, maps them to requested lines, normalizes
          comparable values, validates the result and preserves the original
          evidence. Buyers resolve only material ambiguity, compare verified
          bids, ask grounded questions and prepare award scenarios.
        </p>
        <div className="doc-outcomes">
          <div>
            <ShieldCheck />
            <strong>Trusted comparison</strong>
            <span>
              Every important value remains traceable to source evidence.
            </span>
          </div>
          <div>
            <Clock3 />
            <strong>Lower buyer effort</strong>
            <span>
              Review focuses on issues capable of changing the decision.
            </span>
          </div>
          <div>
            <GitCompareArrows />
            <strong>Defensible award</strong>
            <span>
              Scenarios expose cost, delivery, compliance and concentration
              trade-offs.
            </span>
          </div>
        </div>
        <h2>Primary user</h2>
        <p>
          The core user is an enterprise category buyer responsible for
          comparing supplier quotations and preparing a defensible sourcing
          recommendation. The current demonstration uses a corrugated-packaging
          RFQ with 30 lines, five vendors and approximately ₹8.4M estimated
          spend.
        </p>
        <h2>Product thesis</h2>
        <blockquote>
          The hard problem is not generating an RFQ. It is establishing
          commercial truth from messy supplier responses.
        </blockquote>
        <p>
          Quote Compiler therefore behaves like a compiler: vendor documents are
          source inputs; commercial claims are the intermediate representation;
          validation and normalization are the type system; the Verified Bid
          Ledger is the durable output; and comparison, questions and decisions
          are views over that ledger.
        </p>
        <button className="doc-link" onClick={() => onNavigate("overview")}>
          Open the Command Center <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "scope")
    return (
      <div className="doc-body">
        <span className="doc-label">START HERE · SCOPE</span>
        <h1>Product scope & boundaries</h1>
        <p className="doc-lede">
          The product is intentionally narrow: turn existing RFQs and messy
          supplier quotations into decision-grade comparison data.
        </p>
        <h2>Quote sources represented</h2>
        <div className="doc-chip-grid">
          <span>PDF quotations</span>
          <span>Excel workbooks</span>
          <span>Phone photographs</span>
          <span>Word documents</span>
          <span>Email responses</span>
        </div>
        <h2>Included workflow</h2>
        <DocSteps
          items={[
            "Compile commercial claims from vendor responses",
            "Map claims to RFQ lines",
            "Normalize price, UOM, freight, discount and commercial terms",
            "Validate and preserve source provenance",
            "Route decision-critical uncertainty to human review",
            "Compare verified bids",
            "Ask grounded questions over the comparison",
            "Generate and approve award scenarios",
          ]}
        />
        <h2>Current boundaries</h2>
        <div className="doc-boundaries">
          <div>
            <CheckCircle2 />
            <span>
              <strong>Included</strong>Comparison preparation, evidence lookup,
              HITL verification, decision scenarios and governed learning.
            </span>
          </div>
          <div>
            <X />
            <span>
              <strong>Not included</strong>Supplier discovery, RFQ authoring,
              vendor outreach, reverse auctions, contract management, PO
              creation or autonomous negotiation.
            </span>
          </div>
          <div>
            <LockKeyhole />
            <span>
              <strong>Explicit control</strong>The product operates at AI
              Control Level 2. It cannot autonomously award a supplier.
            </span>
          </div>
        </div>
        <DocCallout icon={AlertTriangle} title="Core data rule">
          Missing does not mean zero. Ambiguous does not mean assumed. A value
          that cannot be compiled safely remains unresolved.
        </DocCallout>
      </div>
    );
  if (id === "journey")
    return (
      <div className="doc-body">
        <span className="doc-label">START HERE · WORKFLOW</span>
        <h1>End-to-end buyer journey</h1>
        <p className="doc-lede">
          The product moves the buyer through three visible phases: Compile,
          Verify and Decide.
        </p>
        <div className="doc-journey">
          <div>
            <span>01</span>
            <strong>Compile</strong>
            <p>Process vendor responses into claims and map them to the RFQ.</p>
          </div>
          <ArrowRight />
          <div>
            <span>02</span>
            <strong>Verify</strong>
            <p>
              Surface only ambiguity that can materially affect the sourcing
              outcome.
            </p>
          </div>
          <ArrowRight />
          <div>
            <span>03</span>
            <strong>Decide</strong>
            <p>
              Compare, ask questions, simulate policy-constrained awards and
              approve.
            </p>
          </div>
        </div>
        <h2>Detailed journey</h2>
        <DocSteps
          items={[
            "Command Center reports coverage, verification and decision readiness.",
            "Review Issues orders buyer attention by decision impact rather than document order.",
            "Resolving an issue updates the Bid Ledger and downstream calculations.",
            "Compare Bids presents normalized values; any cell opens its evidence and transformation trace.",
            "Ask the verified comparison checks readiness before answering and may block or request approval.",
            "Award Scenarios compares lowest cost, fastest compliant and balanced split options.",
            "The buyer approves the recommendation; the evidence, assumptions and approval are recorded.",
            "Human corrections enter the guarded learning loop as evaluation cases.",
          ]}
        />
        <button className="doc-link" onClick={() => onNavigate("review")}>
          Open Review Issues <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "compiler")
    return (
      <div className="doc-body">
        <span className="doc-label">CORE PRODUCT</span>
        <h1>Quote compilation</h1>
        <p className="doc-lede">
          Compilation turns vendor language into typed claims without allowing
          an AI interpretation to silently become commercial truth.
        </p>
        <DocFlow
          items={[
            "Vendor source",
            "Commercial claim",
            "RFQ alignment",
            "Normalization",
            "Validation",
            "Bid Ledger",
          ]}
        />
        <h2>Claim extraction</h2>
        <p>
          Gemini 2.5 Pro reads mixed-layout documents and extracts
          source-grounded commercial claims such as quoted price, freight
          treatment, discount conditions, payment terms and delivery
          commitments. A claim retains its raw wording and source location.
        </p>
        <h2>RFQ alignment</h2>
        <p>
          <code>text-embedding-3-large</code> retrieves likely RFQ line
          candidates. GPT-5.4 adjudicates only ambiguous mappings where
          identifiers, attributes and deterministic rules are insufficient.
          High-impact ambiguity is routed to a buyer.
        </p>
        <h2>Normalization and validation</h2>
        <p>
          Deterministic services handle currency, units of measure, taxes,
          discounts, totals and arithmetic reconciliation. The language model
          selects a valid tool path or explains results; it does not perform the
          commercial calculation itself.
        </p>
        <DocCallout icon={ShieldCheck} title="Compiler rule">
          AI output is interpreted data. Only validated or human-approved facts
          become decision-grade ledger entries.
        </DocCallout>
      </div>
    );
  if (id === "ledger")
    return (
      <div className="doc-body">
        <span className="doc-label">CORE PRODUCT</span>
        <h1>Verified Bid Ledger</h1>
        <p className="doc-lede">
          The Bid Ledger is the canonical, versioned record connecting what a
          vendor said to how the product interpreted, normalized and used it.
        </p>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Example</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Raw claim</td>
              <td>“₹42/kg”</td>
              <td>Preserves vendor wording</td>
            </tr>
            <tr>
              <td>Canonical value</td>
              <td>₹42/kg</td>
              <td>Creates typed comparison data</td>
            </tr>
            <tr>
              <td>RFQ mapping</td>
              <td>PKG-001</td>
              <td>Connects vendor and requested lines</td>
            </tr>
            <tr>
              <td>Conditions</td>
              <td>Freight excluded</td>
              <td>Prevents false equivalence</td>
            </tr>
            <tr>
              <td>Source map</td>
              <td>PDF page 4</td>
              <td>Allows evidence inspection</td>
            </tr>
            <tr>
              <td>Verification</td>
              <td>Human verified</td>
              <td>Signals decision readiness</td>
            </tr>
            <tr>
              <td>Version</td>
              <td>Bid Ledger v4</td>
              <td>Creates an immutable audit trail</td>
            </tr>
          </tbody>
        </table>
        <h2>Fact lifecycle</h2>
        <DocFlow
          items={[
            "Extracted",
            "Interpreted",
            "Validated",
            "Verified",
            "Decision-used",
          ]}
        />
        <p>
          Verification can be deterministic, AI-supported or explicitly human.
          Any material edit creates a new linked version so downstream
          comparisons and packets can identify exactly which facts were used.
        </p>
        <button className="doc-link" onClick={() => onNavigate("compare")}>
          Inspect a comparison cell <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "readiness")
    return (
      <div className="doc-body">
        <span className="doc-label">CORE PRODUCT</span>
        <h1>Decision readiness & human review</h1>
        <p className="doc-lede">
          The product does not ask buyers to approve everything. It escalates
          only uncertainty that matters to the decision or is required by
          policy.
        </p>
        <h2>Decision Readiness</h2>
        <p>
          The Command Center separates quote coverage, commercial verification,
          technical compliance, unresolved assumptions and decision-critical
          issues. A recommendation is blocked when unresolved uncertainty can
          change the award.
        </p>
        <div className="doc-formula">
          <span>Model confidence</span>
          <b>×</b>
          <span>Decision impact</span>
          <b>×</b>
          <span>Policy</span>
          <b>×</b>
          <span>Reversibility</span>
          <strong>= Intervention route</strong>
        </div>
        <h2>Why confidence is not enough</h2>
        <p>
          PackRight’s freight statement is extracted with 99% confidence, yet it
          requires review because the missing amount can move the supplier from
          #1 to #3. Confidence measures interpretation certainty; impact
          determines whether it is safe to act.
        </p>
        <h2>Review outcomes</h2>
        <ul>
          <li>Apply approved context such as a lane benchmark.</li>
          <li>Exclude an unresolved vendor from a specific ranking.</li>
          <li>Request vendor clarification.</li>
          <li>Map a vendor item to the correct RFQ line.</li>
          <li>Confirm the meaning of an ambiguous commercial term.</li>
        </ul>
        <button className="doc-link" onClick={() => onNavigate("review")}>
          Open decision-critical review <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "compare")
    return (
      <div className="doc-body">
        <span className="doc-label">WORKFLOW</span>
        <h1>Compare Bids</h1>
        <p className="doc-lede">
          The comparison matrix is a view over the Bid Ledger, not a spreadsheet
          independently populated by an LLM.
        </p>
        <h2>What the buyer sees</h2>
        <ul>
          <li>RFQ line and canonical specification.</li>
          <li>Normalized vendor prices on a comparable basis.</li>
          <li>Landed-cost ranking and qualifications.</li>
          <li>Freight, lead time, payment and compliance terms.</li>
          <li>Verification status and unresolved assumptions.</li>
        </ul>
        <h2>Evidence interaction</h2>
        <p>
          Clicking a commercial cell opens a provenance panel containing the raw
          quote, source document location, applied discount, normalized value,
          model extraction trace, line mapping and deterministic transformation.
        </p>
        <DocCallout icon={AlertTriangle} title="Provisional ranking">
          Before the Pune freight benchmark is approved, PackRight’s displayed
          landed cost is qualified as ex-freight. After approval, the comparison
          updates to Bid Ledger v4 and PackRight moves to #2 at ₹8.29M. If the
          buyer excludes PackRight instead, it remains visible but is removed
          from landed-cost ranking and downstream optimization.
        </DocCallout>
        <button className="doc-link" onClick={() => onNavigate("compare")}>
          Open Compare Bids <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "ask")
    return (
      <div className="doc-body">
        <span className="doc-label">WORKFLOW · ASK → VERIFY → ACT</span>
        <h1>Ask the verified comparison</h1>
        <p className="doc-lede">
          The conversational surface is a governed entry point into comparison,
          analysis and action—not a standalone chatbot.
        </p>
        <h2>Query context</h2>
        <p>
          The buyer can see the active vendors, RFQ lines, verified-only
          setting, normalization basis, tax treatment and Bid Ledger snapshot.
          Conversational assumptions remain visible and cannot silently
          overwrite the ledger.
        </p>
        <h2>Verified Execution Trace</h2>
        <DocSteps
          items={[
            "Scope the question and business objective.",
            "Identify required facts and constraints.",
            "Check decision readiness.",
            "Retrieve approved evidence, policy and context.",
            "Run deterministic calculations or optimization.",
            "Test counterfactual impact and answer safety.",
          ]}
        />
        <p>
          The trace shows reproducible actions and artifacts, not private model
          chain-of-thought.
        </p>
        <h2>Answer states</h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>State</th>
              <th>Meaning</th>
              <th>Product behaviour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Informational</td>
              <td>Safe to explain</td>
              <td>Answer with cited facts</td>
            </tr>
            <tr>
              <td>Provisional</td>
              <td>Depends on a visible assumption</td>
              <td>Show ranges and resolution options</td>
            </tr>
            <tr>
              <td>Decision-grade</td>
              <td>Critical inputs verified</td>
              <td>Create a versioned Answer Packet</td>
            </tr>
            <tr>
              <td>Blocked</td>
              <td>Evidence is insufficient</td>
              <td>Do not fabricate a definitive result</td>
            </tr>
          </tbody>
        </table>
        <h2>Action levels</h2>
        <div className="doc-three">
          <div>
            <strong>Read</strong>
            <span>
              Inspect, compare, explain and calculate without changing state.
            </span>
          </div>
          <div>
            <strong>Propose</strong>
            <span>Preview a benchmark, clarification, view or scenario.</span>
          </div>
          <div>
            <strong>Commit</strong>
            <span>
              Require approval, create a new ledger version and record the
              action.
            </span>
          </div>
        </div>
        <button className="doc-link" onClick={() => onNavigate("compare")}>
          Try Ask → Verify → Act <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "decision")
    return (
      <div className="doc-body">
        <span className="doc-label">WORKFLOW</span>
        <h1>Award scenarios</h1>
        <p className="doc-lede">
          Award selection is treated as a constrained optimization problem
          followed by a human decision—not an opaque AI recommendation.
        </p>
        <h2>Scenario types in the product</h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Outcome</th>
              <th>Trade-off</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lowest landed cost</td>
              <td>100% BoxCo · ₹8.27M</td>
              <td>Single-source exposure</td>
            </tr>
            <tr>
              <td>Fastest compliant</td>
              <td>100% CorrPro · ₹8.62M</td>
              <td>₹350K cost premium</td>
            </tr>
            <tr>
              <td>Balanced split</td>
              <td>
                60% BoxCo / 40% PackRight · ₹8.31M after benchmark approval
              </td>
              <td>Uses CorrPro instead if PackRight is explicitly excluded</td>
            </tr>
          </tbody>
        </table>
        <h2>Qualification and scenario rules</h2>
        <div className="doc-chip-grid">
          <span>100% technical compliance</span>
          <span>≤12-day lead time</span>
          <span>≤60% concentration for diversified scenarios</span>
        </div>
        <p>
          Single-source options remain visible as explicit cost or speed
          benchmarks and carry concentration risk. OR-Tools generates feasible
          diversified allocations only from eligible, verified suppliers.
          GPT-5.4 explains the material trade-offs using verified outputs. The
          buyer approves the recommendation; AI Control Level 2 prevents
          autonomous award execution.
        </p>
        <button className="doc-link" onClick={() => onNavigate("decision")}>
          Open Award Scenarios <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "analytics")
    return (
      <div className="doc-body">
        <span className="doc-label">WORKFLOW</span>
        <h1>Analytics</h1>
        <p className="doc-lede">
          Analytics connects procurement outcomes to the quality, cost and
          control posture of the system producing them. It deliberately keeps
          the enterprise buyer view separate from the product and AI operations
          view while preserving one filter scope and one metric lineage.
        </p>
        <h2>Buyer outcomes</h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Metric or view</th>
              <th>Decision supported</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Are we moving more qualified work?</td>
              <td>Decision-ready RFQs, outcome funnel and cycle time</td>
              <td>Capacity and workflow improvement</td>
            </tr>
            <tr>
              <td>Is the value material?</td>
              <td>Verified spend, identified savings and hours saved</td>
              <td>Adoption and category prioritization</td>
            </tr>
            <tr>
              <td>Where is trust friction?</td>
              <td>Intervention drivers and supplier response quality</td>
              <td>Clarification, policy and sourcing action</td>
            </tr>
          </tbody>
        </table>
        <h2>Product & AI operations</h2>
        <p>
          Product managers see provenance coverage, decision-impact error,
          critical escalation recall, cost per decision-ready RFQ and P95
          processing time. Quality trend, stage latency, intervention causes,
          task-level autonomy, protected evaluation gates and model unit
          economics make regressions diagnosable rather than hiding them inside
          a blended accuracy score.
        </p>
        <h2>Scope and metric contracts</h2>
        <div className="doc-chip-grid">
          <span>Period</span>
          <span>Category</span>
          <span>Business unit</span>
          <span>Plant / region</span>
          <span>RFQ status</span>
        </div>
        <p>
          The north-star metric is decision-ready RFQs per active buyer-hour.
          An RFQ enters the numerator only when material facts have inspectable
          provenance and no unresolved critical issue remains. Savings use the
          policy-defined qualified baseline; supplier analytics are sourcing
          context, not an autonomous supplier score.
        </p>
        <button className="doc-link" onClick={() => onNavigate("analytics")}>
          Open Analytics <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "packets")
    return (
      <div className="doc-body">
        <span className="doc-label">TRUST SYSTEM</span>
        <h1>Evidence & Answer Packets</h1>
        <p className="doc-lede">
          Packets are versioned, inspectable artifacts that package everything
          required to reproduce and defend an output.
        </p>
        <h2>Evidence Packet</h2>
        <p>
          Used for an award decision. It contains the recommendation, source
          evidence, decision-time context, policies, transformations,
          calculations, assumptions, counterfactuals, unresolved issues, model
          and tool versions, and human approval history.
        </p>
        <h2>Answer Packet</h2>
        <p>
          Used for a conversational answer. It contains the direct answer,
          visible query scope, retrieved ledger facts, aggregated context,
          calculation trace, decision boundary, execution trace, assumptions and
          any approved action.
        </p>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Packet rule</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Every factual claim must be sourced</td>
              <td>Prevents unsupported explanations</td>
            </tr>
            <tr>
              <td>Every calculation must be reproducible</td>
              <td>Separates reasoning from arithmetic</td>
            </tr>
            <tr>
              <td>Every assumption must be visible</td>
              <td>Prevents silent state changes</td>
            </tr>
            <tr>
              <td>Every material edit creates a version</td>
              <td>Preserves auditability</td>
            </tr>
          </tbody>
        </table>
        <button className="doc-link" onClick={() => onNavigate("trust")}>
          Inspect the Evidence Packet <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "learning")
    return (
      <div className="doc-body">
        <span className="doc-label">TRUST SYSTEM</span>
        <h1>Trust & closed-loop learning</h1>
        <p className="doc-lede">
          Human feedback updates the current decision immediately, but it
          changes future product behaviour only after classification, evaluation
          and controlled release.
        </p>
        <DocFlow
          items={[
            "Capture",
            "Classify",
            "Evaluate",
            "Improve",
            "Shadow",
            "Release",
          ]}
        />
        <h2>Feedback routing</h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Signal</th>
              <th>Improvement destination</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Query interpretation</td>
              <td>Query-planning evaluation</td>
            </tr>
            <tr>
              <td>Evidence retrieval</td>
              <td>Retrieval evaluation and context metadata</td>
            </tr>
            <tr>
              <td>Extraction error</td>
              <td>Document extraction evaluation</td>
            </tr>
            <tr>
              <td>Policy-backed context</td>
              <td>Context retrieval and policy evaluation</td>
            </tr>
            <tr>
              <td>Reasoning or action error</td>
              <td>Reasoning and action-policy evaluation</td>
            </tr>
            <tr>
              <td>User preference or exception</td>
              <td>Explicit user/org memory or audit only</td>
            </tr>
          </tbody>
        </table>
        <h2>Release controls</h2>
        <p>
          A candidate improvement is replayed against the new case, similar
          historical examples and the category regression set. It then runs in
          shadow mode before a narrowly scoped release. The product explicitly
          prevents online self-training from a buyer click.
        </p>
        <button className="doc-link" onClick={() => onNavigate("trust")}>
          Open Trust & Learning Lab <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "models")
    return (
      <div className="doc-body">
        <span className="doc-label">SYSTEM DESIGN</span>
        <h1>Models, tools & responsibilities</h1>
        <p className="doc-lede">
          The architecture uses AI where semantics are fuzzy and deterministic
          software where rules are knowable.
        </p>
        <table className="doc-table model-doc-table">
          <thead>
            <tr>
              <th>Model or tool</th>
              <th>Product responsibility</th>
              <th>Control boundary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Gemini 2.5 Pro</strong>
              </td>
              <td>
                Multimodal commercial claim extraction from PDFs, tables, scans
                and photographs
              </td>
              <td>Cannot write directly to comparison</td>
            </tr>
            <tr>
              <td>
                <strong>text-embedding-3-large</strong>
              </td>
              <td>Retrieve likely RFQ line candidates</td>
              <td>Similarity cannot finalize a match</td>
            </tr>
            <tr>
              <td>
                <strong>GPT-5.4</strong>
              </td>
              <td>
                Ambiguous line and term adjudication; query planning; grounded
                explanations
              </td>
              <td>High-impact ambiguity routes to human review</td>
            </tr>
            <tr>
              <td>
                <strong>Deterministic services</strong>
              </td>
              <td>
                Currency, UOM, tax, discount, total reconciliation and
                landed-cost calculations
              </td>
              <td>Typed and testable arithmetic</td>
            </tr>
            <tr>
              <td>
                <strong>OR-Tools</strong>
              </td>
              <td>Policy-constrained award allocation</td>
              <td>Produces feasible scenarios, not autonomous awards</td>
            </tr>
            <tr>
              <td>
                <strong>Intervention policy</strong>
              </td>
              <td>
                Route outputs using confidence, impact, policy and reversibility
              </td>
              <td>Enforces enterprise and user control</td>
            </tr>
          </tbody>
        </table>
        <DocCallout icon={Bot} title="No single-model dependency">
          The Bid Ledger, evidence schema, deterministic services and policy
          controls remain the stable product layer even when models change.
        </DocCallout>
        <button className="doc-link" onClick={() => onNavigate("system")}>
          Open the AI system map <ArrowRight size={14} />
        </button>
      </div>
    );
  if (id === "logic")
    return (
      <div className="doc-body">
        <span className="doc-label">SYSTEM DESIGN</span>
        <h1>Decision logic & governance</h1>
        <p className="doc-lede">
          The product separates understanding what the supplier offered from
          deciding what the buyer should do.
        </p>
        <h2>Trust decision</h2>
        <div className="doc-formula">
          <span>Interpretation reliability</span>
          <b>∩</b>
          <span>Enterprise policy</span>
          <b>∩</b>
          <span>User permission</span>
          <strong>= Actual autonomy</strong>
        </div>
        <h2>Core logic</h2>
        <ul>
          <li>
            Prefer deterministic identifiers and rules before semantic
            reasoning.
          </li>
          <li>Preserve raw claims beside canonical values.</li>
          <li>Do not calculate on missing commercial inputs.</li>
          <li>Test whether uncertainty can change the outcome.</li>
          <li>
            Require human approval for decision-changing assumptions and
            recommendations.
          </li>
          <li>
            Never let a conversational assumption silently become a ledger fact.
          </li>
          <li>Promote autonomy task by task, not for the entire agent.</li>
        </ul>
        <h2>Current control states</h2>
        <table className="doc-table">
          <tbody>
            <tr>
              <td>Currency conversion</td>
              <td>Autonomous</td>
            </tr>
            <tr>
              <td>UOM normalization</td>
              <td>Autonomous</td>
            </tr>
            <tr>
              <td>Line-item mapping</td>
              <td>Exception review</td>
            </tr>
            <tr>
              <td>Recommendation</td>
              <td>Human approval</td>
            </tr>
            <tr>
              <td>Supplier award</td>
              <td>Manual</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  if (id === "metrics")
    return (
      <div className="doc-body">
        <span className="doc-label">SYSTEM DESIGN</span>
        <h1>Success metrics</h1>
        <p className="doc-lede">
          The product optimizes trusted buyer leverage—not the number of AI
          outputs generated.
        </p>
        <DocCallout icon={Target} title="Product north star">
          Decision-ready RFQs per buyer-hour
        </DocCallout>
        <h2>Core metrics visible in the product</h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>What it measures</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Decision-impacting errors / RFQ</td>
              <td>Errors capable of changing an award</td>
            </tr>
            <tr>
              <td>Human interventions / RFQ</td>
              <td>Buyer effort required to establish truth</td>
            </tr>
            <tr>
              <td>Median time to decision-ready</td>
              <td>Speed from responses to trusted comparison</td>
            </tr>
            <tr>
              <td>Facts with source provenance</td>
              <td>Auditability of commercial data</td>
            </tr>
            <tr>
              <td>Recommendation override rate</td>
              <td>Alignment between scenarios and buyer judgment</td>
            </tr>
            <tr>
              <td>Critical escalation recall</td>
              <td>Whether material ambiguity reaches a human</td>
            </tr>
            <tr>
              <td>Autonomous actions reversed</td>
              <td>Safety of delegated work</td>
            </tr>
          </tbody>
        </table>
        <h2>Feature metric for Ask → Verify → Act</h2>
        <p>
          <strong>Verified sourcing actions completed per buyer-hour.</strong>{" "}
          Supporting measures include citation completeness, calculation
          reproducibility, missing-data detection, question-to-workflow
          conversion and committed actions later reversed.
        </p>
        <button className="doc-link" onClick={() => onNavigate("system")}>
          Open system metrics <ArrowRight size={14} />
        </button>
      </div>
    );
  return (
    <div className="doc-body">
      <span className="doc-label">REFERENCE</span>
      <h1>Glossary</h1>
      <div className="glossary">
        <div>
          <strong>Commercial claim</strong>
          <p>
            A source-grounded statement made by a vendor, such as a quoted price
            or freight condition.
          </p>
        </div>
        <div>
          <strong>Canonical value</strong>
          <p>A typed and normalized representation used for comparison.</p>
        </div>
        <div>
          <strong>Bid Ledger</strong>
          <p>
            The versioned record connecting raw claims, evidence,
            interpretation, validation and decision use.
          </p>
        </div>
        <div>
          <strong>Source map</strong>
          <p>The exact document page, row, cell or sentence behind a fact.</p>
        </div>
        <div>
          <strong>Decision readiness</strong>
          <p>
            Whether coverage, verification and unresolved issues are sufficient
            for reliable analysis.
          </p>
        </div>
        <div>
          <strong>Decision-impacting uncertainty</strong>
          <p>
            Ambiguity that could change vendor ranking, feasibility or award
            allocation.
          </p>
        </div>
        <div>
          <strong>Evidence Packet</strong>
          <p>The inspectable artifact supporting an award recommendation.</p>
        </div>
        <div>
          <strong>Answer Packet</strong>
          <p>
            The evidence, context and calculation artifact supporting a
            conversational answer.
          </p>
        </div>
        <div>
          <strong>Verified Execution Trace</strong>
          <p>
            A reproducible log of scope, retrieval, tools and checks—not private
            chain-of-thought.
          </p>
        </div>
        <div>
          <strong>Human-in-the-loop</strong>
          <p>
            A policy-driven review boundary for important or governed decisions.
          </p>
        </div>
        <div>
          <strong>Earned autonomy</strong>
          <p>
            Task-level automation eligibility based on measured reliability,
            policy and permission.
          </p>
        </div>
        <div>
          <strong>Shadow mode</strong>
          <p>
            Running candidate behaviour without changing the buyer’s production
            outcome.
          </p>
        </div>
      </div>
    </div>
  );
}

function DocCallout({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="doc-callout">
      <Icon size={18} />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}
function DocSteps({ items }: { items: string[] }) {
  return (
    <ol className="doc-steps">
      {items.map((item, index) => (
        <li key={item}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}
function DocFlow({ items }: { items: string[] }) {
  return (
    <div className="doc-flow">
      {items.map((item, index) => (
        <div key={item}>
          <span>{item}</span>
          {index < items.length - 1 && <ArrowRight size={13} />}
        </div>
      ))}
    </div>
  );
}

function SystemView() {
  const models = [
    {
      icon: FileSearch,
      stage: "1 · UNDERSTAND",
      name: "Gemini 2.5 Pro",
      use: "Multimodal claim extraction",
      why: "Best fit for mixed-layout PDFs, tables, scans and phone photos. Returns claims with bounding-box evidence.",
      guard: "Never writes directly to the comparison.",
    },
    {
      icon: Network,
      stage: "2 · ALIGN",
      name: "text-embedding-3-large",
      use: "RFQ candidate retrieval",
      why: "Retrieves the top 5 likely RFQ lines cheaply before deeper adjudication.",
      guard: "Similarity alone cannot finalize a match.",
    },
    {
      icon: Bot,
      stage: "3 · ADJUDICATE",
      name: "GPT-5.4",
      use: "Ambiguous matching + term reasoning",
      why: "Used only when identifiers, attributes and rules cannot resolve meaning safely.",
      guard: "High-impact ambiguity routes to a human.",
    },
    {
      icon: Calculator,
      stage: "4 · COMPUTE",
      name: "Deterministic services",
      use: "UOM, FX, tax, totals + optimization",
      why: "Typed code and OR-Tools perform arithmetic, validation and constrained awards.",
      guard: "LLMs never calculate the commercial answer.",
    },
    {
      icon: MessageSquareText,
      stage: "5 · EXPLAIN",
      name: "GPT-5.4",
      use: "Query planning + grounded explanation",
      why: "Plans ledger queries and explains computed results in buyer language.",
      guard: "Can cite only returned ledger facts.",
    },
  ];
  return (
    <>
      <Subhead
        eyebrow="PRODUCT ARCHITECTURE"
        title="Use AI where semantics are fuzzy. Use software where rules are knowable."
        text="The model layer interprets vendor intent; the Verified Bid Ledger, policy engine and deterministic services establish commercial truth."
      />
      <div className="mental-model">
        <div>
          <span>MESSY INPUTS</span>
          <strong>Claims</strong>
        </div>
        <ArrowRight />
        <div>
          <span>CANONICAL MODEL</span>
          <strong>Verified Bid Ledger</strong>
        </div>
        <ArrowRight />
        <div>
          <span>TRUST GATE</span>
          <strong>Impact × Confidence × Policy</strong>
        </div>
        <ArrowRight />
        <div>
          <span>BUYER OUTCOME</span>
          <strong>Defensible decision</strong>
        </div>
      </div>
      <section className="system-section">
        <div className="section-title">
          <div>
            <span className="kicker">MODEL ROUTER</span>
            <h2>Which model does what—and why</h2>
          </div>
          <div className="no-single-model">
            <ShieldCheck size={14} /> No single-model dependency
          </div>
        </div>
        <div className="model-grid">
          {models.map(({ icon: Icon, ...m }) => (
            <article key={m.stage}>
              <div className="model-icon">
                <Icon size={18} />
              </div>
              <span className="kicker">{m.stage}</span>
              <h3>{m.name}</h3>
              <strong>{m.use}</strong>
              <p>{m.why}</p>
              <div>
                <LockKeyhole size={12} />
                {m.guard}
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="system-columns">
        <section className="panel trust-policy">
          <div className="section-title">
            <div>
              <span className="kicker">HUMAN INTERVENTION POLICY</span>
              <h2>Automation is task-specific and earned</h2>
            </div>
          </div>
          <div className="policy-formula">
            <span>Model reliability</span>
            <b>∩</b>
            <span>Enterprise policy</span>
            <b>∩</b>
            <span>User permission</span>
            <strong>= Actual autonomy</strong>
          </div>
          <div className="task-table">
            <div>
              <span>Task</span>
              <span>Current control</span>
              <span>Evidence</span>
            </div>
            <div>
              <b>Currency conversion</b>
              <span className="auto">Autonomous</span>
              <span>99.99% tests pass</span>
            </div>
            <div>
              <b>UOM normalization</b>
              <span className="auto">Autonomous</span>
              <span>99.7% verified</span>
            </div>
            <div>
              <b>Line-item mapping</b>
              <span className="assist">Exception review</span>
              <span>0 critical errors / 500</span>
            </div>
            <div>
              <b>Recommendation</b>
              <span className="manual">Human approval</span>
              <span>Policy ceiling</span>
            </div>
            <div>
              <b>Supplier award</b>
              <span className="manual">Manual</span>
              <span>Not authorized</span>
            </div>
          </div>
        </section>
        <section className="panel metrics-panel">
          <div className="section-title">
            <div>
              <span className="kicker">SUCCESS SYSTEM</span>
              <h2>Measure trusted leverage</h2>
            </div>
          </div>
          <div className="north-star">
            <Target size={19} />
            <span>
              <small>NORTH STAR</small>
              <strong>Decision-ready RFQs per buyer-hour</strong>
            </span>
          </div>
          <MetricLine
            name="Decision-impacting errors / RFQ"
            value="0.04"
            target="Target <0.10"
            good
          />
          <MetricLine
            name="Human interventions / RFQ"
            value="3.2"
            target="↓ 38% QoQ"
            good
          />
          <MetricLine
            name="Median time to decision-ready"
            value="18 min"
            target="Baseline 4.5 hr"
            good
          />
          <MetricLine
            name="Facts with source provenance"
            value="100%"
            target="Hard SLO"
            good
          />
          <MetricLine
            name="Recommendation override rate"
            value="11%"
            target="Monitor by category"
          />
        </section>
      </div>
      <section className="learning-loop">
        <div>
          <Database size={18} />
          <span>
            <strong>Verified Procurement Memory</strong>
            <small>
              Vendor claim → AI interpretation → buyer correction → accepted
              fact → decision → outcome
            </small>
          </span>
        </div>
        <ArrowRight size={18} />
        <div>
          <WandSparkles size={18} />
          <span>
            <strong>Closed learning loop</strong>
            <small>
              Corrections become eval cases before they can influence production
              behavior.
            </small>
          </span>
        </div>
      </section>
    </>
  );
}

function EvidenceSheet({
  evidence,
  close,
}: {
  evidence: Evidence;
  close: () => void;
}) {
  return (
    <Sheet open={!!evidence} onOpenChange={(o) => !o && close()}>
      <SheetContent className="evidence-sheet sm:max-w-[440px]">
        <SheetHeader>
          <div className="eyebrow">BID LEDGER · PROVENANCE</div>
          <SheetTitle>{evidence?.value}</SheetTitle>
          <SheetDescription>
            Normalized commercial fact with its complete source map.
          </SheetDescription>
        </SheetHeader>
        {evidence && (
          <div className="evidence-body">
            <div className="verified-banner">
              <ShieldCheck size={16} />
              <span>
                <strong>System verified</strong>
                <small>Arithmetic reconciliation passed</small>
              </span>
            </div>
            <section>
              <span className="kicker">ORIGINAL CLAIM</span>
              <blockquote>{evidence.raw}</blockquote>
              <small>{evidence.source}</small>
              <div className="fake-document">
                <div>PACKRIGHT INDUSTRIES</div>
                <p>Commercial Offer</p>
                <span className="source-highlight">
                  5-ply BC flute: {evidence.raw}
                </span>
                <span>GST and freight charged separately.</span>
              </div>
            </section>
            <section>
              <span className="kicker">TRANSFORMATION</span>
              <div className="transform-row">
                <span>Raw quote</span>
                <strong>{evidence.raw}</strong>
              </div>
              <div className="transform-row">
                <span>Discount</span>
                <strong>2% · payment ≤7d</strong>
              </div>
              <div className="transform-row">
                <span>Normalized</span>
                <strong>{evidence.value} / kg</strong>
              </div>
              <p>{evidence.note}</p>
            </section>
            <section>
              <span className="kicker">AI TRACE</span>
              <div className="trace-line">
                <Sparkles size={14} />
                <span>
                  <strong>{evidence.model}</strong>
                  <small>Claim extraction · 99% confidence</small>
                </span>
              </div>
              <div className="trace-line">
                <GitCompareArrows size={14} />
                <span>
                  <strong>GPT-5.4 · matched</strong>
                  <small>RFQ line PKG-001 · 96% confidence</small>
                </span>
              </div>
              <div className="trace-line">
                <Calculator size={14} />
                <span>
                  <strong>Rules engine · normalized</strong>
                  <small>Deterministic transform · 100%</small>
                </span>
              </div>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Subhead({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="subhead">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <Progress value={value} />
    </div>
  );
}
function Term({ label, values }: { label: string; values: string }) {
  return (
    <div>
      <strong>{label}</strong>
      <span>{values}</span>
    </div>
  );
}
function MetricLine({
  name,
  value,
  target,
  good,
}: {
  name: string;
  value: string;
  target: string;
  good?: boolean;
}) {
  return (
    <div className="metric-line">
      <span>
        <strong>{name}</strong>
        <small>{target}</small>
      </span>
      <b className={good ? "good" : ""}>{value}</b>
    </div>
  );
}
