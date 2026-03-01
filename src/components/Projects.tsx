import { Github, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  paper?: string;
}

const projects: Project[] = [
  {
    title: "Indoor Navigation with IMU Sensors",
    description: "Pedestrian dead reckoning using smartphone IMU data and deep learning for step detection and heading estimation.",
    tags: ["PyTorch", "IMU", "LSTM", "Indoor Nav"],
    github: "#",
  },
  {
    title: "Explainable AI for Sensor Models",
    description: "Applying XAI techniques to make neural network predictions on sensor data interpretable and trustworthy.",
    tags: ["XAI", "SHAP", "Python", "Deep Learning"],
    github: "#",
    paper: "#",
  },
  {
    title: "URAI – Student AI Initiative",
    description: "Founded and lead a university AI initiative connecting students with hands-on AI projects and workshops.",
    tags: ["Community", "AI Education", "Leadership"],
    github: "#",
  },
  {
    title: "AI-Assisted Music Production",
    description: "Exploring generative AI tools for creative music production workflows and sound design.",
    tags: ["Generative AI", "Audio", "Creativity"],
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="group rounded-xl bg-card p-6 border border-border/60 hover:border-primary/20 transition-colors duration-300"
  >
    <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{project.description}</p>

    <div className="mt-4 flex flex-wrap gap-1.5">
      {project.tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-tag text-tag-foreground"
        >
          {tag}
        </span>
      ))}
    </div>

    <div className="mt-4 flex gap-3">
      {project.github && (
        <a href={project.github} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
          <Github size={16} />
        </a>
      )}
      {project.paper && (
        <a href={project.paper} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Paper">
          <FileText size={16} />
        </a>
      )}
    </div>
  </motion.div>
);

const Projects = () => (
  <section id="projects" className="py-28">
    <div className="container">
      <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
        Research & Projects
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
