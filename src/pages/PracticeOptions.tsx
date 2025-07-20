import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuickPracticeProgress } from '@/hooks/useQuickPracticeProgress';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowRight,
  Zap,
  BookOpen,
  Target,
  Play,
  RotateCcw,
  Crown,
  Unlock
} from 'lucide-react';

interface PracticeOptionData {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const PracticeOptions: React.FC = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const { isPremium, currentUser } = useAuth();
  
  // Get quick practice progress and refresh it when component mounts
  const { progress, isLoading, hasInProgressPractice, hasCompletedPractice, clearProgress, refreshProgress } = useQuickPracticeProgress(type || '');

  // Refresh progress when component becomes visible (when user returns from simulation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshProgress();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshProgress]);

  // Also refresh when component mounts
  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const questionTypesData: Record<string, PracticeOptionData> = {
    'sentence-completion': {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'שאלות השלמת משפטים ומילים חסרות',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-blue-600',
      gradient: 'from-blue-500 via-purple-500 to-cyan-500'
    },
    'restatement': {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות',
      icon: <Target className="w-8 h-8" />,
      color: 'text-green-600',
      gradient: 'from-green-500 via-teal-500 to-emerald-500'
    }
  };

  const currentType = type ? questionTypesData[type] : null;

  const difficultyLabels: Record<string, string> = {
    'easy': 'קל',
    'medium': 'בינוני', 
    'hard': 'קשה'
  };

  const handleQuickPractice = () => {
    navigate(`/simulation/${type}/${difficulty}?limit=10`);
  };

  const handleChooseSet = () => {
    navigate(`/simulation/type/${type}/${difficulty}/sets`);
  };

  const handleBack = () => {
    navigate(`/simulation/type/${type}`);
  };

  const handleStartNewQuickPractice = () => {
    if (hasInProgressPractice) {
      clearProgress();
    }
    navigate(`/simulation/${type}?type=${type}&limit=10`);
  };

  if (!currentType || !difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">שגיאה</h1>
          <button
            onClick={() => navigate('/simulations-entry')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            חזור לדף הכניסה
          </button>
        </div>
      </div>
    );
  }

  // Get button text and icon based on progress
  const getQuickPracticeButtonContent = () => {
    if (isLoading) {
      return {
        text: 'טוען...',
        icon: <Zap className="w-6 h-6 ml-3" />,
        showProgress: false
      };
    }

    if (hasInProgressPractice && progress) {
      return {
        text: 'המשך תרגול',
        icon: <Play className="w-6 h-6 ml-3" />,
        showProgress: true,
        progressText: `בהתקדמות - ${progress.answeredQuestions}/${progress.totalQuestions} שאלות`
      };
    }

    return {
      text: 'התחל תרגול (10 שאלות)',
      icon: <Zap className="w-6 h-6 ml-3" />,
      showProgress: false
    };
  };

  const buttonContent = getQuickPracticeButtonContent();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBack}
              className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 font-medium transition-colors duration-300"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              חזור לבחירת רמת קושי
            </button>
            
            <div className={`bg-gradient-to-r ${currentType.gradient} text-white rounded-3xl p-8 mb-8 border border-white/20 backdrop-blur-sm shadow-2xl`}>
              <div className="flex items-center mb-6">
                <div className="bg-white bg-opacity-20 rounded-2xl p-4 ml-4 backdrop-blur-sm">
                  {currentType.icon}
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{currentType.title}</h1>
                  <p className="text-white text-opacity-90 text-xl">
                    רמת קושי: {difficultyLabels[difficulty]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Practice Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Quick Practice */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 ml-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">תרגול מהיר</h2>
              </div>
              
              {/* Progress indicator */}
              {buttonContent.showProgress && (
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-blue-400 font-medium text-center">
                    {buttonContent.progressText}
                  </p>
                </div>
              )}
              
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {hasInProgressPractice 
                  ? `המשך את התרגול שהתחלת - נותרו ${progress?.totalQuestions && progress?.answeredQuestions ? progress.totalQuestions - progress.answeredQuestions : 0} שאלות`
                  : `התחל תרגול מיידי עם 10 שאלות רנדומליות - זמין חינם לכל המשתמשים`
                }
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleQuickPractice}
                  className={`w-full bg-gradient-to-r ${currentType.gradient} text-white py-5 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20 relative`}
                >
                  <div className="flex items-center justify-center">
                    {buttonContent.icon}
                    {buttonContent.text}
                  </div>
                  {/* Badge for free access */}
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    חינם לכולם
                  </div>
                </button>

                {/* Start new practice button when there's progress */}
                {hasInProgressPractice && (
                  <button
                    onClick={handleStartNewQuickPractice}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl font-medium text-base hover:shadow-lg transition-all duration-300 border border-white/10"
                  >
                    <div className="flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 ml-2" />
                      התחל תרגול חדש
                    </div>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Choose Sets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10 relative"
            >
              {isPremium ? (
                // Premium user - show accessible difficulty selection with premium effects
                <>
                  <motion.div 
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(251, 191, 36, 0.4)",
                        "0 0 0 10px rgba(251, 191, 36, 0)",
                        "0 0 0 0 rgba(251, 191, 36, 0)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Crown className="w-3 h-3 mr-1" />
                    </motion.div>
                    פרימיום פעיל
                  </motion.div>
                  
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="bg-gradient-to-br from-yellow-500/30 to-orange-600/30 rounded-2xl p-3 ml-4 border border-yellow-500/30"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 30px rgba(251, 191, 36, 0.3)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Crown className="w-8 h-8 text-yellow-300" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-yellow-200">בחירת רמת קושי</h2>
                  </div>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    בחר רמת קושי ספציפית לתרגול ממוקד - גישה מלאה עם המנוי שלך 🔓
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <motion.button
                      onClick={() => handleChooseSet()}
                      className="w-full bg-gradient-to-r from-green-500/30 to-green-600/30 text-green-300 py-4 px-6 rounded-xl font-medium text-base border border-green-500/30 backdrop-blur-sm hover:from-green-500/40 hover:to-green-600/40 transition-all duration-300 group relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 0 25px rgba(34, 197, 94, 0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center">
                        <Unlock className="w-5 h-5 ml-2" />
                        <span>קל - רמה בסיסית</span>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleChooseSet()}
                      className="w-full bg-gradient-to-r from-yellow-500/30 to-orange-600/30 text-yellow-300 py-4 px-6 rounded-xl font-medium text-base border border-yellow-500/30 backdrop-blur-sm hover:from-yellow-500/40 hover:to-orange-600/40 transition-all duration-300 group relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 0 25px rgba(251, 191, 36, 0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center">
                        <Unlock className="w-5 h-5 ml-2" />
                        <span>בינוני - רמה מתקדמת</span>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleChooseSet()}
                      className="w-full bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-300 py-4 px-6 rounded-xl font-medium text-base border border-red-500/30 backdrop-blur-sm hover:from-red-500/40 hover:to-red-600/40 transition-all duration-300 group relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 0 25px rgba(239, 68, 68, 0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center">
                        <Unlock className="w-5 h-5 ml-2" />
                        <span>קשה - רמה מומחה</span>
                      </div>
                    </motion.button>
                  </div>
                  
                  <motion.div 
                    className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Crown className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                      <p className="text-yellow-400 text-sm">
                        ✨ כמשתמש פרימיום, יש לך גישה מלאה לכל רמות הקושי
                      </p>
                    </div>
                  </motion.div>
                </>
              ) : (
                // Free user - show locked difficulty selection  
                <>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center">
                    <span className="mr-1">💎</span>
                    פרימיום בלבד
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-2xl p-3 ml-4 border border-purple-500/30">
                      <BookOpen className="w-8 h-8 text-purple-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-purple-200">בחירת רמת קושי</h2>
                  </div>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    בחר רמת קושי ספציפית לתרגול ממוקד - זמין למנויי פרימיום בלבד
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <button
                      className="w-full bg-gradient-to-r from-gray-600/50 to-gray-700/50 text-gray-400 py-4 px-6 rounded-xl font-medium text-base border border-gray-500/30 backdrop-blur-sm cursor-not-allowed opacity-60"
                      disabled
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🔒</span>
                        <span>קל - דורש פרימיום</span>
                      </div>
                    </button>
                    
                    <button
                      className="w-full bg-gradient-to-r from-gray-600/50 to-gray-700/50 text-gray-400 py-4 px-6 rounded-xl font-medium text-base border border-gray-500/30 backdrop-blur-sm cursor-not-allowed opacity-60"
                      disabled
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🔒</span>
                        <span>בינוני - דורש פרימיום</span>
                      </div>
                    </button>
                    
                    <button
                      className="w-full bg-gradient-to-r from-gray-600/50 to-gray-700/50 text-gray-400 py-4 px-6 rounded-xl font-medium text-base border border-gray-500/30 backdrop-blur-sm cursor-not-allowed opacity-60"
                      disabled
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🔒</span>
                        <span>קשה - דורש פרימיום</span>
                      </div>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => navigate('/premium')}
                    className="w-full bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-300 py-3 px-6 rounded-xl font-medium text-base hover:from-purple-500/30 hover:to-pink-600/30 transition-all duration-300 border border-purple-500/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center">
                      <Crown className="w-5 h-5 ml-2" />
                      שדרג לפרימיום לגישה מלאה
                    </div>
                  </button>
                </>
              )}
            </motion.div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">מה ההבדל?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm">
                  <h4 className="text-xl font-bold text-green-400 mb-3 flex items-center justify-center">
                    <span className="mr-2">🆓</span>
                    תרגול מהיר - חינם
                  </h4>
                  <ul className="text-gray-300 text-right space-y-2">
                    <li>• 10 שאלות רנדומליות מעורבות</li>
                    <li>• זמין מיד ללא הרשמה</li>
                    <li>• מושלם להתחלה ולהיכרות</li>
                    <li>• בדיקה מהירה של היכולות</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                  <h4 className="text-xl font-bold text-purple-400 mb-3 flex items-center justify-center">
                    <span className="mr-2">💎</span>
                    בחירת רמת קושי - פרימיום
                  </h4>
                  <ul className="text-gray-300 text-right space-y-2">
                    <li>• בחירה ספציפית של רמת קושי</li>
                    <li>• שאלות מסודרות לפי רמה</li>
                    <li>• מעקב התקדמות מדויק</li>
                    <li>• למידה מתמדת וממוקדת</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-400 text-sm">
                  💡 התחל עם התרגול החינמי כדי להכיר את המערכת ולאחר מכן שדרג לפרימיום לחוויה מלאה
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PracticeOptions;
