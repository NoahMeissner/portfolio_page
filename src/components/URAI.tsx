import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import fm from "front-matter";
import uraiRaw from "../content/urai.md?raw";

interface URAIData {
  role: string;
  name: string;
  tagline: string;
  linkUrl: string;
  logoUrl: string;
  period: string;
  description: string;
  highlights: string[];
  stats: { label: string; value: string }[];
}

interface AwardItem {
  title: string;
  issuer: string;
  period: string;
  description: string;
}

const { attributes } = fm<{ urai: URAIData; awards: AwardItem[] }>(uraiRaw);
const { urai, awards = [] } = attributes;

const URAI = () => (
  <section id="urai" className="py-28 bg-urai">
    <div className="container max-w-2xl space-y-6">

      {/* ── URAI Feature Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm overflow-hidden relative"
      >
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
              <img src={urai.logoUrl} alt="URAI Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-foreground">{urai.name}</h2>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{urai.period}</p>
            </div>
            <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary uppercase tracking-wide shrink-0">
              Co-Founder & President
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {urai.description}
          </p>

          <a
            href={urai.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            urai-group.com <ExternalLink size={12} />
          </a>
        </div>
      </motion.div>

      {/* ── Awards ── */}
      {awards.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-card border border-border/50 rounded-3xl p-6 md:p-7 shadow-sm flex gap-3 items-start group"
        >
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <div>
                <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.issuer}</p>
              </div>
              <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary uppercase tracking-wide shrink-0">
                Scholarship
              </span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-2">{item.period}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        </motion.div>
      ))}

    </div>
  </section>
);

export default URAI;
