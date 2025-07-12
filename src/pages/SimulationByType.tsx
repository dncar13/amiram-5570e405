import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  RotateCcw, 
  ArrowRight,
  Target,
  Zap,
  Brain,
  Cpu,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getSentenceCompletionQuestions, getRestatementQuestions } from '@/services/questionsService';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuestionTypeData {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  tips: string[];
  questionCount: number;
}

const SimulationByType: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Redirect reading comprehension directly to stories page
  useEffect(() => {
    if (type === 'reading-comprehension') {
      navigate('/reading-comprehension');
    }
  }, [type, navigate]);

  // Get actual question counts dynamically
  const getSentenceCompletionCount = () => {
    return getSentenceCompletionQuestions().length;
  };

  const getRestatementCount = () => {
    return getRestatementQuestions().length;
  };

  const questionTypesData: Record<string, QuestionTypeData> = {
    'sentence-completion': {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'שאלות השלמת משפטים ומילים חסרות',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-blue-600',
      gradient: 'from-blue-500 via-purple-500 to-cyan-500',
      tips: [
        'קרא את המשפט כולו לפני בחירת התשובה',
        'שים לב להקשר ולמשמעות הכללית',
        'בחן את כל האפשרויות לפני קבלת החלטה',
        'שים לב לדקדוק ולצורת הפועל'
      ],
      questionCount: getSentenceCompletionCount()
    },
    'restatement': {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות',
      icon: <RotateCcw className="w-8 h-8" />,
      color: 'text-green-600',
      gradient: 'from-green-500 via-teal-500 to-emerald-500',
      tips: [
        'זהה את הרעיון המרכזי במשפט המקורי',
        'חפש ביטויים נרדפים',
        'שמור על אותה משמעות עם ניסוח שונה',
        'הימנע מביטויים חריגים או מיוחדים'
      ],
      questionCount: getRestatementCount()
    }
  };

  const currentType = type ? questionTypesData[type] : null;

  // If this is reading comprehension, the redirect should handle it
  if (type === 'reading-comprehension') {
    return null;
  }

  if (!currentType) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700/50 p-6 sm:p-8 md:p-10"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">סוג שאלה לא נמצא</h1>
              <p className="text-gray-300 mb-6 md:mb-8 text-base sm:text-lg">הסוג שאלה שחיפשת איננו קיים במערכת</p>
              <button
                onClick={() => navigate('/simulations-entry')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm sm:text-base min-h-[44px] flex items-center justify-center gap-2"
                aria-label="חזור לדף הכניסה"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/simulations-entry');
                  }
                }}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                חזור לדף הכניסה
              </button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleStartPractice = (difficulty?: string) => {
    if (difficulty) {
      // Navigate directly to difficulty-specific sets page
      navigate(`/simulation/type/${currentType.type}/${difficulty}/sets`);
    } else {
      // Quick practice with mixed questions - training mode
      navigate(`/simulation/${currentType.type}?type=${currentType.type}&limit=10&practice=1`);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-900/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-900/30 rounded-full blur-3xl" />
        </div>
        
        <div ref={containerRef} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 sm:mb-8"
        >
          <motion.button
            onClick={() => navigate('/simulations-entry')}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4 sm:mb-6 font-medium transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-lg p-2 -m-2 min-h-[44px] group"
            aria-label="חזור לדף הכניסה"
            tabIndex={0}
            whileHover={{ x: isMobile ? 0 : -5 }}
            whileTap={{ scale: 0.95 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/simulations-entry');
              }
            }}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" />
            <span className="text-sm sm:text-base">חזור לדף הכניסה</span>
          </motion.button>
          
          <motion.div 
            className={`bg-gradient-to-r ${currentType.gradient} text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/20 backdrop-blur-sm shadow-2xl overflow-hidden relative group`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
              <div className="absolute inset-0 bg-white/10 blur-xl" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <motion.div 
                  className="bg-white bg-opacity-20 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm flex-shrink-0"
                  whileHover={isMobile ? {} : { rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  {React.cloneElement(currentType.icon as React.ReactElement, {
                    className: `w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white`,
                  })}
                </motion.div>
                <div className="sm:mr-4 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight"
                      style={{ 
                        fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: '800',
                        letterSpacing: '-0.02em'
                      }}>
                    {currentType.title}
                  </h1>
                  <p className="text-white text-opacity-90 text-base sm:text-lg lg:text-xl leading-relaxed"
                     style={{ 
                       fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                       fontWeight: '400'
                     }}>
                    {currentType.description}
                  </p>
                  <motion.p 
                    className="text-white text-opacity-80 text-xs sm:text-sm mt-2 sm:mt-3 bg-white/10 rounded-lg px-2 sm:px-3 py-1 inline-block"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    🎯 מצב תרגול - הסברים מיידיים אחרי כל שאלה
                  </motion.p>
                </div>
              </div>
              <motion.div 
                className="flex items-center text-white text-opacity-90 bg-white bg-opacity-10 rounded-xl p-3 sm:p-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 flex-shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg font-medium">{currentType.questionCount} שאלות זמינות במערכת</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Practice Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {/* Quick Practice */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <motion.div 
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex-shrink-0"
                whileHover={isMobile ? {} : { rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white sm:mr-3 lg:mr-4"
                  style={{ 
                    fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: '700'
                  }}>תרגול מהיר</h2>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
              התחל תרגול מיידי עם 10 שאלות מעורבות בנושא זה
            </p>
            
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <motion.button
                onClick={() => handleStartPractice()}
                className={`w-full bg-gradient-to-r ${currentType.gradient} text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:shadow-2xl transition-all duration-300 ${isMobile ? '' : 'transform hover:scale-[1.02]'} border border-white/20 touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] group`}
                aria-label={`התחל תרגול מהיר - 10 שאלות ${currentType.title}`}
                tabIndex={0}
                whileHover={isMobile ? {} : { scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStartPractice();
                  }
                }}
              >
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <span>התחל תרגול (10 שאלות)</span>
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:animate-pulse" />
                </div>
              </motion.button>
              
              <div className="text-center">
                <p className="text-gray-400 mb-3 sm:mb-4 font-semibold text-xs sm:text-sm lg:text-base">או בחר רמת קושי ספציפית:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <motion.button
                    onClick={() => handleStartPractice('easy')}
                    className="py-2 sm:py-3 lg:py-4 px-3 sm:px-4 bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-400 rounded-lg sm:rounded-xl font-bold hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 border border-green-500/30 backdrop-blur-sm text-xs sm:text-sm lg:text-base touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] group"
                    aria-label="התחל תרגול קל"
                    tabIndex={0}
                    whileHover={isMobile ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStartPractice('easy');
                      }
                    }}
                  >
                    קל
                  </motion.button>
                  <motion.button
                    onClick={() => handleStartPractice('medium')}
                    className="py-2 sm:py-3 lg:py-4 px-3 sm:px-4 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 text-yellow-400 rounded-lg sm:rounded-xl font-bold hover:from-yellow-500/30 hover:to-orange-600/30 transition-all duration-300 border border-yellow-500/30 backdrop-blur-sm text-xs sm:text-sm lg:text-base touch-manipulation focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] group"
                    aria-label="התחל תרגול בינוני"
                    tabIndex={0}
                    whileHover={isMobile ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStartPractice('medium');
                      }
                    }}
                  >
                    בינוני
                  </motion.button>
                  <motion.button
                    onClick={() => handleStartPractice('hard')}
                    className="py-2 sm:py-3 lg:py-4 px-3 sm:px-4 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 rounded-lg sm:rounded-xl font-bold hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 border border-red-500/30 backdrop-blur-sm text-xs sm:text-sm lg:text-base touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] group"
                    aria-label="התחל תרגול קשה"
                    tabIndex={0}
                    whileHover={isMobile ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStartPractice('hard');
                      }
                    }}
                  >
                    קשה
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tips and Strategy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <motion.div 
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex-shrink-0"
                whileHover={isMobile ? {} : { rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.3 }}
              >
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white sm:mr-3 lg:mr-4"
                  style={{ 
                    fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: '700'
                  }}>טיפים לפתרון</h2>
            </div>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-4" role="list">
              {currentType.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-start group"
                  role="listitem"
                >
                  <motion.div 
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-1 sm:mt-2 ml-2 sm:ml-3 lg:ml-4 flex-shrink-0"
                    whileHover={isMobile ? {} : { scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  ></motion.div>
                  <span className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed group-hover:text-white transition-colors duration-300">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Advanced Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden relative"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-cyan-600/30 rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8 space-y-3 sm:space-y-0">
              <motion.div 
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 ml-2 sm:ml-3 lg:ml-4 flex-shrink-0"
                whileHover={isMobile ? {} : { rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.3 }}
              >
                <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white"
                  style={{ 
                    fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: '700'
                  }}>מערכת תרגול מתקדמת</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <motion.div 
                className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 group"
                whileHover={isMobile ? {} : { y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start space-x-3 mb-2 sm:mb-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">מעקב התקדמות</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base group-hover:text-gray-200 transition-colors duration-300">
                  המערכת שלנו עוקבת אחר ההתקדמות שלך ומספקת משוב מיידי לשיפור הביצועים
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-green-500/10 to-teal-600/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 group"
                whileHover={isMobile ? {} : { y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start space-x-3 mb-2 sm:mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <h3 className="text-lg sm:text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">הסברים מפורטים</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base group-hover:text-gray-200 transition-colors duration-300">
                  כל שאלה מגיעה עם הסבר מפורט שיעזור לך להבין את התשובה הנכונה
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 sm:mt-12 text-center"
        >
          <motion.div
            className="inline-flex items-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-cyan-400 text-sm sm:text-base font-medium"
            whileHover={isMobile ? {} : { scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 animate-pulse" />
            <span>מוכן להתחיל? בחר אחת מהאפשרויות למעלה</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default SimulationByType;