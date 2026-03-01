import { motion } from "framer-motion";

const techStack = [
  "Python", "PyTorch", "TensorFlow", "React", "TypeScript", "Tailwind CSS", "Git", "Docker"
];

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
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          I'm a researcher and builder at the intersection of AI and human experience. Currently pursuing my Master's in Human-Centered AI at the University of Regensburg, I'm passionate about making intelligent systems that people can actually understand and trust. Beyond research, I enjoy skiing in the Alps, producing music with AI tools, and thinking about how we can make AI more sustainable and accessible.
        </p>

        <div className="mt-10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs font-medium rounded-full border border-border text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
