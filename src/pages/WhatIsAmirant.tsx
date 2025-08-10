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
      
      {/* Combined Benefits & Features - למה להתכונן אצלנו */}
      <WhyPrepareWithUsSection />
      
      {/* Educational Content Sections */}
      <WhatIsAmirantSection />
      <ExamComparisonSection />
      
      {/* NEW: Practical Registration Info */}
      <PracticalInfoSection />
      
      {/* NEW: Exemption Scores Table */}
      <ExemptionScoresTable />
      
      {/* Interactive Demo */}
      <InteractiveDemoSection onStartNow={handleStartNow} />
      
      {/* NEW: Success Tips */}
      <SuccessTipsSection />
      
      {/* College Differences */}
      <CollegeDifferencesSection />
      
      {/* NEW: FAQ Section */}
      <FAQSection />
      
      {/* Why Us Section */}
      <WhyUsSection />
      
      {/* Final CTA Section */}
      <FinalCTASection onStartNow={handleStartNow} />
      
      <Footer />
    </div>
  );
};

// Hero Section Component (unchanged)
const HeroSection: React.FC<{ onStartNow: () => void }> = ({ onStartNow }) => {
  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 text-white py-20 overflow-hidden">
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

// Stats Section (unchanged)
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

// NEW: Combined Benefits & Features Section
const WhyPrepareWithUsSection: React.FC = () => {
  const benefits = [
    {
      icon: '⏰',
      title: 'חיסכון בזמן יקר',
      description: 'פטור מקורסי אנגלית = יותר זמן להתמקד בלימודים המקצועיים'
    },
    {
      icon: '💸',
      title: 'חיסכון של אלפי שקלים',
      description: 'קורסי אנגלית אקדמיים עולים המון - תחסכו את הכסף לדברים חשובים יותר'
    },
    {
      icon: '🎓',
      title: 'סיום התואר מהר יותר',
      description: 'בלי קורסי חובה מעכבים - תתקדמו ותסיימו בזמן'
    },
    {
      icon: '🎯',
      title: 'סימולציות מדויקות',
      description: 'מאות שאלות מבוססות על מבחנים אמיתיים - בלי הפתעות!'
    },
    {
      icon: '📊',
      title: 'מעקב התקדמות חכם',
      description: 'AI שמזהה חולשות ומתאים תרגילים אישית בשבילכם'
    },
    {
      icon: '💡',
      title: 'הסברים מקצועיים',
      description: 'לא רק התשובה הנכונה - תבינו למה ואיך להצליח'
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            למה כדאי להתכונן אצלנו?
          </h2>
          <p className="text-xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
            קבלו פטור מאנגלית וחסכו זמן, כסף ולחץ - עם המערכת המתקדמת ביותר בישראל
          </p>
        </AnimatedCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden border border-gray-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// NEW: Practical Info Section
const PracticalInfoSection: React.FC = () => {
  const infoCards = [
    {
      icon: '📅',
      title: 'מועדי הרשמה',
      items: [
        'הרשמה עד 2 ימי עבודה לפני המבחן',
        'בחינות כל השנה במרכזים ברחבי הארץ',
        'שינוי מועד אפשרי עד 48 שעות לפני'
      ]
    },
    {
      icon: '📋',
      title: 'מה להביא למבחן',
      items: [
        'תעודת זהות/דרכון בתוקף (מקורי בלבד!)',
        'אישור הרשמה מודפס מהאזור האישי',
        'אין צורך בכלי כתיבה או מחשבון'
      ]
    },
    {
      icon: '⏱️',
      title: 'משך ותוקף',
      items: [
        'משך המבחן: כ-60 דקות',
        'תוקף הציון: 7 שנים',
        'תוצאות תוך 10 ימי עבודה'
      ]
    },
    {
      icon: '🔄',
      title: 'בחינות חוזרות',
      items: [
        'אפשר להיבחן כמה פעמים שרוצים',
        'המתנה של 35 יום בין בחינות',
        'נחשב הציון הגבוה ביותר'
      ]
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative group">
            מידע חיוני להרשמה למבחן אמירנט
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 transition-all duration-300 group-hover:w-80" />
          </h2>
        </AnimatedCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {infoCards.map((card, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
                <div className="flex items-center mb-6">
                  <span className="text-4xl ml-4">{card.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
                </div>
                <ul className="space-y-3">
                  {card.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedCard delay={0.5}>
          <div className="mt-12 bg-yellow-50 p-6 rounded-2xl border border-yellow-200 text-center">
            <p className="text-lg text-gray-800">
              <strong className="text-yellow-700">💡 חשוב:</strong> עלות המבחן כ-250₪ (מתעדכן מעת לעת)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              המידע מבוסס על הנחיות מאל"ו | 
              <a href="https://www.nite.org.il" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-1">
                nite.org.il
              </a>
            </p>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

// NEW: Exemption Scores Table
const ExemptionScoresTable: React.FC = () => {
  const institutions = [
    { name: 'אוניברסיטת תל אביב', full: '134+', partial: '120-133', course: 'עד 119' },
    { name: 'האוניברסיטה העברית', full: '134+', partial: '120-133', course: 'עד 119' },
    { name: 'הטכניון', full: '134+', partial: '120-133', course: 'עד 119' },
    { name: 'אוניברסיטת בן גוריון', full: '134+', partial: '120-133', course: 'עד 119' },
    { name: 'אוניברסיטת חיפה', full: '134+', partial: '120-133', course: 'עד 119' },
    { name: 'אוניברסיטת בר אילן', full: '134+', partial: '120-133', course: 'עד 119' },
    { name: 'המכללה למנהל', full: '100+', partial: '85-99', course: 'עד 84' },
    { name: 'המרכז הבינתחומי', full: '100+', partial: '85-99', course: 'עד 84' },
    { name: 'מכללת רופין', full: '100+', partial: '85-99', course: 'עד 84' },
    { name: 'המכללה האקדמית ת"א-יפו', full: '100+', partial: '85-99', course: 'עד 84' }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative group">
            ציוני סף לפטור במוסדות שונים
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 transition-all duration-300 group-hover:w-80" />
          </h2>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <div className="overflow-x-auto rounded-2xl shadow-xl">
            <table className="w-full bg-white">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-right font-bold">מוסד לימודים</th>
                  <th className="px-6 py-4 text-center font-bold">פטור מלא</th>
                  <th className="px-6 py-4 text-center font-bold">פטור חלקי</th>
                  <th className="px-6 py-4 text-center font-bold">קורס חובה</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst, index) => (
                  <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{inst.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                        {inst.full}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                        {inst.partial}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                        {inst.course}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.4}>
          <p className="text-sm text-gray-600 mt-6 text-center bg-blue-50 p-4 rounded-xl border border-blue-200">
            <strong>שימו לב:</strong> הציונים מתעדכנים מעת לעת ועשויים להשתנות בין מחלקות שונות באותו מוסד. 
            מומלץ לבדוק את הדרישות המדויקות מול המוסד הרלוונטי.
          </p>
        </AnimatedCard>
      </div>
    </section>
  );
};

// NEW: Success Tips Section
const SuccessTipsSection: React.FC = () => {
  const tipCategories = [
    {
      title: 'לפני המבחן',
      icon: '📚',
      tips: [
        'הגיעו 30 דקות מוקדם להירגע ולהתארגן',
        'וודאו שישנתם טוב בלילה שלפני',
        'אל תלמדו חומר חדש ביום המבחן',
        'אכלו ארוחה קלה ושתו מים'
      ]
    },
    {
      title: 'במהלך המבחן',
      icon: '⏱️',
      tips: [
        'קראו כל שאלה לפחות פעמיים',
        'אל תבזבזו יותר מדי זמן על שאלה אחת',
        'השתמשו בתהליך אלימינציה',
        'סמנו שאלות קשות וחזרו אליהן בסוף'
      ]
    },
    {
      title: 'אסטרטגיות מנצחות',
      icon: '🎯',
      tips: [
        'התחילו מהשאלות הקלות לכם',
        'שימו לב למילות מפתח בשאלה',
        'בהבנת הנקרא - קראו קודם את השאלות',
        'אל תשנו תשובה אלא אם אתם בטוחים'
      ]
    }
  ];

  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative group">
            טיפים להצלחה במבחן
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mt-4 transition-all duration-300 group-hover:w-80" />
          </h2>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {tipCategories.map((category, index) => (
            <AnimatedCard key={index} delay={index * 0.2}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200">
                <div className="text-center mb-6">
                  <span className="text-5xl">{category.icon}</span>
                  <h3 className="text-2xl font-bold mt-4 text-gray-900">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ml-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedCard delay={0.6}>
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">💪 הטיפ החשוב ביותר</h3>
            <p className="text-lg">
              אל תלחצו! המבחן מותאם לרמה שלכם. 
              עם הכנה נכונה והסימולציות שלנו - אתם תצליחו!
            </p>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

// NEW: FAQ Section
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: 'כמה עולה מבחן אמירנט?',
      answer: 'עלות המבחן היא כ-250₪ (המחיר מתעדכן מעת לעת). התשלום מתבצע באתר מאל"ו בעת ההרשמה.'
    },
    {
      question: 'איפה מתקיים המבחן?',
      answer: 'המבחן מתקיים במרכזי בחינות ברחבי הארץ - תל אביב, ירושלים, חיפה, באר שבע, נתניה, אשדוד ועוד. בעת ההרשמה תוכלו לבחור את המיקום הנוח לכם.'
    },
    {
      question: 'מה קורה אם נכשלתי במבחן?',
      answer: 'אפשר להיבחן שוב! צריך להמתין 35 יום בין בחינות. אין הגבלה על מספר הפעמים שאפשר להיבחן, והציון הגבוה ביותר הוא שנחשב.'
    },
    {
      question: 'האם המבחן מותאם לדיסלקטים?',
      answer: 'כן! ניתן לקבל הארכת זמן של 25% עם אישור מתאים. יש להגיש בקשה דרך אתר מאל"ו לפחות שבועיים לפני המבחן.'
    },
    {
      question: 'איך מקבלים את תוצאות המבחן?',
      answer: 'התוצאות מתפרסמות באזור האישי באתר מאל"ו תוך 10 ימי עבודה. תקבלו הודעה במייל כשהציון יעודכן.'
    },
    {
      question: 'מה ההבדל בין אמירנט לאמירם?',
      answer: 'שני המבחנים כמעט זהים - שניהם ממוחשבים ומתאימים את רמת השאלות. ההבדל העיקרי הוא שאמירנט נערך בדרך כלל במכללות ואמירם באוניברסיטאות.'
    },
    {
      question: 'כמה זמן תקף הציון?',
      answer: 'ציון אמירנט תקף ל-7 שנים מיום הבחינה. רוב המוסדות מכבדים את הציון לאורך כל התקופה הזו.'
    },
    {
      question: 'האם אפשר לבטל או לשנות מועד בחינה?',
      answer: 'כן! ניתן לשנות מועד או מיקום עד 2 ימי עבודה לפני הבחינה ללא תשלום נוסף. ביטול עם החזר כספי אפשרי עד 14 יום לפני המבחן.'
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative group">
            שאלות נפוצות
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 transition-all duration-300 group-hover:w-80" />
          </h2>
        </AnimatedCard>

        <div className="space-y-4 mt-16">
          {faqs.map((faq, index) => (
            <AnimatedCard key={index} delay={index * 0.05}>
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 text-right flex justify-between items-center hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-lg text-gray-900">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-600 text-2xl"
                  >
                    ⌄
                  </motion.span>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-8 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// What is Amirant Section (unchanged)
const WhatIsAmirantSection: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative group">
            מה זה מבחן אמירנט?
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 transition-all duration-300 group-hover:w-80" />
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

// Exam Comparison Section - UPDATED
const ExamComparisonSection: React.FC = () => {
  const exams = [
    {
      name: 'מבחן אמיר',
      format: 'מבחן מודפס (נייר ועיפרון)',
      questions: 'כ-70 שאלות',
      duration: 'כ-75 דקות',
      questionTypes: 'השלמת משפטים, ניסוח מחדש, קריאה',
      location: 'מרכזי מאל"ו',
      frequency: 'מספר פעמים בשנה',
      special: 'מבחן סטטי (ללא התאמה)',
      exemptionScore: 'ציון 134+',
      tip: 'תכננו זמן – אין חזרה לשאלות',
      color: 'from-red-500 to-red-600',
      icon: '📝'
    },
    {
      name: 'מבחן אמירם',
      format: 'מבחן ממוחשב',
      questions: 'משתנה (50-80 שאלות, מותאם אישית)',
      duration: 'כ-50 דקות',
      questionTypes: 'השלמת משפטים, ניסוח מחדש, קריאה',
      location: 'מרכזי מאל"ו / מוסדות לימוד',
      frequency: 'לאורך כל השנה',
      special: 'מבחן אדפטיבי (קושי משתנה)',
      exemptionScore: 'ציון 134+',
      tip: 'כל טעות משפיעה – קראו היטב כל שאלה',
      color: 'from-green-500 to-green-600',
      icon: '💻'
    },
    {
      name: 'מבחן אמירנט',
      format: 'מבחן ממוחשב',
      questions: 'משתנה (50-80 שאלות, מותאם אישית)',
      duration: 'כ-50 דקות',
      questionTypes: 'השלמת משפטים, ניסוח מחדש, קריאה',
      experimentalSections: 'ייתכנו פרקים ניסיוניים (האזנה, דקדוק, יצירת מילה)',
      location: 'מוסדות לימוד / מרכזי מאל"ו',
      frequency: 'לאורך כל השנה',
      special: 'פרקים ניסיוניים בשמיעה, דקדוק, יצירת מילה',
      exemptionScore: 'ציון 134+',
      tip: 'בדקו מול המוסד מהם דרישות הפטור',
      color: 'from-purple-500 to-blue-600',
      highlight: true,
      icon: '🎯'
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

        {/* Desktop View - Cards */}
        <div className="hidden lg:grid grid-cols-3 gap-8 mt-16">
          {exams.map((exam, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden border-2 ${exam.highlight ? 'border-purple-200' : 'border-gray-200'}`}>
                {exam.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 to-blue-600" />
                )}
                
                {/* Header */}
                <div className={`bg-gradient-to-r ${exam.color} p-6 text-white text-center`}>
                  <div className="text-4xl mb-3">{exam.icon}</div>
                  <h3 className="text-2xl font-bold">{exam.name}</h3>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">פורמט:</div>
                    <div className="font-semibold text-gray-900">{exam.format}</div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">מספר שאלות:</div>
                    <div className="font-semibold text-gray-900">{exam.questions}</div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">משך המבחן:</div>
                    <div className="font-semibold text-gray-900">{exam.duration}</div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">סוגי שאלות:</div>
                    <div className="font-semibold text-gray-900">{exam.questionTypes}</div>
                    {exam.experimentalSections && (
                      <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        <strong>חדש!</strong> {exam.experimentalSections}
                      </div>
                    )}
                  </div>
                  
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">היכן נבחנים:</div>
                    <div className="font-semibold text-gray-900">{exam.location}</div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">תדירות:</div>
                    <div className="font-semibold text-gray-900">{exam.frequency}</div>
                  </div>
                  
                  {exam.special && (
                    <div className="pb-4 border-b border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">מיוחד:</div>
                      <div className="font-semibold text-purple-700">{exam.special}</div>
                    </div>
                  )}
                  
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">פטור באנגלית:</div>
                    <div className="font-semibold text-green-600">{exam.exemptionScore}</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-sm font-semibold text-blue-700 mb-1">💡 טיפ:</div>
                    <div className="text-sm text-blue-800">{exam.tip}</div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Mobile View - Accordion */}
        <div className="lg:hidden space-y-4 mt-8">
          {exams.map((exam, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${exam.highlight ? 'border-purple-200' : 'border-gray-200'}`}>
                {exam.highlight && (
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600" />
                )}
                
                <div className={`bg-gradient-to-r ${exam.color} p-4 text-white`}>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">{exam.icon}</span>
                    <h3 className="text-xl font-bold">{exam.name}</h3>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {[
                    { label: 'פורמט', value: exam.format },
                    { label: 'מספר שאלות', value: exam.questions },
                    { label: 'משך', value: exam.duration },
                    { label: 'סוגי שאלות', value: exam.questionTypes },
                    { label: 'היכן נבחנים', value: exam.location },
                    { label: 'תדירות', value: exam.frequency },
                    { label: 'פטור', value: exam.exemptionScore, color: 'text-green-600' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-sm text-gray-600">{item.label}:</span>
                      <span className={`font-semibold ${item.color || 'text-gray-900'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                  
                  {exam.experimentalSections && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <strong className="text-orange-700">חדש!</strong>
                      <p className="text-sm text-orange-800 mt-1">{exam.experimentalSections}</p>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <strong className="text-blue-700">💡 טיפ:</strong>
                    <p className="text-sm text-blue-800 mt-1">{exam.tip}</p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Summary Box */}
        <AnimatedCard delay={0.4}>
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-purple-200">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">סיכום מהיר</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-purple-700 mb-3">🎯 הדמיון בין המבחנים:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="text-gray-700">כולם בודקים את אותן המיומנויות באנגלית</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="text-gray-700">ציון 134+ מקנה פטור מלא בכל המבחנים</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="text-gray-700">סוגי השאלות הבסיסיים זהים</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-blue-700 mb-3">🔄 ההבדלים העיקריים:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="text-gray-700"><strong>אמיר:</strong> מודפס, ללא התאמה אישית</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="text-gray-700"><strong>אמירם/אמירנט:</strong> ממוחשבים ומותאמים אישית</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="text-gray-700"><strong>אמירנט:</strong> עשוי לכלול פרקים ניסיוניים חדשים</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center bg-white p-4 rounded-xl">
              <p className="text-lg font-semibold text-gray-900">
                🎓 המלצה: בדקו עם המוסד שלכם איזה מבחן הם דורשים ומהם ציוני הסף הספציפיים
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

// College Differences Section (unchanged)
const CollegeDifferencesSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 relative group">
            האם יש הבדלים בין מכללות?
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 transition-all duration-300 group-hover:w-80" />
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
        </div>
      </div>
    </section>
  );
};

// Interactive Demo Section (unchanged)
const InteractiveDemoSection: React.FC<{ onStartNow: () => void }> = ({ onStartNow }) => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedCard>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900 relative group">
            נסו בעצמכם - סימולציות לדוגמה
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 transition-all duration-300 group-hover:w-80" />
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

// Why Us Section (unchanged)
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

// Final CTA Section (unchanged)
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

        <AnimatedCard delay={0.6}>
          <div className="mt-16 p-6 bg-gray-900 text-white rounded-2xl">
            <p className="text-sm">
              המידע על הרשמה ונהלים מבוסס על הנחיות המרכז הארצי לבחינות והערכה (מאל"ו) | 
              <a href="https://www.nite.org.il" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mr-2">
                nite.org.il
              </a>
            </p>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

// Reusable Animated Card Component (unchanged)
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

// Question Card Component (unchanged)
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
    let classes = "rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-500 text-left flex items-center gap-3 sm:gap-4 text-base sm:text-lg hover:transform hover:-translate-y-1 hover:shadow-lg border-2";
    
    if (isLongOptions) {
      classes += " col-span-full";
    }
    
    if (isAnswered) {
      classes += " pointer-events-none";
      
      if (option.letter === selectedOption) {
        if (option.isCorrect) {
          classes += " bg-green-100 border-green-500 animate-pulse shadow-lg";
        } else {
          classes += " bg-red-100 border-red-500 animate-pulse shadow-lg";
        }
      } else if (option.isCorrect && selectedOption && !options.find(o => o.letter === selectedOption)?.isCorrect) {
        classes += " bg-green-100 border-green-500 shadow-md";
      } else {
        classes += " bg-gray-100 border-gray-300";
      }
    } else {
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
          <p className="text-lg sm:text-xl text-gray-900 leading-relaxed mb-4 text-left" dir="ltr">
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
              <span className="flex-1 text-left text-sm sm:text-base leading-relaxed" dir="ltr">{option.text}</span>
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