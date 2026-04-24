import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import aboutRaw from "../content/about.md?raw";

interface Education {
  degree: string;
  school: string;
  period?: string;
  details?: string[];
}

interface Work {
  role: string;
  company: string;
  period?: string;
  details?: string[];
}

interface TechCategory {
  category: string;
  skills: string[];
}

interface AboutAttributes {
  techStack: TechCategory[];
  languages: string[];
  education: Education[];
  work: Work[];
}

const { attributes, body } = fm<AboutAttributes>(aboutRaw);
const { techStack, languages, education, work } = attributes;

const About = () => (
  <section id="about" className="py-28 bg-secondary/40">
    <div className="container max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">About</h2>
        <div className="mt-6 text-base text-muted-foreground leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techStack.map((cat, i) => (
              <div key={i}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
                  {cat.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs font-medium rounded-full border border-border text-muted-foreground bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-default shadow-sm hover:shadow"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
                Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <span
                    key={l}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-border text-muted-foreground bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-default shadow-sm hover:shadow"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Education Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Education</h3>
            </div>
            <div className="space-y-6">
              {education.map((item, i) => (
                <div key={i} className="group relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors duration-300">
                  <div className="absolute w-3 h-3 bg-primary/20 rounded-full -left-[7px] top-1.5 flex items-center justify-center group-hover:bg-primary/40 group-hover:scale-125 transition-all duration-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">{item.degree}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.school}</p>
                  {item.period && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {item.period}
                    </span>
                  )}
                  {item.details && (
                    <ul className="mt-3 space-y-1.5 list-disc list-inside text-sm text-muted-foreground">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="leading-relaxed"><span className="text-foreground/80">{detail.split(':')[0]}</span>{detail.includes(':') ? ':' + detail.split(':').slice(1).join(':') : ''}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Experience</h3>
            </div>
            <div className="space-y-6">
              {work.map((item, i) => (
                <div key={i} className="group relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors duration-300">
                  <div className="absolute w-3 h-3 bg-primary/20 rounded-full -left-[7px] top-1.5 flex items-center justify-center group-hover:bg-primary/40 group-hover:scale-125 transition-all duration-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">{item.role}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.company}</p>
                  {item.period && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {item.period}
                    </span>
                  )}
                  {item.details && (
                    <ul className="mt-3 space-y-1.5 list-disc list-inside text-sm text-muted-foreground">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="leading-relaxed"><span className="text-foreground/80">{detail.split(':')[0]}</span>{detail.includes(':') ? ':' + detail.split(':').slice(1).join(':') : ''}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
