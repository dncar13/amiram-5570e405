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
  BarChart3
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [isAuthenticated] = useState(false);
  const [isPremium] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const simulationOptions: SimulationOption[] = [
    {
      id: 'full-simulation',
      title: 'סימולציה מלאה',
      description: '30 שאלות מעורבות מכל הקטגוריות - כמו במבחן האמיתי',
      icon: <PlayCircle className="w-8 h-8" />,
      gradient: 'from-blue-600 via-blue-500 to-indigo-600',
      path: '/simulation/full',
      stats: '25 דקות'
    },
    {
      id: 'practice-by-type',
      title: 'תרגול לפי סוג שאלה',
      description: 'השלמת משפטים, ניסוח מחדש, הבנת הנקרא',
      icon: <Target className="w-8 h-8" />,
      gradient: 'from-emerald-600 via-green-500 to-teal-600',
      path: '/simulation/by-type',
      stats: 'גמיש'
    },
    {
      id: 'history',
      title: 'היסטוריה ושאלות שמורות',
      description: 'צפיה בתוצאות קודמות ושאלות שמרת',
      icon: <History className="w-8 h-8" />,
      gradient: 'from-purple-600 via-pink-500 to-rose-600',
      path: '/simulation/history',
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
    if (option.requiresAuth && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (option.isPremium && !isPremium) {
      navigate('/premium');
      return;
    }

    navigate(option.path);
  };

  const handleQuestionTypeClick = (type: string) => {
    // Direct navigation to reading comprehension for that specific type
    if (type === 'reading-comprehension') {
      navigate('/reading-comprehension');
    } else {
      navigate(`/simulation/type/${type}`);
    }
  };

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(useTransform(mouseX, [0, 300], [-50, 50]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, 300], [-50, 50]), springConfig);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        </div>

        <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-2xl"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
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
            
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto"
               style={{ 
                 fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                 fontWeight: '400',
                 letterSpacing: '-0.01em'
               }}>
              בחר את סוג התרגול המתאים לך והתחל להתכונן למבחן הפסיכומטרי
              <span className="block mt-2 text-gray-500 text-lg">עם הכלים המתקדמים ביותר בשוק</span>
            </p>
          </motion.div>

          {/* Main Options Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
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

                  <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-[22px] p-8 h-full">
                    {/* Lock overlay */}
                    <AnimatePresence>
                      {((option.requiresAuth && !isAuthenticated) || (option.isPremium && !isPremium)) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-[22px] flex items-center justify-center z-20"
                        >
                          <motion.div 
                            className="text-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                              {option.requiresAuth ? <Lock className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-amber-400" />}
                            </div>
                            <p className="font-semibold text-white text-lg">
                              {option.requiresAuth && !isAuthenticated ? 'נדרשת התחברות' : 'גרסה פרימיום'}
                            </p>
                            <p className="text-white/60 text-sm mt-2">
                              {option.requiresAuth && !isAuthenticated 
                                ? 'התחבר כדי לגשת לתוכן זה' 
                                : 'שדרג לפרימיום לגישה מלאה'}
                            </p>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Card content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <motion.div 
                          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
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

                      <h3 className="text-2xl font-bold text-white mb-3"
                          style={{ 
                            fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: '700'
                          }}>
                        {option.title}
                      </h3>
                      
                      <p className="text-white/70 mb-6 leading-relaxed">
                        {option.description}
                      </p>

                      {option.stats && (
                        <div className="flex items-center text-white/50 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
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

          {/* Question Types Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center ml-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900"
                    style={{ 
                      fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeight: '700'
                    }}>
                  תרגול לפי סוג שאלה
                </h2>
              </div>

              <div className="space-y-4">
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
                    whileHover={{ x: 10 }}
                    onClick={() => handleQuestionTypeClick(type.type)}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-200 transition-all duration-300">
                      <motion.div 
                        className={`${type.bgColor} ${type.color} p-4 rounded-xl ml-6`}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        {type.icon}
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{type.title}</h3>
                        <p className="text-gray-600">{type.description}</p>
                      </div>
                      
                      <motion.div
                        className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        animate={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        <ChevronRight className="w-6 h-6" />
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
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-10 overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center ml-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white"
                      style={{ 
                        fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: '700'
                      }}>
                    הסטטיסטיקות שלך
                  </h2>
                </div>
                
                {isAuthenticated ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { value: "0", label: "סימולציות הושלמו", icon: <PlayCircle />, color: "from-blue-500 to-indigo-600" },
                      { value: "0%", label: "אחוז הצלחה ממוצע", icon: <TrendingUp />, color: "from-emerald-500 to-green-600" },
                      { value: "0", label: "שאלות נענו", icon: <BookOpenCheck />, color: "from-purple-500 to-pink-600" },
                      { value: "0", label: "שאלות שמורות", icon: <Star />, color: "from-amber-500 to-orange-600" }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="relative group"
                      >
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-full">
                          <motion.div
                            className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {React.cloneElement(stat.icon as React.ReactElement, { className: "w-5 h-5" })}
                          </motion.div>
                          <div className={`text-3xl font-bold mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                            {stat.value}
                          </div>
                          <div className="text-white/60 text-sm">{stat.label}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <User className="w-12 h-12 text-white/50" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      התחבר כדי לראות את הסטטיסטיקות שלך
                    </h3>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                      עקוב אחר ההתקדמות שלך ושמור שאלות למטרות תרגול עתידיות
                    </p>
                    
                    <motion.button
                      onClick={() => navigate('/login')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                      style={{ fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      <span className="flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        התחבר עכשיו
                      </span>
                    </motion.button>
                  </motion.div>
                )}
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
