import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrioSection from "@/components/TrioSection";
import HowItWorks from "@/components/HowItWorks";
import ArticlesSection from "@/components/ArticlesSection";
import TrustSection from "@/components/TrustSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navbar />
      <Hero />
      <TrioSection />
      <HowItWorks />
      <ArticlesSection />
      <TrustSection />
      <Pricing />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
