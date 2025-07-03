
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { 
  BookOpen, 
  List, 
  RotateCcw, 
  BookOpenCheck, 
  Clock, 
  TrendingUp,
  Star,
  History,
  User,
  Lock,
  ChevronRight,
  PlayCircle,
  Target,
  Award,
  Sparkles,
  ArrowUpRight,
  Zap,
  Shield,
  BarChart3,
  Gift
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface SimulationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  path: string;
  requiresAuth?: boolean;
  isPremium?: boolean;
  stats?: string;
  mode?: string;
}

interface QuestionTypeOption {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const SimulationsEntry: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isPremium, isLoading } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(useTransform(mouseX, [0, 300], [-50, 50]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, 300], [-50, 50]), springConfig);

  // Debug effect to track auth state in SimulationsEntry
  React.useEffect(() => {
    console.log("🎯 SimulationsEntry: Auth state update:");
    console.log("  - currentUser:", currentUser?.email || "null");
    console.log("  - isPremium:", isPremium);
    console.log("  - isLoading:", isLoading);
  }, [currentUser, isPremium, isLoading]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const simulationOptions: SimulationOption[] = [
    {
      id: 'full-simulation',
      title: 'סימולציה מלאה',
      description: '80 שאלות מעורבות מכל הקטגוריות - כמו במבחן האמיתי',
      icon: <PlayCircle className="w-8 h-8" />,
      gradient: 'from-blue-600 via-blue-500 to-indigo-600',
      path: '/simulation/full',
      stats: '60 דקות',
      mode: '🎯 מצב מבחן'
    },
    {
      id: 'free-practice',
      title: 'סימולציה חינמית',
      description: 'תרגול חינמי עם שאלות מכל הסוגים - ללא הגבלות',
      icon: <Gift className="w-8 h-8" />,
      gradient: 'from-emerald-600 via-green-500 to-teal-600',
      path: '/practice-options',
      stats: 'ללא הגבלה',
      mode: '🎁 חינמי לחלוטין'
    },
    {
      id: 'history',
      title: 'היסטוריה ושאלות שמורות',
      description: 'צפיה בתוצאות קודמות ושאלות שמרת',
      icon: <History className="w-8 h-8" />,
      gradient: 'from-purple-600 via-pink-500 to-rose-600',
      path: '/simulation-history',
      requiresAuth: true,
      stats: 'ארכיון אישי'
    },
  ];

  const questionTypes: QuestionTypeOption[] = [
    {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'שאלות השלמת משפטים ומילים חסרות',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות',
      icon: <RotateCcw className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      type: 'reading-comprehension',
      title: 'הבנת הנקרא',
      description: 'שאלות הבנת הנקרא עם קטעים',
      icon: <BookOpenCheck className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const handleOptionClick = (option: SimulationOption) => {
    console.log("🎮 SimulationsEntry: Option clicked:", option.id);
    console.log("  - Requires auth:", option.requiresAuth);
    console.log("  - User authenticated:", !!currentUser);
    console.log("  - Is premium:", option.isPremium);
    console.log("  - User is premium:", isPremium);
    console.log("  - Auth loading:", isLoading);

    // If auth is still loading, wait before making navigation decisions
    if (isLoading) {
      console.log("⏳ Auth still loading, waiting...");
      // Set a small timeout to allow auth to complete
      setTimeout(() => {
        handleOptionClick(option);
      }, 100);
      return;
    }

    if (option.requiresAuth && !currentUser) {
      console.log("🔒 Redirecting to login (auth required)");
      navigate('/login');
      return;
    }

    if (option.isPremium && !isPremium) {
      console.log("💎 Redirecting to premium (premium required)");
      navigate('/premium');
      return;
    }

    console.log("✅ Navigating to:", option.path);
    navigate(option.path);
  };

  const handleQuestionTypeClick = (type: string) => {
    console.log("📚 Question type clicked:", type);
    navigate(`/simulation/type/${type}`);
  };

  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mb-6 mx-auto">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-orange-500 border-r-orange-500/50 border-b-orange-500/30 border-l-orange-500/10 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">טוען...</h2>
            <p className="text-gray-400">מכין את מרכז הסימולציות</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl" />
        </div>

        <div ref={containerRef} className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12 lg:py-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-8 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 md:mb-6 shadow-2xl"
            >
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6"
                style={{ 
                  fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1'
                }}>
              <span className="block">מרכז הסימולציות</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                המתקדם ביותר
              </span>
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto px-2"
               style={{ 
                 fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                 fontWeight: '400',
                 letterSpacing: '-0.01em'
               }}>
              בחר את סוג התרגול המתאים לך והתחל להתכונן למבחן הפסיכומטרי
              <span className="block mt-1 md:mt-2 text-gray-400 text-sm md:text-lg">עם הכלים המתקדמים ביותר בשוק</span>
            </p>
          </motion.div>

          {/* Main Options Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-20"
            onMouseMove={handleMouseMove}
          >
            {simulationOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                onHoverStart={() => setHoveredCard(option.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative"
              >
                <motion.div
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${option.gradient} p-1 cursor-pointer group`}
                  onClick={() => handleOptionClick(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Card glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-white/20 blur-xl" />
                  </div>

                  <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-[22px] p-4 md:p-8 h-full">
                    {/* Lock overlay */}
                    <AnimatePresence>
                      {((option.requiresAuth && !currentUser) || (option.isPremium && !isPremium)) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-[22px] flex items-center justify-center z-20"
                        >
                          <motion.div 
                            className="text-center px-4"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                              {option.requiresAuth ? <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" /> : <Shield className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />}
                            </div>
                            <p className="font-semibold text-white text-base md:text-lg">
                              {option.requiresAuth && !currentUser ? 'נדרשת התחברות' : 'גרסה פרימיום'}
                            </p>
                            <p className="text-white/60 text-xs md:text-sm mt-1 md:mt-2">
                              {option.requiresAuth && !currentUser 
                                ? 'התחבר כדי לגשת לתוכן זה' 
                                : 'שדרג לפרימיום לגישה מלאה'}
                            </p>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Card content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4 md:mb-6">
                        <motion.div 
                          className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4"
                          animate={hoveredCard === option.id ? { rotate: [0, -10, 10, -10, 0] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {option.icon}
                        </motion.div>
                        <motion.div
                          className="text-white/50 group-hover:text-white transition-colors"
                          animate={hoveredCard === option.id ? { x: 5 } : { x: 0 }}
                        >
                          <ArrowUpRight className="w-6 h-6" />
                        </motion.div>
                      </div>

                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3"
                          style={{ 
                            fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: '700'
                          }}>
                        {option.title}
                      </h3>
                      
                      <p className="text-white/70 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                        {option.description}
                      </p>

                      {option.mode && (
                        <div className="mb-3 md:mb-4">
                          <span className="text-white/80 text-xs md:text-sm bg-white/10 rounded-lg px-2 md:px-3 py-1 inline-block">
                            {option.mode}
                          </span>
                        </div>
                      )}

                      {option.stats && (
                        <div className="flex items-center text-white/50 text-xs md:text-sm">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          <span>{option.stats}</span>
                        </div>
                      )}
                    </div>

                    {/* Animated gradient border */}
                    <motion.div
                      className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
                        backgroundSize: '200% 100%',
                      }}
                      animate={hoveredCard === option.id ? {
                        backgroundPosition: ['0% 0%', '200% 0%']
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Free Practice Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald-500/20 p-4 md:p-10">
              <div className="flex items-center mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center ml-3 md:ml-4">
                  <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-bold text-white"
                      style={{ 
                        fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: '700'
                      }}>
                    תרגול חינמי לפי סוג שאלה
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">בחר סוג שאלה ותרגל חינם ללא הגבלות</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                {questionTypes.map((type, index) => (
                  <motion.div
                    key={type.type}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.5 + index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ x: 5 }}
                    onClick={() => handleQuestionTypeClick(type.type)}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-center p-4 md:p-6 rounded-2xl bg-gray-700/30 hover:bg-gray-600/50 hover:shadow-lg border border-gray-600/30 hover:border-emerald-500/50 transition-all duration-300">
                      <motion.div 
                        className={`${type.bgColor} ${type.color} p-3 md:p-4 rounded-xl ml-4 md:ml-6`}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        {type.icon}
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-base md:text-lg mb-1">{type.title}</h3>
                        <p className="text-gray-300 text-sm md:text-base leading-tight">{type.description}</p>
                      </div>
                      
                      <motion.div
                        className="text-gray-400 group-hover:text-emerald-400 transition-colors flex-shrink-0"
                        animate={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-20"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-10 overflow-hidden relative border border-gray-700/50">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6 md:mb-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center ml-3 md:ml-4">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold text-white"
                      style={{ 
                        fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: '700'
                      }}>
                    הבדלים בין מצבי התרגול
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 p-4 md:p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm">
                    <h3 className="text-lg md:text-xl font-bold text-green-400 mb-3 md:mb-4 flex items-center">
                      <span className="text-xl md:text-2xl ml-2">📚</span>
                      מצב תרגול
                    </h3>
                    <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm md:text-base">
                      <li>• הסברים מיידיים אחרי כל שאלה</li>
                      <li>• אפשרות לחזור לשאלות קודמות</li>
                      <li>• ללא הגבלת זמן</li>
                      <li>• מתאים ללמידה ושיפור</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-4 md:p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                    <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-3 md:mb-4 flex items-center">
                      <span className="text-xl md:text-2xl ml-2">🎯</span>
                      מצב מבחן
                    </h3>
                    <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm md:text-base">
                      <li>• הסברים רק בסוף המבחן</li>
                      <li>• אין אפשרות לחזור לשאלות</li>
                      <li>• הגבלת זמן כמו במבחן האמיתי</li>
                      <li>• מתאים לבדיקת מוכנות</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SimulationsEntry;
