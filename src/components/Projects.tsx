import { useState } from "react";
import { Github, FileText, Play } from "lucide-react";
import { motion } from "framer-motion";
import fm from "front-matter";
import BiasDemo from "./BiasDemo";
import projectsRaw from "../content/projects.md?raw";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  paper?: string;
  hasDemo?: boolean;
}

const { attributes } = fm<{ projects: Project[] }>(projectsRaw);
const { projects } = attributes;

const ProjectCard = ({ project, index, onOpenDemo }: { project: Project; index: number; onOpenDemo: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
    className="group relative rounded-2xl bg-card p-6 border border-border/60 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
  >
    {/* Subtle gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

    <div className="relative z-10 flex flex-col h-full">
      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{project.title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-semibold rounded-full bg-tag text-tag-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          {project.github && (
            <a href={project.github} className="text-muted-foreground hover:text-primary hover:scale-110 transition-all cursor-pointer" aria-label="GitHub">
              <Github size={18} />
            </a>
          )}
          {project.paper && (
            <a href={project.paper} className="text-muted-foreground hover:text-primary hover:scale-110 transition-all cursor-pointer" aria-label="Paper">
              <FileText size={18} />
            </a>
          )}
        </div>

        {project.hasDemo && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDemo(); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm ml-auto"
          >
            <Play size={16} /> Optional Demo
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section id="projects" className="py-28 relative">
      <div className="container relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Research & Projects
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} onOpenDemo={() => setIsDemoOpen(true)} />
          ))}
        </div>
      </div>

      {/* Bias Demo Modal Overlay */}
      <BiasDemo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </section>
  );
};

export default Projects;
