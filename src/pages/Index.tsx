import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountdownBanner from "@/components/CountdownBanner";
import SocialProofBar from "@/components/SocialProofBar";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import TrioSection from "@/components/TrioSection";
import ComparisonTable from "@/components/ComparisonTable";
import HowItWorks from "@/components/HowItWorks";
import OptimisticModel from "@/components/OptimisticModel";
import VisionSection from "@/components/VisionSection";
import ArticlesSection from "@/components/ArticlesSection";
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
      <TrioSection />
      <ComparisonTable />
      <HowItWorks />
      <OptimisticModel />
      <VisionSection />
      <ArticlesSection />
      <ResearchReferences />
      <TechSpecs />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
