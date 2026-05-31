import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import { MapBackground } from "./MapBackground";
import { TetrGameModal } from "./TetrGameModal";
import heroRaw from "../content/hero.md?raw";

const { attributes, body } = fm<{ typeSequence: (string | number)[] }>(heroRaw);

const Hero = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const handleProfileClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setIsGameOpen(true);
        return 0; // Reset after triggering
      }
      return newCount;
    });
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
      <TetrGameModal isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
      <div className="container max-w-2xl flex flex-col items-center text-center mt-28 pointer-events-none relative z-10">
        {/* Making the container pointer-events-none so we can interact with the globe behind it,
          but we need to re-enable pointer-events for interactive elements inside */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
          className="relative mb-8 flex items-center justify-center pointer-events-auto"
        >
          {/* 2D Map Behind the Profile Pic */}
          <div className="absolute w-[800px] h-[800px] pointer-events-none -z-10">
            <MapBackground />
          </div>

          {/* Radar Ping Effect */}
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-[-10px] rounded-full border border-primary/20 animate-pulse" style={{ animationDuration: '4s' }}></div>

          {/* Profile Image with Click Handler */}
          <div
            className="relative z-10 w-44 h-44 rounded-full overflow-hidden border-4 border-background/50 shadow-2xl cursor-pointer transition-transform active:scale-95"
            onClick={handleProfileClick}
            title="Click 3 times for a surprise"
          >
            <img
              src={`${import.meta.env.BASE_URL}profile.png`}
              alt="Noah Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 leading-tight"
        >
          Noah
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-sm md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 font-bold tracking-wide h-6 md:h-8"
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
          className="mt-8 flex gap-3 justify-center pointer-events-auto"
        >
          <a
            href="#projects"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary hover:scale-[1.02] transition-all duration-300"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
