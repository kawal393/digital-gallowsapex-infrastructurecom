import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ComparisonTable from "@/components/ComparisonTable";
import OptimisticModel from "@/components/OptimisticModel";
import BusinessModel from "@/components/BusinessModel";
import TechSpecs from "@/components/TechSpecs";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div id="top" className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <ComparisonTable />
      <OptimisticModel />
      <BusinessModel />
      <TechSpecs />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
