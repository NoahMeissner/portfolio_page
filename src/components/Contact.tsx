import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  { icon: Mail, href: "mailto:noah@example.com", label: "Email" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const Contact = () => (
  <section id="contact" className="py-28 bg-secondary/40">
    <div className="container max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
          Get in Touch
        </h2>
        <div className="mt-8 flex justify-center gap-6">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-3 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors duration-200"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default Contact;
