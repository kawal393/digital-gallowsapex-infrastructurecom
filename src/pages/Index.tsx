import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountdownBanner from "@/components/CountdownBanner";
import SocialProofBar from "@/components/SocialProofBar";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ComparisonTable from "@/components/ComparisonTable";
import OptimisticModel from "@/components/OptimisticModel";
import ArticlesSection from "@/components/ArticlesSection";
import BusinessModel from "@/components/BusinessModel";
import ResearchReferences from "@/components/ResearchReferences";
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
      <CountdownBanner />
      <SocialProofBar />
      <ProblemSection />
      <SolutionSection />
      <ComparisonTable />
      <OptimisticModel />
      <ArticlesSection />
      <BusinessModel />
      <ResearchReferences />
      <TechSpecs />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
