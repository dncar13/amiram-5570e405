
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import PremiumShowcase from "@/components/homepage/PremiumShowcase";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
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
        <PremiumShowcase />
        <FeaturesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
