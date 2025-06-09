import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import existing components
import Header from '@/components/Header'; // או Navbar אם תרצה להחליף
import HeroSection from '@/components/homepage/HeroSection';
import FeatureCards from '@/components/homepage/FeatureCards'; // הקומפוננטה החדשה שיצרתי
import StatsSection from '@/components/homepage/StatsSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import CTASection from '@/components/homepage/CTASection';
import FAQSection from '@/components/homepage/FAQSection';
import Footer from '@/components/Footer';

// Optional: Skeleton Loaders
import { SkeletonPage } from '@/components/ui/skeleton-loader';

const Index: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Loading state with skeleton
  if (loading) {
    return <SkeletonPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      
      {/* Hero Section with parallax */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <HeroSection />
      </motion.div>

      {/* Feature Cards - New Apple-style component */}
      <AnimatedSection>
        <FeatureCards />
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection delay={0.2}>
        <StatsSection />
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection delay={0.3}>
        <TestimonialsSection />
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection delay={0.4}>
        <FAQSection />
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection delay={0.5}>
        <CTASection />
      </AnimatedSection>

      <Footer />
    </motion.div>
  );
};

// Reusable animated section component
const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.8,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default Index;