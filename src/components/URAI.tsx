import { motion } from "framer-motion";
import { Award } from "lucide-react";
import fm from "front-matter";
import uraiRaw from "../content/urai.md?raw";

interface Initiative {
  title: string;
  linkText: string;
  linkUrl: string;
  period: string;
  description: string;
  iconType: string;
  iconUrl?: string;
}

interface AwardItem {
  title: string;
  issuer: string;
  period: string;
  description: string;
  iconType: string;
}

const { attributes } = fm<{ initiatives: Initiative[]; awards: AwardItem[] }>(uraiRaw);
const { initiatives = [], awards = [] } = attributes;

const URAI = () => (
  <section id="urai" className="py-28 bg-urai">
    <div className="container max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-10">
          Awards & Initiatives
        </h2>

        <div className="space-y-8">
          {initiatives.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 md:items-start group">
              <div className="p-3 rounded-xl bg-primary/10 shrink-0 mt-1 flex items-center justify-center">
                {item.iconType === "image" && item.iconUrl ? (
                  <img src={item.iconUrl} alt="Logo" className="w-5 h-5 object-contain" />
                ) : (
                  <Award className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm font-medium text-foreground/80">
                      <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors hover:text-primary">
                        {item.linkText}
                      </a>
                    </p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">{item.period}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {initiatives.length > 0 && awards.length > 0 && (
            <div className="w-full h-px bg-border/40" />
          )}

          {awards.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 md:items-start group">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 mt-1">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm font-medium text-foreground/80">{item.issuer}</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">{item.period}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default URAI;
