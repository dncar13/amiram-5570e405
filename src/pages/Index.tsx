import React from "react";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import PremiumShowcase from "@/components/homepage/PremiumShowcase";
import ContactSection from "@/components/homepage/ContactSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      {!currentUser && <PremiumShowcase />}
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
