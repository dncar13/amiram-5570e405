import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WhatIsAmirant: React.FC = () => {
  const navigate = useNavigate();

  const handleStartNow = () => {
    navigate('/simulations-entry');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <HeroSection onStartNow={handleStartNow} />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Why Us Section */}
      <WhyUsSection />
      
      {/* Final CTA Section */}
      <FinalCTASection onStartNow={handleStartNow} />
      
      <Footer />
    </div>
  );
};

// Hero Section Component
const HeroSection: React.FC<{ onStartNow: () => void }> = ({ onStartNow }) => {
  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 text-white py-20 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-repeat opacity-20 animate-grid-move"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow-lg"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          אמירנט - השער שלכם להצלחה אקדמית!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-10 text-white"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
        >
          עברו את מבחן האמירנט בקלות וקבלו פטור מאנגלית
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartNow}
          className="inline-block bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold px-12 py-4 rounded-full text-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group border-2 border-white/20"
        >
          <span className="relative z-10 drop-shadow-lg">התחילו להתכונן עכשיו!</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection: React.FC = () => {
  const stats = [
    { number: '92%', label: 'אחוזי הצלחה' },
    { number: '3,500₪', label: 'חיסכון ממוצע בקורסים' },
    { number: '1,200+', label: 'סטודנטים מרוצים' },
    { number: '24/7', label: 'זמינות מלאה' }
  ];

  return (
    <section className="bg-white py-16 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-800 text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefits Section Component
const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: '⏰',
      title: 'חיסכון בזמן יקר',
      description: 'פטור מקורסי אנגלית אומר יותר זמן להתמקד בלימודים שבאמת חשובים לכם. תוכלו להשקיע את הזמן הזה בקורסים מקצועיים או בפעילויות אחרות.'
    },
    {
      icon: '💸',
      title: 'חיסכון כספי משמעותי',
      description: 'קורסי אנגלית אקדמיים עולים אלפי שקלים. הצלחה במבחן אמירנט חוסכת לכם את העלות הזו ומאפשרת להשקיע את הכסף במקומות אחרים.'
    },
    {
      icon: '🎓',
      title: 'התקדמות מהירה בתואר',
      description: 'ללא קורסי חובה באנגלית, תוכלו להתקדם מהר יותר בתואר שלכם ולסיים את הלימודים בזמן או אפילו מוקדם יותר.'
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative">
            למה מבחן אמירנט כל כך חשוב?
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4" />
          </h2>
        </AnimatedCard>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {benefits.map((benefit, index) => (
            <AnimatedCard key={index} delay={index * 0.2}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden border border-gray-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                
                <div className="text-5xl mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'סימולציות מדויקות למבחן האמיתי',
      description: 'המערכת שלנו מכילה מאות שאלות שנבנו בקפידה על בסיס מבחנים אמיתיים. תתאמנו בדיוק על מה שתפגשו במבחן, בלי הפתעות!'
    },
    {
      title: 'מערכת מעקב התקדמות חכמה',
      description: 'אלגוריתם מתקדם מנתח את הביצועים שלכם, מזהה נקודות חולשה ומתאים לכם תרגילים ממוקדים לשיפור מהיר ויעיל.'
    },
    {
      title: 'הסברים מפורטים לכל שאלה',
      description: 'לא רק תדעו מה התשובה הנכונה, אלא גם תבינו למה. כל שאלה מלווה בהסבר מקיף שיעזור לכם להבין את החומר לעומק.'
    },
    {
      title: 'גישה מכל מכשיר, בכל זמן',
      description: 'למדו מהמחשב, הטאבלט או הסמארטפון. המערכת שלנו זמינה 24/7, כך שתוכלו להתאמן מתי שנוח לכם.'
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative">
            איך אנחנו מבטיחים את ההצלחה שלכם?
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4" />
          </h2>
        </AnimatedCard>
        
        <div className="space-y-6 mt-16">
          {features.map((feature, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className="flex items-center bg-gray-50 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:-translate-x-2 border border-gray-200">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
                <div className="w-6 h-6 bg-green-500 rounded-full mr-6 flex-shrink-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Us Section Component
const WhyUsSection: React.FC = () => {
  const reasons = [
    {
      icon: '🏆',
      title: 'שיעורי הצלחה מוכחים',
      description: '92% מהתלמידים שלנו עוברים את המבחן בהצלחה'
    },
    {
      icon: '📚',
      title: 'תוכן עדכני ומקיף',
      description: 'מאגר ענק של שאלות המתעדכן באופן קבוע'
    },
    {
      icon: '💡',
      title: 'טכנולוגיה מתקדמת',
      description: 'מערכת AI שמתאימה את הלמידה אישית לכל תלמיד'
    },
    {
      icon: '🤝',
      title: 'תמיכה מלאה',
      description: 'צוות מומחים זמין לכל שאלה או בעיה'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 text-white py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            למה דווקא אנחנו?
          </h2>
        </AnimatedCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {reasons.map((reason, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className="text-center p-6 rounded-2xl bg-white/15 backdrop-blur-lg hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20">
                <div className="text-4xl mb-4">{reason.icon}</div>
                <p className="text-lg leading-relaxed text-white">
                  <strong className="block mb-2 text-white drop-shadow-lg">{reason.title}</strong>
                  <span className="text-sm text-white/90 drop-shadow-md">{reason.description}</span>
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section Component
const FinalCTASection: React.FC<{ onStartNow: () => void }> = ({ onStartNow }) => {
  return (
    <section className="bg-gray-50 py-24 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            הזמן שלכם יקר - <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">אל תבזבזו אותו!</span>
          </h2>
        </AnimatedCard>
        
        <AnimatedCard delay={0.2}>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            הצטרפו לאלפי הסטודנטים שכבר קיבלו פטור מאנגלית והתקדמו בלימודים
          </p>
        </AnimatedCard>
        
        <AnimatedCard delay={0.4}>
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartNow}
            className="inline-block bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold px-12 py-4 rounded-full text-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group border-2 border-white/20"
          >
            <span className="relative z-10 drop-shadow-lg">התחילו עכשיו!</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </AnimatedCard>
      </div>
    </section>
  );
};

// Reusable Animated Card Component
const AnimatedCard: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
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
        hidden: { opacity: 0, y: 30 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default WhatIsAmirant;