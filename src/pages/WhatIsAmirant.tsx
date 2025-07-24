import React, { useEffect, useState } from 'react';
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
      
      {/* Educational Content Sections */}
      <WhatIsAmirantSection />
      <ExamComparisonSection />
      <InteractiveDemoSection onStartNow={handleStartNow} />
      <CollegeDifferencesSection />
      
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
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-white text-shadow-lg leading-tight"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          אמירנט - השער שלכם להצלחה אקדמית!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-white px-4"
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
          className="inline-block bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group border-2 border-white/20"
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
    <section className="bg-white py-12 sm:py-16 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-800 text-base sm:text-lg font-medium">
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

// What is Amirant Section
const WhatIsAmirantSection: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative">
            מה זה מבחן אמירנט?
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4" />
          </h2>
        </AnimatedCard>
        
        <div className="space-y-8">
          <AnimatedCard delay={0.2}>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
              <p className="text-lg text-gray-800 leading-relaxed mb-6">
                מבחן אמירנט הוא מבחן ממוחשב שנועד להעריך את רמת האנגלית של סטודנטים ולהחליט אם יידרשו לקחת קורסי חובה באנגלית במסגרת הלימודים באקדמיה.
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                תוצאות המבחן קובעות האם תקבלו <strong className="text-purple-700">פטור מלא</strong>, <strong className="text-blue-700">פטור חלקי</strong> או תצטרכו ללמוד קורסי חובה באנגלית.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};

// Exam Comparison Section
const ExamComparisonSection: React.FC = () => {
  const exams = [
    {
      name: 'מבחן אמיר',
      format: 'מבחן מודפס (נייר ועיפרון)',
      questions: 'כ-70 שאלות',
      duration: 'כ-75 דקות',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'מבחן אמירם',
      format: 'מבחן ממוחשב',
      questions: 'משתנה (מותאם אישית)',
      duration: 'כ-60 דקות',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'מבחן אמירנט',
      format: 'מבחן ממוחשב',
      questions: 'משתנה (מותאם אישית)',
      duration: 'כ-60 דקות',
      color: 'from-purple-500 to-blue-600',
      highlight: true
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative">
            ההבדלים בין אמיר, אמירם ואמירנט
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4" />
          </h2>
        </AnimatedCard>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {exams.map((exam, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden border-2 ${exam.highlight ? 'border-purple-200' : 'border-gray-200'}`}>
                {exam.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 to-blue-600" />
                )}
                
                <div className={`w-16 h-16 bg-gradient-to-r ${exam.color} rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  <span className="text-white font-bold text-xl">
                    {exam.name.includes('אמיר') ? 'א' : exam.name.includes('אמירם') ? 'ם' : 'נט'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-6 text-gray-900 text-center">{exam.name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800 block mb-1">פורמט:</strong>
                      <span className="text-gray-700">{exam.format}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800 block mb-1">מספר שאלות:</strong>
                      <span className="text-gray-700">{exam.questions}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800 block mb-1">משך המבחן:</strong>
                      <span className="text-gray-700">{exam.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
        
        <AnimatedCard delay={0.4}>
          <div className="mt-12 bg-blue-50 p-8 rounded-2xl border border-blue-200">
            <p className="text-lg text-gray-800 leading-relaxed text-center">
              <strong className="text-blue-700">חשוב לדעת:</strong> אמירם ואמירנט דומים מאוד - שניהם ממוחשבים ומתאימים את רמת השאלות בהתאם לתשובות שלכם. 
              ההבדל העיקרי הוא שאמירנט נערך במכללות ספציפיות ואמירם בדרך כלל באוניברסיטאות.
            </p>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

// College Differences Section
const CollegeDifferencesSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative">
            האם יש הבדלים בין מכללות?
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4" />
          </h2>
        </AnimatedCard>
        
        <div className="space-y-8">
          <AnimatedCard delay={0.2}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">🏫</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-6 text-gray-900">מבנה אחיד, דרישות משתנות</h3>
                
                <p className="text-lg text-gray-800 leading-relaxed mb-6">
                  <strong className="text-purple-700">המבנה של מבחן אמירנט אחיד בכל המכללות</strong> - אותם סוגי שאלות, אותו פורמט ממוחשב ואותה שיטת הערכה.
                </p>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    <strong className="text-orange-700">אבל שימו לב:</strong> דרישות הקבלה לקורסים וציוני הפטור יכולים להשתנות מעט בין מוסדות אקדמיים שונים. 
                    כדאי לבדוק את הדרישות הספציפיות של המכללה שלכם.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={0.4}>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-8 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">למה כדאי לכם להתכונן אצלנו?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-lg">סימולציות מדויקות של המבחן האמיתי</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-lg">מעקב אישי אחרי התקדמותכם</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-lg">הסברים מפורטים על כל שאלה</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-lg">גישה מכל מקום ובכל זמן</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};

// Interactive Demo Section
const InteractiveDemoSection: React.FC<{ onStartNow: () => void }> = ({ onStartNow }) => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900 relative">
            נסו בעצמכם - סימולציות לדוגמה
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4" />
          </h2>
        </AnimatedCard>
        
        <AnimatedCard delay={0.2}>
          <p className="text-base sm:text-lg text-gray-700 text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            בחרו את התשובה הנכונה וקבלו הסבר מקצועי מפורט
          </p>
        </AnimatedCard>
        
        <div className="space-y-8 sm:space-y-12">
          <QuestionCard
            questionId={1}
            questionType="השלמת משפטים"
            difficulty="רמה בינונית+"
            questionText="The committee has been deliberating ___ the proposal for several weeks, but they haven't reached a consensus yet."
            options={[
              { letter: 'A', text: 'about', isCorrect: false },
              { letter: 'B', text: 'on', isCorrect: true },
              { letter: 'C', text: 'for', isCorrect: false },
              { letter: 'D', text: 'with', isCorrect: false }
            ]}
            explanation={{
              correctAnswer: 'B - on',
              mainExplanation: 'הפועל "deliberate" (לדון, לשקול) מצריך את מילת היחס "on" כאשר מדובר בדיון על נושא ספציפי:',
              details: [
                'deliberate on = לדון בנושא מסוים',
                'deliberate about = אפשרי אך פחות פורמלי',
                'deliberate for = שגוי - "for" מציין משך זמן (for weeks)',
                'deliberate with = לדון עם מישהו, לא על משהו'
              ],
              tip: 'בהקשרים פורמליים ומשפטיים, השילוב "deliberate on" הוא המועדף. זכרו: "The jury deliberated ON the verdict" (חבר המושבעים דן בפסק הדין).'
            }}
          />

          <QuestionCard
            questionId={2}
            questionType="ניסוח מחדש"
            difficulty="רמה בינונית+"
            questionText="Despite his extensive preparation, John found the interview considerably more challenging than he had anticipated."
            questionSubtext="בחרו את המשפט הזהה במשמעות:"
            options={[
              { letter: 'A', text: "John's preparation was insufficient for the difficult interview he faced.", isCorrect: false },
              { letter: 'B', text: 'Although John had prepared thoroughly, the interview proved to be much harder than expected.', isCorrect: true },
              { letter: 'C', text: 'John anticipated a challenging interview, which is why he prepared extensively.', isCorrect: false },
              { letter: 'D', text: "The interview was challenging because John hadn't prepared enough.", isCorrect: false }
            ]}
            isLongOptions={true}
            explanation={{
              correctAnswer: 'B',
              mainExplanation: 'ניתוח המרכיבים העיקריים:',
              analysisTable: [
                { component: 'ניגוד', original: 'Despite (למרות)', answer: 'Although (למרות ש)' },
                { component: 'הכנה', original: 'extensive preparation', answer: 'prepared thoroughly' },
                { component: 'תוצאה', original: 'found...more challenging', answer: 'proved to be much harder' },
                { component: 'ציפיות', original: 'than he had anticipated', answer: 'than expected' }
              ],
              errorAnalysis: [
                'A + D: משנות את המשמעות - טוענות שההכנה לא הייתה מספקת',
                'C: הופכת את הסדר הכרונולוגי - הציפייה באה לפני ההכנה'
              ]
            }}
          />

          <QuestionCard
            questionId={3}
            questionType="הבנת הנקרא"
            difficulty="רמה בינונית+"
            readingPassage={`The phenomenon of "phantom vibration syndrome" has become increasingly prevalent in the digital age. This condition, where individuals perceive their mobile phone vibrating when it actually isn't, affects up to 80% of college students according to recent studies. Researchers attribute this to our brain's heightened sensitivity to stimuli that we've trained it to consider important. The constant anticipation of messages and notifications has essentially rewired our nervous system to detect vibrations that don't exist. Interestingly, the syndrome is more common among people who keep their phones in their pockets and those who report higher levels of phone dependency.`}
            questionText="According to the passage, what can be inferred about phantom vibration syndrome?"
            options={[
              { letter: 'A', text: 'It only affects students and young people', isCorrect: false },
              { letter: 'B', text: 'It is caused by a technical problem in smartphones', isCorrect: false },
              { letter: 'C', text: 'Our brain trains itself to detect stimuli we consider important', isCorrect: true },
              { letter: 'D', text: 'It can be cured by keeping the phone outside the pocket', isCorrect: false }
            ]}
            isLongOptions={true}
            explanation={{
              correctAnswer: 'C',
              mainExplanation: `מידע מפורש בטקסט: "our brain's heightened sensitivity to stimuli that we've trained it to consider important" - המוח שלנו פיתח רגישות מוגברת לגירויים שאימנו אותו לחשוב שהם חשובים`,
              errorAnalysis: [
                'A: הטקסט מזכיר 80% מהסטודנטים כדוגמה, אך לא טוען שזה משפיע רק עליהם',
                'B: הקטע מסביר שזו תופעה נוירולוגית, לא בעיה טכנית',
                'D: הטקסט מציין ששמירה בכיס מגבירה את הסיכון, אך לא מציע זאת כטיפול'
              ],
              tip: 'בשאלות הסקה, חפשו את המידע המפורש בטקסט ובחרו את התשובה הנתמכת ישירות על ידי הכתוב, ללא פרשנות יתר.'
            }}
          />
        </div>
        
        <AnimatedCard delay={0.6}>
          <div className="mt-12 sm:mt-16 text-center bg-gradient-to-r from-green-500 to-teal-600 p-6 sm:p-8 rounded-2xl text-white">
            <p className="text-lg sm:text-xl mb-6">התרשמתם? זו רק טעימה קטנה ממה שמחכה לכם במערכת המלאה!</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartNow}
              className="inline-block bg-white text-green-600 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">קבלו גישה לכל הסימולציות</span>
            </motion.button>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

// Question Card Component
interface Option {
  letter: string;
  text: string;
  isCorrect: boolean;
}

interface Explanation {
  correctAnswer: string;
  mainExplanation: string;
  details?: string[];
  tip?: string;
  analysisTable?: { component: string; original: string; answer: string; }[];
  errorAnalysis?: string[];
}

interface QuestionCardProps {
  questionId: number;
  questionType: string;
  difficulty: string;
  questionText: string;
  questionSubtext?: string;
  readingPassage?: string;
  options: Option[];
  isLongOptions?: boolean;
  explanation: Explanation;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionId,
  questionType,
  difficulty,
  questionText,
  questionSubtext,
  readingPassage,
  options,
  isLongOptions = false,
  explanation
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (option: Option) => {
    if (isAnswered) return;
    
    setSelectedOption(option.letter);
    setIsAnswered(true);
    
    // Show explanation after animation
    setTimeout(() => {
      setShowExplanation(true);
    }, 800);
  };

  const getOptionClasses = (option: Option) => {
    let classes = "rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-500 text-right flex items-center gap-3 sm:gap-4 text-base sm:text-lg hover:transform hover:-translate-y-1 hover:shadow-lg border-2";
    
    if (isLongOptions) {
      classes += " col-span-full";
    }
    
    if (isAnswered) {
      classes += " pointer-events-none";
      
      if (option.letter === selectedOption) {
        if (option.isCorrect) {
          // תשובה נכונה - ירוק עם הבהוב
          classes += " bg-green-100 border-green-500 animate-pulse shadow-lg";
        } else {
          // תשובה שגויה - אדום עם הבהוב
          classes += " bg-red-100 border-red-500 animate-pulse shadow-lg";
        }
      } else if (option.isCorrect && selectedOption && !options.find(o => o.letter === selectedOption)?.isCorrect) {
        // התשובה הנכונה כשבחרו תשובה שגויה
        classes += " bg-green-100 border-green-500 shadow-md";
      } else {
        // שאר התשובות - אפור
        classes += " bg-gray-100 border-gray-300";
      }
    } else {
      // לפני בחירה
      classes += " bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
    
    return classes;
  };

  return (
    <AnimatedCard delay={questionId * 0.1}>
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
        {/* Question Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
          <span className="text-lg sm:text-xl font-bold text-purple-600">{questionType}</span>
          <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
            {difficulty}
          </span>
        </div>

        {/* Reading Passage */}
        {readingPassage && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 border-r-4 border-purple-500">
            <h4 className="font-bold text-purple-600 mb-4 text-sm sm:text-base">קטע קריאה:</h4>
            <p className="text-gray-800 leading-relaxed text-left text-sm sm:text-base" dir="ltr">
              {readingPassage}
            </p>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-6 sm:mb-8">
          <p className="text-lg sm:text-xl text-gray-900 leading-relaxed mb-4">
            {questionText}
          </p>
          {questionSubtext && (
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              {questionSubtext}
            </p>
          )}
        </div>

        {/* Options Grid */}
        <div className={`grid gap-3 sm:gap-4 mb-6 ${isLongOptions ? 'grid-cols-1' : 'grid-cols-1'}`}>
          {options.map((option) => (
            <button
              key={option.letter}
              onClick={() => handleOptionClick(option)}
              className={getOptionClasses(option)}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
                {option.letter}
              </div>
              <span className="flex-1 text-right text-sm sm:text-base leading-relaxed">{option.text}</span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 1000 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl border-r-4 border-purple-500"
          >
            <h4 className="text-lg sm:text-xl font-bold text-purple-600 mb-4 flex items-center">
              💡 הסבר מפורט:
            </h4>
            
            <p className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              התשובה הנכונה: {explanation.correctAnswer}
            </p>
            
            <p className="text-gray-800 leading-relaxed mb-4 text-sm sm:text-base">
              {explanation.mainExplanation}
            </p>

            {explanation.details && (
              <ul className="space-y-2 mb-4">
                {explanation.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="text-gray-700 font-mono text-xs sm:text-sm bg-white px-2 sm:px-3 py-1 rounded">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {explanation.analysisTable && (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4 overflow-x-auto">
                <table className="w-full min-w-full text-sm sm:text-base">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="p-2 sm:p-3 text-right font-bold">מרכיב</th>
                      <th className="p-2 sm:p-3 text-right font-bold">משפט מקורי</th>
                      <th className="p-2 sm:p-3 text-right font-bold">תשובה B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explanation.analysisTable.map((row, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2 sm:p-3 font-medium text-gray-800">{row.component}</td>
                        <td className="p-2 sm:p-3 text-gray-700">{row.original}</td>
                        <td className="p-2 sm:p-3 text-gray-700">{row.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {explanation.errorAnalysis && (
              <div className="bg-red-50 p-3 sm:p-4 rounded-lg mb-4 border border-red-200">
                <p className="font-bold text-red-700 mb-3 text-sm sm:text-base">❌ למה התשובות האחרות שגויות:</p>
                <ul className="space-y-2">
                  {explanation.errorAnalysis.map((error, index) => (
                    <li key={index} className="text-red-800 text-xs sm:text-sm">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {explanation.tip && (
              <div className="bg-white p-3 sm:p-4 rounded-lg border-r-3 border-pink-500">
                <p className="text-gray-800 text-sm sm:text-base">
                  <span className="font-bold text-pink-600">💎 טיפ חשוב: </span>
                  {explanation.tip}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default WhatIsAmirant;