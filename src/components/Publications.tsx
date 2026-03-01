import { FileText } from "lucide-react";
import { motion } from "framer-motion";

interface Publication {
  title: string;
  venue: string;
  year: number;
  link?: string;
}

const publications: Publication[] = [
  {
    title: "Step Detection in Pedestrian Dead Reckoning Using Transformer Models",
    venue: "Workshop on Indoor Navigation, IPIN 2025",
    year: 2025,
    link: "#",
  },
  {
    title: "Explainability Methods for IMU-Based Activity Recognition",
    venue: "HCAI Seminar, University of Regensburg",
    year: 2024,
    link: "#",
  },
  {
    title: "Building Student AI Communities: Lessons from URAI",
    venue: "Talk at AI Bavaria Meetup",
    year: 2024,
  },
];

const Publications = () => (
  <section id="publications" className="py-28">
    <div className="container max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
        Publications & Talks
      </h2>

      <div className="mt-10 space-y-6">
        {publications.map((pub, i) => (
          <motion.div
            key={pub.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h3 className="text-sm font-medium text-foreground leading-snug">{pub.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {pub.venue} · {pub.year}
              </p>
            </div>
            {pub.link && (
              <a
                href={pub.link}
                className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View publication"
              >
                <FileText size={16} />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Publications;
