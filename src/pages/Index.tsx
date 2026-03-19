import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ComplianceClock from "@/components/ComplianceClock";
import SocialProofBar from "@/components/SocialProofBar";
import ProblemSection from "@/components/ProblemSection";
import VisionSection from "@/components/VisionSection";
import NDISComplianceSection from "@/components/NDISComplianceSection";
import SolutionSection from "@/components/SolutionSection";
import TrioSection from "@/components/TrioSection";
import TrustSection from "@/components/TrustSection";
import SocialProofWall from "@/components/SocialProofWall";
import RegulatoryAlignment from "@/components/RegulatoryAlignment";
import OptimisticModel from "@/components/OptimisticModel";
import HowItWorks from "@/components/HowItWorks";
import LiveCaseStudy from "@/components/LiveCaseStudy";
import ComparisonTable from "@/components/ComparisonTable";
import FreeToolsCTA from "@/components/FreeToolsCTA";
import BusinessModel from "@/components/BusinessModel";
import TechSpecs from "@/components/TechSpecs";
import FeaturedResearch from "@/components/FeaturedResearch";
import ArticlesSection from "@/components/ArticlesSection";
import ResearchReferences from "@/components/ResearchReferences";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import TrafficNoticeBanner from "@/components/TrafficNoticeBanner";
import OpenSourceGateway from "@/components/OpenSourceGateway";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TrafficNoticeBanner />
      <Navbar />
      <div id="top" />
      <Hero />
      <VisionSection />
      <ComplianceClock />
      <SocialProofBar />
      <OpenSourceGateway />
      <ProblemSection />
      <NDISComplianceSection />
      <FreeToolsCTA />
      <SolutionSection />
      <TrioSection />
      <TrustSection />
      <OptimisticModel />
      <HowItWorks />
      <LiveCaseStudy />
      <ComparisonTable />
      <BusinessModel />
      <TechSpecs />
      <FeaturedResearch />
      <ArticlesSection />
      <ResearchReferences />
      <Pricing />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
