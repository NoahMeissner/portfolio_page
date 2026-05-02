import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ChevronDown, Activity, Search, Bot, CheckCircle2, XCircle, ArrowRight, CornerDownRight, X, FileText, User, Filter, RefreshCw, Utensils } from "lucide-react";

// Import the aggregated JSON data
import biasData from "../data/biasData.json";

const biasLabels: Record<string, string> = {
    no_biase: "No Bias",
    search_biase: "Search Bias",
    both_biase: "Both Biases",
    system_biase: "System Bias"
};

const biasColors: Record<string, string> = {
    no_biase: "bg-emerald-500",
    search_biase: "bg-blue-500",
    both_biase: "bg-amber-500",
    system_biase: "bg-rose-500"
};

const biasTextColors: Record<string, string> = {
    no_biase: "text-emerald-500",
    search_biase: "text-blue-500",
    both_biase: "text-amber-500",
    system_biase: "text-rose-500"
};

// ── Interactive Workflow Diagram ─────────────────────────────────────────────
const WORKFLOW_NODES = [
    {
        id: "user",
        label: "User Query",
        sublabel: "Natural language request",
        icon: User,
        color: "bg-slate-500/20 border-slate-400 text-slate-400",
        dot: "bg-slate-400",
        desc: "The user submits a natural-language dietary request, e.g. 'I need a strict keto dinner under 30 min'.",
    },
    {
        id: "prefilter",
        label: "Knowledge Pre-Filter",
        sublabel: "Keto compliance gate",
        icon: Filter,
        color: "bg-amber-500/20 border-amber-400 text-amber-400",
        dot: "bg-amber-400",
        desc: "A rule-based filter narrows the recipe pool to items that satisfy hard nutritional constraints (macro ratios, ingredients) before any LLM call.",
    },
    {
        id: "manager",
        label: "Manager & Item Analyst",
        sublabel: "Candidate ranking",
        icon: Search,
        color: "bg-blue-500/20 border-blue-400 text-blue-400",
        dot: "bg-blue-400",
        desc: "The Manager Agent plans the recommendation strategy. The Item Analyst scores and ranks candidate recipes against user preferences and the active bias configuration.",
    },
    {
        id: "reflector",
        label: "Reflector Agent",
        sublabel: "Iterative validation loop",
        icon: RefreshCw,
        color: "bg-violet-500/20 border-violet-400 text-violet-400",
        dot: "bg-violet-400",
        desc: "The Reflector evaluates the proposed plan against nutritional and preference criteria. On REJECT it sends feedback back to the Manager — the loop runs until ACCEPT or max iterations.",
    },
    {
        id: "output",
        label: "Final Recommendation",
        sublabel: "Accepted meal plan",
        icon: Utensils,
        color: "bg-emerald-500/20 border-emerald-400 text-emerald-400",
        dot: "bg-emerald-400",
        desc: "The accepted recipe recommendation is returned to the user with explanations grounded in the active bias configuration.",
    },
];

const WorkflowDiagram = () => {
    const [active, setActive] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<HTMLButtonElement>(null);
    const reflectorRef = useRef<HTMLButtonElement>(null);
    const [loopY, setLoopY] = useState<{ top: number; bottom: number; rightX: number } | null>(null);
    const activeNode = WORKFLOW_NODES.find((n) => n.id === active);

    useEffect(() => {
        const measure = () => {
            if (!containerRef.current || !managerRef.current || !reflectorRef.current) return;
            const cRect = containerRef.current.getBoundingClientRect();
            const mRect = managerRef.current.getBoundingClientRect();
            const rRect = reflectorRef.current.getBoundingClientRect();
            setLoopY({
                top: mRect.top + mRect.height / 2 - cRect.top,
                bottom: rRect.top + rRect.height / 2 - cRect.top,
                rightX: mRect.right - cRect.left,
            });
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // SVG loop path: starts at right of reflector, curves out, goes up, arrives at right of manager
    const CURVE = 28; // how far right the loop bulges
    const loopPath = loopY
        ? `M ${loopY.rightX} ${loopY.bottom}
       L ${loopY.rightX + CURVE} ${loopY.bottom}
       Q ${loopY.rightX + CURVE + 10} ${loopY.bottom} ${loopY.rightX + CURVE + 10} ${loopY.bottom - 10}
       L ${loopY.rightX + CURVE + 10} ${loopY.top + 10}
       Q ${loopY.rightX + CURVE + 10} ${loopY.top} ${loopY.rightX + CURVE} ${loopY.top}
       L ${loopY.rightX} ${loopY.top}`
        : "";

    return (
        <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-3 select-none">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">
                Multi-Agent Workflow — click a node
            </p>

            <div ref={containerRef} className="relative flex flex-col items-center gap-0">
                {/* SVG overlay for the reject loop */}
                {loopY && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {/* REJECT label */}
                        <text
                            x={loopY.rightX + CURVE + 14}
                            y={(loopY.top + loopY.bottom) / 2}
                            textAnchor="start"
                            dominantBaseline="middle"
                            fill="#f43f5e"
                            fontSize="9"
                            fontWeight="bold"
                            letterSpacing="1"
                        >
                            REJECT
                        </text>
                        {/* Dashed path */}
                        <path
                            d={loopPath}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                            strokeLinecap="round"
                        />
                        {/* Arrowhead pointing down into manager node */}
                        <polygon
                            points={`${loopY.rightX},${loopY.top - 1} ${loopY.rightX - 4},${loopY.top - 8} ${loopY.rightX + 4},${loopY.top - 8}`}
                            fill="#f43f5e"
                        />
                        {/* Animated dot travelling the loop */}
                        <motion.circle
                            r="3"
                            fill="#f43f5e"
                            style={{ offsetPath: `path("${loopPath.replace(/\n\s+/g, " ")}")` } as any}
                            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                )}

                {WORKFLOW_NODES.map((node, i) => {
                    const Icon = node.icon;
                    const isActive = active === node.id;
                    const isManager = node.id === "manager";
                    const isReflector = node.id === "reflector";

                    return (
                        <div key={node.id} className="relative flex flex-col items-center w-full">
                            {/* Connector */}
                            {i > 0 && (
                                <div className="w-px bg-border relative flex items-center justify-center" style={{ height: 24 }}>
                                    <div className="absolute w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "7px solid hsl(var(--border))", bottom: -1 }} />
                                    <motion.div
                                        className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                                        animate={{ y: ["-10px", "10px"], opacity: [0, 1, 0] }}
                                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                                    />
                                </div>
                            )}

                            {/* Node */}
                            <motion.button
                                ref={isManager ? managerRef : isReflector ? reflectorRef : undefined}
                                onClick={() => setActive(active === node.id ? null : node.id)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`w-full max-w-[260px] flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${node.color} ${isActive ? "ring-2 ring-primary ring-offset-1 ring-offset-background shadow-lg" : "hover:brightness-110"}`}
                            >
                                <div className={`p-1.5 rounded-lg border ${node.color}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-bold text-foreground">{node.label}</div>
                                    <div className="text-[10px] text-muted-foreground">{node.sublabel}</div>
                                </div>
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* Description — always reserves space to avoid layout shift */}
            <div className="min-h-[72px] mt-1 px-4 py-3 rounded-xl bg-card border border-border text-xs text-muted-foreground leading-relaxed transition-opacity duration-150"
                style={{ opacity: activeNode ? 1 : 0 }}>
                {activeNode && (
                    <>
                        <span className={`font-bold mr-1 ${activeNode.color.split(" ").find(c => c.startsWith("text-"))}`}>
                            {activeNode.label}:
                        </span>
                        {activeNode.desc}
                    </>
                )}
            </div>
        </div>
    );
};

// Graph Node Component
const AgentNode = ({
    icon: Icon,
    title,
    content,
    isActive,
    status,
    biasColor
}: {
    icon: any,
    title: React.ReactNode,
    content?: string,
    isActive: boolean,
    status?: "success" | "error" | "neutral",
    biasColor: string
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-5 rounded-2xl border-2 transition-all ${isActive
                ? `border-primary shadow-lg bg-card z-10 scale-[1.02]`
                : `border-border bg-muted/30 opacity-70`
                }`}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${isActive
                    ? `bg-primary/20 text-primary`
                    : `bg-muted text-muted-foreground`
                    }`}>
                    <Icon size={20} />
                </div>
                <h4 className="font-bold text-foreground">{title}</h4>

                {status === "success" && <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />}
                {status === "error" && <XCircle size={18} className="text-rose-500 ml-auto" />}
            </div>

            {content && (
                <div className={`font-mono text-xs leading-relaxed max-w-full overflow-hidden p-3 rounded-lg border ${isActive ? `bg-muted/50 border-primary/20` : 'border-transparent bg-transparent'
                    }`}>
                    <div className="line-clamp-4 text-muted-foreground whitespace-pre-wrap">
                        {content}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

interface BiasDemoProps {
    isOpen: boolean;
    onClose: () => void;
}

const BiasDemo = ({ isOpen, onClose }: BiasDemoProps) => {
    const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
    const [activeBias, setActiveBias] = useState<string>("no_biase");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const queriesList = Object.values(biasData.queries);
    const activeQuery = selectedQueryId
        ? biasData.queries[selectedQueryId as keyof typeof biasData.queries]
        : queriesList[0];

    const handleQueryChange = (id: string) => {
        setSelectedQueryId(id);
        setIsDropdownOpen(false);
    };

    const currentResult = activeQuery?.results[activeBias as keyof typeof activeQuery.results] as any;
    const isAccepted = currentResult?.decision === "ACCEPT";
    const isRejected = currentResult?.decision === "REJECT";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-2 md:inset-10 z-[101] flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="w-full h-full max-w-6xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative">

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-20"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

                                <div className="relative z-10 max-w-5xl mx-auto">
                                    <div className="mb-8 pr-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">
                                                <BarChart3 size={16} /> B.A. Thesis Interactive Showcase
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                                                Multi-Agent Bias Analysis
                                            </h2>
                                        </div>
                                        <div className="text-muted-foreground text-sm font-mono bg-muted/50 px-4 py-2 rounded-lg border border-border">
                                            Year: 2025 | Domain: LLMs, LangGraph
                                        </div>
                                    </div>

                                    {/* Research Abstract Section */}
                                    <div className="mb-12 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                    <FileText className="text-primary" size={20} /> Research Abstract
                                                </h3>
                                                <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
                                                    <p>
                                                        How do you balance user preferences with health compliance in a recommender system? This thesis embeds expert ketogenic dietary knowledge into a <strong className="text-foreground">multi-agent system</strong> built on LangGraph — combining a rule-based pre-filter with iteratively self-correcting analyst and reflector agents.
                                                    </p>
                                                    <p>
                                                        The system was evaluated under <strong className="text-foreground">four bias configurations</strong> — from No Bias to strict System Bias — revealing a core trade-off: stricter knowledge integration yields near-perfect keto compliance but reduces coverage and increases runtime.
                                                    </p>
                                                    <p>
                                                        An ablation study confirms the <strong className="text-foreground">Reflector Agent</strong> as the key driver of compliance. The workflow on the right shows the full execution graph — click any node to learn more.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Workflow Diagram */}
                                            <WorkflowDiagram />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Activity className="text-primary" size={20} /> Aggregate Performance Metrics
                                    </h3>

                                    {/* Global Stats Dashboard */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                                        {biasData.biases.map((biasKey) => {
                                            const stats = biasData.stats[biasKey as keyof typeof biasData.stats];
                                            const successRate = Math.round((stats.accepted / stats.totalRequests) * 100);
                                            const avgIterations = (stats.totalIterations / stats.totalRequests).toFixed(1);

                                            return (
                                                <button
                                                    key={biasKey}
                                                    onClick={() => setActiveBias(biasKey)}
                                                    className={`p-5 rounded-2xl border text-left flex flex-col transition-all duration-300 ${activeBias === biasKey
                                                        ? `border-primary shadow-lg bg-card ring-1 ring-primary scale-[1.02]`
                                                        : `border-border bg-card/50 hover:bg-card hover:border-primary/50`
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className={`w-3 h-3 rounded-full ${biasColors[biasKey]}`} />
                                                        <h3 className="font-semibold text-sm">{biasLabels[biasKey]}</h3>
                                                    </div>

                                                    <div className="mt-auto">
                                                        <div className="flex items-end gap-2 mb-1">
                                                            <span className={`text-3xl font-bold ${activeBias === biasKey ? 'text-foreground' : 'text-foreground/80'}`}>{successRate}%</span>
                                                            <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">Success</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                                                            <Activity size={14} />
                                                            <span>Avg. {avgIterations} iterations</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Interactive Graph Section */}
                                    <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-6 border-b border-border/50">
                                            <div>
                                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                                    Graph Viewer
                                                </h3>
                                                <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">
                                                    Trace the exact agent dialogue for a specific user request. Switch between the 4 biases above to see how the graph execution changes.
                                                </p>
                                            </div>

                                            {/* Custom Dropdown */}
                                            <div className="relative w-full md:w-[400px] shrink-0 z-30">
                                                <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Select User Request</div>
                                                <button
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl text-left hover:border-primary/50 transition-colors shadow-sm"
                                                >
                                                    <span className="truncate pr-4 text-sm font-medium">
                                                        {activeQuery ? `Query ${queriesList.indexOf(activeQuery) + 1}: ${activeQuery.query.substring(0, 40)}...` : "Select request"}
                                                    </span>
                                                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="absolute right-0 top-full mt-2 w-[400px] max-h-[300px] overflow-y-auto bg-card border border-border rounded-xl shadow-2xl"
                                                        >
                                                            {queriesList.map((q, idx) => (
                                                                <button
                                                                    key={q.id}
                                                                    onClick={() => handleQueryChange(q.id)}
                                                                    className={`w-full text-left px-4 py-4 text-sm hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0 ${activeQuery?.id === q.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}
                                                                >
                                                                    <div className="text-xs text-muted-foreground/50 mb-1 font-semibold uppercase tracking-wider">Request {idx + 1}</div>
                                                                    <div className="line-clamp-2 leading-relaxed">{q.query}</div>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {currentResult && (
                                            <div className="space-y-8">
                                                {/* The Full User Query */}
                                                <div className="px-6 py-4 rounded-xl bg-muted/50 border border-border inline-block max-w-[80%]">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">U</div>
                                                        <div>
                                                            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">User Input</div>
                                                            <div className="text-foreground leading-relaxed font-medium">"{activeQuery.query}"</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Visual Conversation Graph mapping the loop */}
                                                <div className="pl-6 md:pl-12 py-6 relative">
                                                    {/* Vertical connecting line */}
                                                    <div className="absolute left-[39px] md:left-[63px] top-6 bottom-16 w-0.5 bg-border -z-10" />

                                                    <div className="space-y-10">
                                                        {/* Node 1: Retrieval / Planning */}
                                                        <div className="flex gap-6 items-start relative">
                                                            <ArrowRight size={20} className="absolute -left-10 top-6 text-muted-foreground" />
                                                            <div className="w-full max-w-3xl">
                                                                <AgentNode
                                                                    icon={Search}
                                                                    title="Manager & Item Analyst"
                                                                    isActive={true}
                                                                    biasColor={biasTextColors[activeBias]}
                                                                    content={currentResult.plannerDraft}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Node 2: Reflection */}
                                                        <div className="flex gap-6 items-start relative">
                                                            <CornerDownRight size={24} className="absolute -left-10 top-6 text-muted-foreground" />
                                                            <div className="w-full max-w-3xl ml-auto md:ml-12">
                                                                <AgentNode
                                                                    icon={Bot}
                                                                    title={<>Reflector Engine <span className="ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-muted text-muted-foreground border border-border tracking-wider">{currentResult.iterations} Loop{currentResult.iterations !== 1 && 's'}</span></>}
                                                                    isActive={true}
                                                                    biasColor={biasTextColors[activeBias]}
                                                                    content={currentResult.reflectorAnalysis}
                                                                    status={isAccepted ? "success" : isRejected ? "error" : "neutral"}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Node 3: Result Feedback */}
                                                        {isAccepted && (
                                                            <div className="flex gap-6 items-start relative">
                                                                <ArrowRight size={20} className="absolute -left-10 top-6 text-emerald-500" />
                                                                <div className="w-full max-w-3xl">
                                                                    <div className={`p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 shadow-sm`}>
                                                                        <div className="flex items-center gap-2 mb-3">
                                                                            <CheckCircle2 size={20} className="text-emerald-500" />
                                                                            <h4 className="font-bold text-emerald-600 dark:text-emerald-400">Final Validation: Accepted</h4>
                                                                        </div>
                                                                        <div className="font-mono text-xs leading-relaxed max-w-full overflow-hidden p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 whitespace-pre-wrap">
                                                                            {currentResult.finalPlan}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {isRejected && (
                                                            <div className="flex gap-6 items-start relative">
                                                                <ArrowRight size={20} className="absolute -left-10 top-6 text-rose-500" />
                                                                <div className="w-full max-w-3xl">
                                                                    <div className={`p-5 rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 shadow-sm`}>
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <XCircle size={20} className="text-rose-500" />
                                                                            <h4 className="font-bold text-rose-600 dark:text-rose-400">Final Validation: Rejected</h4>
                                                                        </div>
                                                                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                                                            The agent network terminated execution. It could not reconcile the user's request against the strict persona constraints of <span className="font-bold">{biasLabels[activeBias]}</span> after {currentResult.iterations} iterations.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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

export default BiasDemo;
