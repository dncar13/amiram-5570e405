
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import DetailedFeaturesSection from "@/components/homepage/DetailedFeaturesSection";
import FAQSection from "@/components/homepage/FAQSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import ContactSection from "@/components/homepage/ContactSection";
import StatsSection from "@/components/homepage/StatsSection";
import CTASection from "@/components/homepage/CTASection";
import DebugStoriesSection from "@/components/homepage/DebugStoriesSection";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Assistant, sans-serif' }}>
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        
        {/* DEBUG: Add temporary debug section */}
        <section className="py-8 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <DebugStoriesSection />
          </div>
        </section>
        
        <FeaturesSection />
        <DetailedFeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
