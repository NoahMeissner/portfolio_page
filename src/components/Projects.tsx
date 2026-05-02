import { useState } from "react";
import { Github, FileText, Play } from "lucide-react";
import { motion } from "framer-motion";
import fm from "front-matter";
import BiasDemo from "./BiasDemo";
import LiteraturDemo from "./LiteraturDemo";
import projectsRaw from "../content/projects.md?raw";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  paper?: string;
  hasDemo?: boolean;
  badge?: string;
  category: "featured" | "research" | "software";
}

const { attributes } = fm<{ projects: Project[] }>(projectsRaw);
const { projects } = attributes;

const featured = projects.filter((p) => p.category === "featured");
const software = projects.filter((p) => p.category === "software");

const FeaturedCard = ({ project, index, onOpenDemo }: { project: Project; index: number; onOpenDemo: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
    className="group relative rounded-2xl bg-card p-6 border border-border/60 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    <div className="relative z-10 flex flex-col h-full">
      {project.badge && (
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary uppercase tracking-wide">
            {project.badge}
          </span>
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{project.title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-tag text-tag-foreground">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-6 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all cursor-pointer" aria-label="GitHub">
              <Github size={18} />
            </a>
          )}
          {project.paper && (
            <a href={project.paper} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all cursor-pointer" aria-label="Paper">
              <FileText size={18} />
            </a>
          )}
        </div>
        {project.hasDemo && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDemo(); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm ml-auto"
          >
            <Play size={16} /> Live Demo
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

const SoftwareCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.35, delay: index * 0.08 }}
    className="group rounded-xl bg-card p-4 border border-border/50 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
  >
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200">{project.title}</h3>
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors shrink-0" aria-label="GitHub">
          <Github size={15} />
        </a>
      )}
    </div>
    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{project.description}</p>
    <div className="mt-3 flex flex-wrap gap-1.5">
      {project.tags.map((tag) => (
        <span key={tag} className="px-2 py-0.5 text-xs font-medium rounded-full bg-tag text-tag-foreground">
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

const Projects = () => {
  const [openDemo, setOpenDemo] = useState<string | null>(null);

  return (
    <section id="projects" className="py-28 relative">
      <div className="container relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Research & Projects
        </h2>

        {/* Featured */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {featured.map((p, i) => (
            <FeaturedCard key={p.title} project={p} index={i} onOpenDemo={() => setOpenDemo(p.title)} />
          ))}
        </div>

        {/* Software Projects */}
        <h3 className="mt-14 text-lg font-bold text-muted-foreground uppercase tracking-widest">
          Software Projects
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {software.map((p, i) => (
            <SoftwareCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>

      <BiasDemo isOpen={openDemo === "FoMaRec – Food Multi-Agent Recommender"} onClose={() => setOpenDemo(null)} />
      <LiteraturDemo isOpen={openDemo === "LiteraturResearcher"} onClose={() => setOpenDemo(null)} />
    </section>
  );
};

export default Projects;
