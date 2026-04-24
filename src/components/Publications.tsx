import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import fm from "front-matter";
import publicationsRaw from "../content/publications.md?raw";

interface Publication {
  year: string;
  title: string;
  venue: string;
  authors: string;
  details: string[];
  link?: string;
}

const { attributes } = fm<{ publications: Publication[] }>(publicationsRaw);
const { publications } = attributes;

const Publications = () => (
  <section id="publications" className="py-28">
    <div className="container max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
        Publications & Talks
      </h2>

      <div className="mt-12 space-y-8">
        {publications.map((pub, i) => (
          <motion.div
            key={pub.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="group relative p-6 md:p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-3 w-full">
                <div className="flex flex-wrap flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                    {pub.year}
                  </span>
                  <span className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {pub.link ? (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  <span className="text-foreground/80">{pub.authors}</span> — {pub.venue}
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground pt-2">
                  {pub.details.map((detail, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Publications;
