
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import DetailedFeaturesSection from "@/components/homepage/DetailedFeaturesSection";
import FAQSection from "@/components/homepage/FAQSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import FounderSection from "@/components/homepage/FounderSection";
import ContactSection from "@/components/homepage/ContactSection";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Rubik, sans-serif' }}>
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
