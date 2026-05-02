import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Activity, TrendingUp, BarChart2, Layers } from "lucide-react";
import _literaturData from "../data/literaturData.json";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell,
} from "recharts";

// ── Cluster colours ──────────────────────────────────────────────────────────
const CLUSTER_COLORS: Record<string, string> = {
  "Knowledge Graphs & AI":    "#4E79A7",
  "Ontology Engineering":     "#F28E2B",
  "Formal Ontology Concepts": "#E15759",
  "Mereology & Cognition":    "#76B7B2",
  "Conceptual Modeling":      "#59A14F",
};
const SHORT: Record<string, string> = {
  "Knowledge Graphs & AI":    "KG & AI",
  "Ontology Engineering":     "Ont. Eng.",
  "Formal Ontology Concepts": "Formal Ont.",
  "Mereology & Cognition":    "Mereology",
  "Conceptual Modeling":      "Concept.",
};
const CLUSTERS = Object.keys(CLUSTER_COLORS);
const SHORT_KEYS = ["KG & AI", "Ont. Eng.", "Formal Ont.", "Mereology", "Concept."];
const COLORS = Object.values(CLUSTER_COLORS);

// ── Source data ──────────────────────────────────────────────────────────────
const JOWO_YEARLY = [
  { year: 2017, "KG & AI": 27.6, "Ont. Eng.": 20.4, "Formal Ont.": 33.1, "Mereology": 17.5, "Concept.": 1.5, papers: 64 },
  { year: 2018, "KG & AI":  7.2, "Ont. Eng.": 29.0, "Formal Ont.": 42.0, "Mereology": 20.3, "Concept.": 1.4, papers: 15 },
  { year: 2019, "KG & AI": 24.3, "Ont. Eng.": 21.1, "Formal Ont.": 35.8, "Mereology": 16.3, "Concept.": 2.4, papers: 79 },
  { year: 2020, "KG & AI": 27.6, "Ont. Eng.": 12.2, "Formal Ont.": 34.7, "Mereology": 24.5, "Concept.": 1.0, papers: 24 },
  { year: 2021, "KG & AI": 22.0, "Ont. Eng.": 19.9, "Formal Ont.": 37.9, "Mereology": 16.8, "Concept.": 3.5, papers: 79 },
  { year: 2022, "KG & AI": 26.2, "Ont. Eng.": 11.5, "Formal Ont.": 34.6, "Mereology": 24.6, "Concept.": 3.1, papers: 29 },
  { year: 2023, "KG & AI": 32.0, "Ont. Eng.": 18.2, "Formal Ont.": 28.3, "Mereology": 19.0, "Concept.": 2.4, papers: 53 },
  { year: 2024, "KG & AI": 38.9, "Ont. Eng.": 20.7, "Formal Ont.": 24.5, "Mereology": 11.6, "Concept.": 4.3, papers: 79 },
  { year: 2025, "KG & AI": 28.1, "Ont. Eng.": 17.1, "Formal Ont.": 36.4, "Mereology": 17.1, "Concept.": 1.3, papers: 70 },
];

const VENUE_COMPARISON = [
  { cluster: "Knowledge Graphs & AI",    JOWO: 26.0, FOIS: 15.6 },
  { cluster: "Ontology Engineering",     JOWO: 18.9, FOIS: 21.6 },
  { cluster: "Formal Ontology Concepts", JOWO: 34.1, FOIS: 38.4 },
  { cluster: "Mereology & Cognition",    JOWO: 18.6, FOIS: 22.0 },
  { cluster: "Conceptual Modeling",      JOWO:  2.3, FOIS:  2.8 },
];

const PAPER_COUNTS = [
  { year: 2016, JOWO: 0,  FOIS: 28 },
  { year: 2017, JOWO: 64, FOIS: 0  },
  { year: 2018, JOWO: 15, FOIS: 23 },
  { year: 2019, JOWO: 79, FOIS: 0  },
  { year: 2020, JOWO: 24, FOIS: 17 },
  { year: 2021, JOWO: 79, FOIS: 11 },
  { year: 2022, JOWO: 29, FOIS: 0  },
  { year: 2023, JOWO: 53, FOIS: 25 },
  { year: 2024, JOWO: 79, FOIS: 19 },
  { year: 2025, JOWO: 70, FOIS: 22 },
];

// Radar needs flat cluster labels
const RADAR_DATA = VENUE_COMPARISON.map((r) => ({
  cluster: SHORT[r.cluster],
  JOWO: r.JOWO,
  FOIS: r.FOIS,
}));

// ── Shared tooltip ───────────────────────────────────────────────────────────
const SharedTooltip = ({ active, payload, label, unit = "%" }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-xl p-4 text-sm min-w-[170px]">
      <div className="font-bold text-foreground mb-2">{label}</div>
      {[...payload].reverse().map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.fill ?? p.stroke ?? p.color }} />
            <span className="text-muted-foreground">{p.name}</span>
          </div>
          <span className="font-semibold text-foreground">
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  );
};

const legendFormatter = (v: string) => (
  <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>{v}</span>
);

// ── Chart components ─────────────────────────────────────────────────────────

const StackedBarChart = () => (
  <div className="bg-background border border-border rounded-2xl p-5">
    <p className="text-xs text-muted-foreground mb-4">Cluster share (%) — hover bars for details</p>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={JOWO_YEARLY} margin={{ top: 4, right: 8, left: -14, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis unit="%" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<SharedTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
        <Legend wrapperStyle={{ paddingTop: 12 }} formatter={legendFormatter} />
        {SHORT_KEYS.map((key, i) => (
          <Bar key={key} dataKey={key} stackId="a" fill={COLORS[i]}
            radius={i === SHORT_KEYS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const HeatmapChart = () => {
  const [hovered, setHovered] = useState<{ year: number; cluster: string } | null>(null);
  const years = JOWO_YEARLY.map((r) => r.year);

  // Per-cluster min/max for relative intensity
  const clusterRanges = SHORT_KEYS.reduce((acc, key) => {
    const vals = JOWO_YEARLY.map((r) => r[key as keyof typeof r] as number);
    acc[key] = { min: Math.min(...vals), max: Math.max(...vals) };
    return acc;
  }, {} as Record<string, { min: number; max: number }>);

  const opacity = (key: string, val: number) => {
    const { min, max } = clusterRanges[key];
    return 0.15 + ((val - min) / (max - min)) * 0.85;
  };

  const getValue = (row: typeof JOWO_YEARLY[0], key: string) =>
    row[key as keyof typeof row] as number;

  const isHovered = (year: number, cluster: string) =>
    hovered?.year === year || hovered?.cluster === cluster;

  return (
    <div className="bg-background border border-border rounded-2xl p-5 overflow-x-auto">
      <p className="text-xs text-muted-foreground mb-5">
        Colour intensity = relative prominence of cluster within its own range. Hover to highlight.
      </p>
      <div className="min-w-[520px]">
        {/* Column headers (years) */}
        <div className="flex mb-1 ml-[110px] gap-1">
          {years.map((y) => (
            <div key={y} className="flex-1 text-center text-[10px] font-bold text-muted-foreground">
              {y}
            </div>
          ))}
        </div>
        {/* Rows (clusters) */}
        {SHORT_KEYS.map((key, ci) => (
          <div key={key} className="flex items-center gap-1 mb-1">
            <div className="w-[105px] shrink-0 text-[11px] font-semibold text-muted-foreground text-right pr-3 truncate">
              {key}
            </div>
            {JOWO_YEARLY.map((row) => {
              const val = getValue(row, key);
              const alpha = opacity(key, val);
              const highlighted = isHovered(row.year, key);
              return (
                <div
                  key={row.year}
                  className="flex-1 h-10 rounded-md cursor-default transition-all duration-150 flex items-center justify-center"
                  style={{
                    background: COLORS[ci],
                    opacity: highlighted ? 1 : alpha,
                    outline: highlighted ? `2px solid ${COLORS[ci]}` : "none",
                    outlineOffset: 1,
                  }}
                  onMouseEnter={() => setHovered({ year: row.year, cluster: key })}
                  onMouseLeave={() => setHovered(null)}
                  title={`${key} · ${row.year}: ${val.toFixed(1)}%`}
                >
                  <span className="text-white text-[10px] font-bold drop-shadow select-none">
                    {val.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
        {/* Year paper count row */}
        <div className="flex items-center gap-1 mt-2">
          <div className="w-[105px] shrink-0 text-[10px] font-semibold text-muted-foreground text-right pr-3">
            papers
          </div>
          {JOWO_YEARLY.map((row) => (
            <div key={row.year} className="flex-1 text-center text-[10px] text-muted-foreground font-medium">
              {row.papers}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TrendAreaChart = () => (
  <div className="bg-background border border-border rounded-2xl p-5">
    <p className="text-xs text-muted-foreground mb-4">Cluster share (%) over time — gradient area chart</p>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={JOWO_YEARLY} margin={{ top: 4, right: 8, left: -14, bottom: 4 }}>
        <defs>
          {SHORT_KEYS.map((key, i) => (
            <linearGradient key={key} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={COLORS[i]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis unit="%" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<SharedTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 12 }} formatter={legendFormatter} />
        {SHORT_KEYS.map((key, i) => (
          <Area
            key={key} type="monotone" dataKey={key}
            stroke={COLORS[i]} strokeWidth={2.5}
            fill={`url(#grad-${i})`}
            dot={{ r: 3, fill: COLORS[i], strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const PaperVolumeChart = () => (
  <div className="bg-background border border-border rounded-2xl p-5">
    <p className="text-xs text-muted-foreground mb-4">Papers published per year by venue</p>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={PAPER_COUNTS} margin={{ top: 4, right: 8, left: -14, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<SharedTooltip unit="" />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
        <Legend wrapperStyle={{ paddingTop: 12 }} formatter={legendFormatter} />
        <Bar dataKey="JOWO" fill="#E05A2B" radius={[4, 4, 0, 0]} />
        <Bar dataKey="FOIS" fill="#20808D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const RadarComp = () => (
  <div className="bg-background border border-border rounded-2xl p-5">
    <p className="text-xs text-muted-foreground mb-4">Average cluster share (%) — JOWO vs FOIS across all editions</p>
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="cluster"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90} domain={[0, 45]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          tickCount={4}
        />
        <Radar name="JOWO" dataKey="JOWO" stroke="#E05A2B" fill="#E05A2B" fillOpacity={0.25} strokeWidth={2} dot={{ r: 3 }} />
        <Radar name="FOIS" dataKey="FOIS" stroke="#20808D" fill="#20808D" fillOpacity={0.25} strokeWidth={2} dot={{ r: 3 }} />
        <Legend wrapperStyle={{ paddingTop: 12 }} formatter={legendFormatter} />
        <Tooltip content={<SharedTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

const GroupedBarChart = () => {
  const data = VENUE_COMPARISON.map((r) => ({ ...r, cluster: SHORT[r.cluster] }));
  return (
    <div className="bg-background border border-border rounded-2xl p-5">
      <p className="text-xs text-muted-foreground mb-4">Mean cluster share (%) per conference</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" unit="%" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 45]} />
          <YAxis type="category" dataKey="cluster" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<SharedTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
          <Legend wrapperStyle={{ paddingTop: 12 }} formatter={legendFormatter} />
          <Bar dataKey="JOWO" fill="#E05A2B" radius={[0, 4, 4, 0]} />
          <Bar dataKey="FOIS" fill="#20808D" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DivergingChart = () => {
  // Difference = JOWO - FOIS per cluster
  const data = VENUE_COMPARISON.map((r) => ({
    cluster: SHORT[r.cluster],
    diff: parseFloat((r.JOWO - r.FOIS).toFixed(1)),
  })).sort((a, b) => b.diff - a.diff);

  return (
    <div className="bg-background border border-border rounded-2xl p-5">
      <p className="text-xs text-muted-foreground mb-1">JOWO minus FOIS share (pp) — positive = more prominent in JOWO</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 30, left: 10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" unit="pp" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="cluster" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const val = payload[0].value as number;
              return (
                <div className="bg-card border border-border rounded-xl shadow-xl p-4 text-sm">
                  <div className="font-bold text-foreground mb-1">{label}</div>
                  <div className="text-muted-foreground">
                    JOWO {val >= 0 ? "leads by" : "trails by"}{" "}
                    <span className="font-bold" style={{ color: val >= 0 ? "#E05A2B" : "#20808D" }}>
                      {Math.abs(val).toFixed(1)} pp
                    </span>
                  </div>
                </div>
              );
            }}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          />
          <Bar dataKey="diff" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.cluster} fill={entry.diff >= 0 ? "#E05A2B" : "#20808D"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── Chart selectors ──────────────────────────────────────────────────────────
const ChartSelector = ({
  options, active, onChange,
}: {
  options: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button
        key={o.key}
        onClick={() => onChange(o.key)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          active === o.key
            ? "bg-primary text-primary-foreground shadow"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// ── RQ views ─────────────────────────────────────────────────────────────────
const RQ1View = () => {
  const [chart, setChart] = useState("stacked");
  const CHARTS = [
    { key: "stacked",  label: "Stacked Bar" },
    { key: "heatmap",  label: "Heatmap" },
    { key: "area",     label: "Area Trends" },
    { key: "volume",   label: "Paper Volume" },
  ];
  return (
    <div className="space-y-5">
      <div className="bg-muted/30 border border-border rounded-2xl p-5 text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Finding:</strong> "Knowledge Graphs &amp; AI" grew from 27.6% (2017) to a peak of{" "}
        <strong className="text-foreground">38.9%</strong> in 2024 — signalling a clear AI shift. "Formal Ontology Concepts" is the persistent backbone, while "Conceptual Modeling" stays below 5% throughout.
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Chart type</p>
        <ChartSelector options={CHARTS} active={chart} onChange={setChart} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={chart} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          {chart === "stacked"  && <StackedBarChart />}
          {chart === "heatmap"  && <HeatmapChart />}
          {chart === "area"     && <TrendAreaChart />}
          {chart === "volume"   && <PaperVolumeChart />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const RQ2View = () => {
  const [chart, setChart] = useState("radar");
  const CHARTS = [
    { key: "radar",    label: "Radar" },
    { key: "grouped",  label: "Grouped Bar" },
    { key: "diverging",label: "Diverging" },
  ];
  return (
    <div className="space-y-5">
      <div className="bg-muted/30 border border-border rounded-2xl p-5 text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Finding:</strong> JOWO has a stronger "KG &amp; AI" emphasis (<strong className="text-foreground">26%</strong> vs 15.6% at FOIS). FOIS leans more toward "Formal Ontology" and "Mereology" — consistent with its theoretically rigorous scope.
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Chart type</p>
        <ChartSelector options={CHARTS} active={chart} onChange={setChart} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={chart} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          {chart === "radar"     && <RadarComp />}
          {chart === "grouped"   && <GroupedBarChart />}
          {chart === "diverging" && <DivergingChart />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, color }: { value: string | number; label: string; color?: string }) => (
  <div className="rounded-2xl bg-muted/40 border border-border p-5">
    <div className="text-3xl font-extrabold" style={color ? { color } : { color: "hsl(var(--foreground))" }}>
      {value}
    </div>
    <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">{label}</div>
  </div>
);

// ── Main modal ───────────────────────────────────────────────────────────────
interface Props { isOpen: boolean; onClose: () => void; }

const LiteraturDemo = ({ isOpen, onClose }: Props) => {
  const [rq, setRq] = useState<"rq1" | "rq2">("rq1");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-2 md:inset-10 z-[101] flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="w-full h-full max-w-6xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-20">
                <X size={24} />
              </button>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
                <div className="relative z-10 max-w-5xl mx-auto">

                  {/* Header */}
                  <div className="mb-8 pr-12 border-b border-border/50 pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">
                      <BookOpen size={16} /> GI AI Journal — Interactive Showcase
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                      LiteraturResearcher
                    </h2>
                    <p className="mt-3 text-muted-foreground max-w-2xl text-sm leading-relaxed">
                      Bibliometric study of <strong>JOWO</strong> (9 editions) and <strong>FOIS</strong> (7 editions), 2016–2025. Automated PDF extraction, sentence-embedding keyword clustering (k=5, Silhouette-optimised), and interactive trend analysis.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard value="617"   label="Total Papers" />
                    <StatCard value="493"   label="JOWO Papers"   color="#E05A2B" />
                    <StatCard value="124"   label="FOIS Papers"   color="#20808D" />
                    <StatCard value="5"     label="Topic Clusters" />
                  </div>

                  {/* Methodology */}
                  <div className="mb-12 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Activity className="text-primary" size={20} /> Methodology
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                        <p>
                          Paper metadata was scraped from <strong className="text-foreground">DBLP</strong>. Since DBLP provides no abstracts, a fault-tolerant PDF pipeline was built — first attempting regex on PyMuPDF output, then falling back to <strong className="text-foreground">phi4-mini</strong> via Ollama for structured extraction (&lt;0.5% miss rate).
                        </p>
                        <p>
                          Keywords were embedded with <strong className="text-foreground">embeddinggemma</strong>, L2-normalised, PCA-reduced (30 dims), and clustered via K-Means. Silhouette scoring across k∈[5,24] selected <strong className="text-foreground">k=5</strong>.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {CLUSTERS.map((c) => (
                            <span key={c} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-border bg-muted/30">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CLUSTER_COLORS[c] }} />
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Cluster table */}
                      <div className="rounded-xl border border-border overflow-hidden text-xs">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="text-left px-3 py-2 text-muted-foreground font-semibold">Cluster</th>
                              <th className="text-right px-3 py-2 text-muted-foreground font-semibold">JOWO avg</th>
                              <th className="text-right px-3 py-2 text-muted-foreground font-semibold">FOIS avg</th>
                            </tr>
                          </thead>
                          <tbody>
                            {VENUE_COMPARISON.map((r, i) => (
                              <tr key={r.cluster} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                                <td className="px-3 py-2 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CLUSTER_COLORS[r.cluster] }} />
                                  {SHORT[r.cluster]}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-foreground">{r.JOWO.toFixed(1)}%</td>
                                <td className="px-3 py-2 text-right font-mono text-foreground">{r.FOIS.toFixed(1)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Research Questions */}
                  <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-6 border-b border-border/50">
                      <div>
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          <Layers className="text-primary" size={22} /> Research Questions
                        </h3>
                        <p className="text-muted-foreground mt-2 text-sm max-w-lg">
                          Switch between RQs and chart types to explore the findings interactively.
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {([
                          { key: "rq1", icon: TrendingUp, label: "RQ1: JOWO Evolution" },
                          { key: "rq2", icon: BarChart2,  label: "RQ2: JOWO vs FOIS" },
                        ] as const).map(({ key, icon: Icon, label }) => (
                          <button
                            key={key}
                            onClick={() => setRq(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                              rq === key
                                ? "bg-primary text-primary-foreground shadow"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            <Icon size={15} /> {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={rq}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {rq === "rq1" ? <RQ1View /> : <RQ2View />}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LiteraturDemo;
