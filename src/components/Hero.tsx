import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import heroRaw from "../content/hero.md?raw";

const { attributes, body } = fm<{ typeSequence: (string | number)[] }>(heroRaw);

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
      <div className="container max-w-2xl flex flex-col items-center text-center mt-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-8 flex items-center justify-center"
        >
          <div className="relative z-10 w-44 h-44 rounded-full overflow-hidden border-4 border-background shadow-lg">
            <img
              src={`${import.meta.env.BASE_URL}profile.png`}
              alt="Noah Meißner"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-tight"
        >
          Noah Meißner
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-sm md:text-lg text-primary font-semibold tracking-wide h-6 md:h-8"
        >
          <TypeAnimation
            sequence={attributes.typeSequence}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl [&>p]:mb-4 last:[&>p]:mb-0"
        >
          <ReactMarkdown>{body}</ReactMarkdown>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex gap-3 justify-center"
        >
          <a
            href="#projects"
            className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-md border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors duration-200"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
