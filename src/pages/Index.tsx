import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import URAI from "@/components/URAI";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";

const Index = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Projects />
      <About />
      <URAI />
      <Publications />
      <Contact />
    </main>
    <footer className="py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Noah. Built with care.
    </footer>
  </>
);

export default Index;
