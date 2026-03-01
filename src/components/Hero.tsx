import { motion } from "framer-motion";

const Hero = () => (
  <section className="pt-32 pb-28 md:pt-44 md:pb-36">
    <div className="container max-w-2xl">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-light tracking-tight text-foreground leading-tight"
      >
        Noah
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-3 text-sm md:text-base text-primary font-medium tracking-wide"
      >
        Human-Centered AI · Indoor Navigation · XAI
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
      >
        Master's student in Human-Centered AI at the University of Regensburg. I research indoor navigation systems, IMU sensor data processing, and Explainable AI — making intelligent systems more transparent and useful for people.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex gap-3"
      >
        <a
          href="#projects"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="inline-flex items-center px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
        >
          Contact Me
        </a>
      </motion.div>
    </div>
  </section>
);

export default Hero;
