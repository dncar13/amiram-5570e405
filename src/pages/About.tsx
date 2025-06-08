
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import HowItWorks from "@/components/about/HowItWorks";
import WhatMakesUsSpecial from "@/components/about/WhatMakesUsSpecial";
import TestimonialSection from "@/components/about/TestimonialSection";
import OurPromise from "@/components/about/OurPromise";
import CTASection from "@/components/about/CTASection";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pb-16">
        <div className="container mx-auto px-4 py-12">
          <AboutHero />
          <WhyChooseUs />
          <HowItWorks />
          <WhatMakesUsSpecial />
          <TestimonialSection />
          <OurPromise />
          <CTASection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
