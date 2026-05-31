import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, TableIcon, ImageIcon, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

type ScenarioKey = "left" | "straight" | "right";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const THRESHOLD = 1.0;

function noise(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 0.3;
}

function makeFlowData(scenario: ScenarioKey) {
  return Array.from({ length: 200 }, (_, i) => {
    const n = noise(i);
    const inZone = i >= 70 && i <= 130;
    const t = inZone ? (i - 70) / 60 : 0;
    const bell = inZone ? Math.sin(t * Math.PI) : 0;

    let signal: number;
    if (scenario === "left") signal = n - bell * 2.6;
    else if (scenario === "right") signal = n + bell * 2.2;
    else signal = n;

    return { frame: i, flow: Math.round(signal * 1000) / 1000 };
  });
}

const FLOW_DATA: Record<ScenarioKey, ReturnType<typeof makeFlowData>> = {
  left: makeFlowData("left"),
  straight: makeFlowData("straight"),
  right: makeFlowData("right"),
};

const SCENARIO_CONFIG: Record<ScenarioKey, { label: string; color: string; prediction: string }> = {
  left:     { label: "Left Turn",  color: "#6366f1", prediction: "← LEFT"     },
  straight: { label: "Straight",   color: "#22c55e", prediction: "⬆ STRAIGHT" },
  right:    { label: "Right Turn", color: "#f59e0b", prediction: "→ RIGHT"     },
};

// Table 1 from paper: LORTO-CV results (r = 4.5 m, t = 1.0)
const TABLE_ROWS = [
  { fold: 1, route: "Complex",    n: 56, acc: "0.93", f1Left: "0.77", f1Straight: "0.87", f1Right: "0.99", bold: false },
  { fold: 2, route: "Ref (Fwd)",  n: 40, acc: "0.9",  f1Left: "—",    f1Straight: "—",    f1Right: "0.95", bold: false },
  { fold: 3, route: "Ref (Back)", n: 36, acc: "1.000",f1Left: "1.0",  f1Straight: "—",    f1Right: "—",    bold: true  },
];

const IMAGES = [
  {
    src: "/of-demo/record_setup.jpg",
    caption: "Fig. 1 — Recording system: Microsoft HoloLens 2 (head) + Google Pixel 9 (chest) + Raspberry Pi 5",
  },
  {
    src: "/of-demo/trajectories.png",
    caption: "Recorded trajectories across three zone types: Confined Space, Open Space, Transition Zone",
  },
];

const FlowTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { frame: number }; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">Frame {payload[0]?.payload?.frame}</p>
      <p className="font-semibold text-foreground">Flow: {payload[0]?.value?.toFixed(3)}</p>
    </div>
  );
};

const OpticalFlowDemo = ({ isOpen, onClose }: Props) => {
  const [scenario, setScenario] = useState<ScenarioKey>("left");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const config = SCENARIO_CONFIG[scenario];
  const flowData = FLOW_DATA[scenario];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="of-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="of-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-2 z-[101] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:inset-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/60 p-6">
              <div>
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  GeoAI 2026 · Oral
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">Seeing Around the Corner</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lucas-Kanade optical flow · smartphone-only · no training data required
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Overall Accuracy", value: "90%",  sub: "turn classification",  color: "text-green-500" },
                  { label: "Trajectories",      value: "27",   sub: "10 participants",       color: "text-primary"   },
                  { label: "Route Types",       value: "3",    sub: "LORTO-CV folds",        color: "text-amber-500" },
                  { label: "IMU Baseline",      value: "45%",  sub: "improved to 90%",       color: "text-red-400"   },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`mt-1 text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Flow Signal */}
              <div className="rounded-xl border border-border/60 bg-background p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                      <Navigation size={16} className="text-primary" />
                      Optical Flow Signal
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Horizontal displacement · 45-frame moving avg · zone radius: 4.5 m · bias: 0.047
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(["left", "straight", "right"] as ScenarioKey[]).map((s) => {
                      const Icon = s === "left" ? ArrowLeft : s === "right" ? ArrowRight : ArrowUp;
                      return (
                        <button
                          key={s}
                          onClick={() => setScenario(s)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            scenario === s
                              ? "bg-primary text-primary-foreground shadow"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon size={13} />
                          {SCENARIO_CONFIG[s].label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={scenario}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={flowData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                          dataKey="frame"
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          label={{ value: "Frame", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis domain={[-3.5, 3.5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <RechartsTooltip content={<FlowTooltip />} />
                        <ReferenceArea x1={70} x2={130} fill="hsl(var(--primary))" fillOpacity={0.07} />
                        <ReferenceLine y={THRESHOLD}  stroke="#22c55e" strokeDasharray="6 3" strokeWidth={1.5}
                          label={{ value: "+threshold", position: "insideTopRight",    fontSize: 9, fill: "#22c55e" }} />
                        <ReferenceLine y={-THRESHOLD} stroke="#22c55e" strokeDasharray="6 3" strokeWidth={1.5}
                          label={{ value: "−threshold", position: "insideBottomRight", fontSize: 9, fill: "#22c55e" }} />
                        <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1} />
                        <Line type="monotone" dataKey="flow" stroke={config.color} strokeWidth={1.8} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">Decision zone</span> highlighted · crossing ±threshold triggers classification
                  </p>
                  <div
                    className="rounded-lg px-4 py-1.5 text-sm font-bold"
                    style={{ backgroundColor: config.color + "22", color: config.color }}
                  >
                    Prediction: {config.prediction}
                  </div>
                </div>
              </div>

              {/* Paper Results Table */}
              <div className="rounded-xl border border-border/60 bg-background p-5">
                <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-foreground">
                  <TableIcon size={16} className="text-primary" />
                  Table 1 — LORTO-CV Results
                </h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  r = 4.5 m, t = 1.0 · Folds correspond to route types · bold = best per column
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60">
                        {["Fold", "Route", "N", "Acc", "F1 Left", "F1 Straight", "F1 Right"].map((h) => (
                          <th key={h} className="pb-2 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground last:pr-0">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map((row) => (
                        <tr key={row.fold} className="border-b border-border/40 last:border-0">
                          <td className="py-3 pr-6 text-muted-foreground">{row.fold}</td>
                          <td className="py-3 pr-6 font-medium text-foreground">{row.route}</td>
                          <td className="py-3 pr-6 text-muted-foreground">{row.n}</td>
                          <td className={`py-3 pr-6 ${row.bold ? "font-bold text-green-500" : "text-foreground"}`}>{row.acc}</td>
                          <td className={`py-3 pr-6 ${row.bold && row.f1Left !== "—" ? "font-bold text-green-500" : row.f1Left === "—" ? "text-muted-foreground/40" : "text-foreground"}`}>{row.f1Left}</td>
                          <td className={`py-3 pr-6 ${row.f1Straight === "—" ? "text-muted-foreground/40" : "text-foreground"}`}>{row.f1Straight}</td>
                          <td className={`py-3 ${row.f1Right === "—" ? "text-muted-foreground/40" : "text-foreground"}`}>{row.f1Right}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  — indicates class not present in test fold (Fwd route = right turns only; Back route = left turns only)
                </p>
              </div>

              {/* Images */}
              <div className="rounded-xl border border-border/60 bg-background p-5">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                  <ImageIcon size={16} className="text-primary" />
                  Setup &amp; Trajectories
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {IMAGES.map((img) => (
                    <div key={img.src} className="flex flex-col gap-2">
                      <div className="overflow-hidden rounded-lg border border-border/60 bg-muted flex items-center justify-center p-2">
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="max-h-64 w-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OpticalFlowDemo;
