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
import KnowledgeSection from '@/components/homepage/KnowledgeSection';
import Footer from '@/components/Footer';

// Optional: Skeleton Loaders
import { SkeletonPage } from '@/components/ui/skeleton-loader';

const Index: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
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
      data-testid="homepage"
    >
      <Header />
      
      <main id="main-content" role="main">
        {/* Hero Section with parallax */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <HeroSection />
      </motion.div>

      {/* Feature Cards - Condensed on mobile - זוז ישר אחרי ההירו */}
      <div className="-mt-20 relative z-10">
        <AnimatedSection>
          <FeatureCards />
        </AnimatedSection>
      </div>

      {/* Stats Section - Only show on mobile if space allows */}
      {!isMobile && (
        <AnimatedSection delay={0.2}>
          <StatsSection />
        </AnimatedSection>
      )}

      {/* Testimonials - Simplified on mobile */}
      <AnimatedSection delay={isMobile ? 0.2 : 0.3}>
        <TestimonialsSection />
      </AnimatedSection>

      <AnimatedSection delay={isMobile ? 0.25 : 0.35}>
        <KnowledgeSection />
      </AnimatedSection>
      {/* FAQ Section - Condensed on mobile */}
      <AnimatedSection delay={isMobile ? 0.3 : 0.4}>
        <FAQSection />
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection delay={isMobile ? 0.4 : 0.5}>
        <CTASection />
      </AnimatedSection>
      </main>

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