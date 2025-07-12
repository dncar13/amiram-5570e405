
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModernAboutHero from "@/components/about/ModernAboutHero";
import ModernStorySection from "@/components/about/ModernStorySection";
import ModernStatsSection from "@/components/about/ModernStatsSection";
import ModernFeaturesSection from "@/components/about/ModernFeaturesSection";
import ModernCTASection from "@/components/about/ModernCTASection";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <main className="overflow-hidden">
        <ModernAboutHero />
        <ModernStorySection />
        <ModernStatsSection />
        <ModernFeaturesSection />
        <ModernCTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
