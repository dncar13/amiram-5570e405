
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedHeroSection from "@/components/homepage/EnhancedHeroSection";
import EnhancedFeaturesSection from "@/components/homepage/EnhancedFeaturesSection";
import EnhancedStatsSection from "@/components/homepage/EnhancedStatsSection";
import DetailedFeaturesSection from "@/components/homepage/DetailedFeaturesSection";
import FAQSection from "@/components/homepage/FAQSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import ContactSection from "@/components/homepage/ContactSection";
import CTASection from "@/components/homepage/CTASection";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Assistant, sans-serif' }}>
      <Header />
      
      <main className="flex-grow">
        <EnhancedHeroSection />
        <EnhancedStatsSection />
        <EnhancedFeaturesSection />
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
