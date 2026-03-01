import { motion } from "framer-motion";

const URAI = () => (
  <section id="urai" className="py-28 bg-urai">
    <div className="container max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-medium text-primary uppercase tracking-widest">Initiative</p>
        <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-foreground">
          URAI
        </h2>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          I founded URAI — a student-led AI initiative at the University of Regensburg — to bridge the gap between academic AI research and hands-on learning. We organize workshops, reading groups, and collaborative projects that give students practical experience with machine learning, computer vision, and NLP. Our goal is to build a community where curiosity drives innovation.
        </p>
      </motion.div>
    </div>
  </section>
);

export default URAI;
