import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowLeft, Target, Zap, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getQuestionsByDifficultyAndType } from "@/services/questionsService";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSetProgressSummary } from "@/hooks/useSetProgress";
import { SetProgressCard } from "@/components/ui/SetProgressCard";
import { SetProgressService } from "@/services/setProgressService";
import { useAuth } from "@/context/AuthContext";
import { PremiumSetService, PremiumSet } from "@/services/premiumSetService";
import PremiumSetCard from "@/components/ui/PremiumSetCard";
import PremiumUpgradeModal from "@/components/ui/PremiumUpgradeModal";

interface QuestionSet {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  startIndex: number;
  endIndex: number;
}

const TypeSpecificSets = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [premiumSets, setPremiumSets] = useState<PremiumSet[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isMobile = useIsMobile();
  const { currentUser } = useAuth();
  
  // Load set progress summary
  const { 
    progressSummary, 
    isLoading: progressLoading, 
    refreshSummary 
  } = useSetProgressSummary(type || '', difficulty || '');

  useEffect(() => {
    if (!type || !difficulty) return;

    const loadQuestions = async () => {
      try {
        // Get questions for this type and difficulty
        const questions = await getQuestionsByDifficultyAndType(difficulty, type);
        setTotalQuestions(questions.length);

        // Create sets of 10 questions each
        const questionsPerSet = 10;
        const numberOfSets = Math.ceil(questions.length / questionsPerSet);
        
        const sets: QuestionSet[] = [];
        for (let i = 0; i < numberOfSets; i++) {
          const startIndex = i * questionsPerSet;
          const endIndex = Math.min(startIndex + questionsPerSet, questions.length);
          const actualCount = endIndex - startIndex;
          
          sets.push({
            id: i + 1,
            title: `סט ${i + 1}`,
            description: `שאלות ${startIndex + 1}-${endIndex} ברמת קושי ${getDifficultyInHebrew(difficulty)}`,
            questionsCount: actualCount,
            startIndex,
            endIndex: endIndex - 1
          });
        }
        
        setQuestionSets(sets);
      } catch (error) {
        console.error('Error loading questions for sets:', error);
        setTotalQuestions(0);
        setQuestionSets([]);
      }
    };

    const loadPremiumSets = async () => {
      try {
        // Load premium sets dynamically based on current type and difficulty
        console.log(`🔍 [TypeSpecificSets] Loading premium sets for type: ${type}, difficulty: ${difficulty}`);
        
        const availablePremiumSets = await PremiumSetService.getPremiumSetsByTypeAndDifficulty(type, difficulty);
        setPremiumSets(availablePremiumSets);
        
        console.log(`✅ Loaded ${availablePremiumSets.length} premium sets for ${type}/${difficulty}:`, 
          availablePremiumSets.map(set => ({ id: set.id, count: set.questionCount, title: set.title })));
          
        if (availablePremiumSets.length === 0) {
          console.log(`ℹ️ No premium sets found for ${type}/${difficulty} - this is normal if no premium content exists for this combination`);
        }
      } catch (error) {
        console.error('Error loading premium sets:', error);
        setPremiumSets([]);
      }
    };

    loadQuestions();
    loadPremiumSets();
  }, [type, difficulty]);

  // ✅ Add effect to refresh progress when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser) {
        console.log('🔄 [TypeSpecificSets] Refreshing progress summary on visibility change');
        refreshSummary();
      }
    };

    const handleFocus = () => {
      if (currentUser) {
        console.log('🔄 [TypeSpecificSets] Refreshing progress summary on focus');
        refreshSummary();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser, refreshSummary]);

  const getDifficultyInHebrew = (diff: string) => {
    switch (diff) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      default: return diff;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-red-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'easy': return <Target className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'medium': return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'hard': return <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getTypeInHebrew = (t: string) => {
    switch (t) {
      case 'sentence-completion': return 'השלמת משפטים';
      case 'restatement': return 'ניסוח מחדש';
      case 'vocabulary': return 'אוצר מילים';
      case 'reading-comprehension': return 'הבנת הנקרא';
      default: return t;
    }
  };

  const handleSetStart = (set: QuestionSet) => {
    // Navigate to simulation with set parameters
    navigate(`/simulation/${type}/${difficulty}?set=${set.id}&start=${set.startIndex}`);
  };
  
  const handleSetContinue = (set: QuestionSet) => {
    // Navigate to simulation with continue flag
    navigate(`/simulation/${type}/${difficulty}?set=${set.id}&start=${set.startIndex}&continue=true`);
  };
  
  const handleSetRestart = async (set: QuestionSet) => {
    if (!type || !difficulty || !currentUser) return;
    
    console.log('🔄 [TypeSpecificSets] Starting set restart for:', {
      setId: set.id,
      type,
      difficulty,
      userId: currentUser.id,
      timestamp: new Date().toISOString()
    });
    
    // Log localStorage state before clearing
    const beforeClear = Object.keys(localStorage).filter(key => 
      key.includes('progress') || key.includes('simulation') || key.includes('set_')
    );
    console.log('📦 [TypeSpecificSets] LocalStorage before clear:', beforeClear);
    
    try {
      const result = await SetProgressService.resetSetProgress(
        currentUser.id,
        set.id,
        type,
        difficulty
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to reset set progress');
      }
      
      // Log localStorage state after clearing
      const afterClear = Object.keys(localStorage).filter(key => 
        key.includes('progress') || key.includes('simulation') || key.includes('set_')
      );
      console.log('📦 [TypeSpecificSets] LocalStorage after clear:', afterClear);
      
      // Refresh progress summary
      await refreshSummary();
      
      console.log('✅ [TypeSpecificSets] Set restart completed successfully');
      
      // Start fresh simulation with reset parameter to ensure clean start
      const navigationUrl = `/simulation/${type}/${difficulty}?set=${set.id}&start=${set.startIndex}&reset=true`;
      console.log('🚀 [TypeSpecificSets] Navigating to:', navigationUrl);
      
      navigate(navigationUrl);
    } catch (error) {
      console.error('❌ [TypeSpecificSets] Error resetting set progress:', error);
      // Re-throw the error to be handled by the confirmation dialog
      throw error;
    }
  };

  const handleBackClick = () => {
    navigate(`/simulation/type/${type}/${difficulty}`);
  };

  const handlePremiumSetAccess = (setId: string) => {
    console.log('🔐 Accessing premium set:', setId);
    navigate(`/premium-set/${setId}`);
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  if (!type || !difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">שגיאה בפרמטרים</h1>
            <Button 
              onClick={() => navigate('/simulations-entry')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm sm:text-base"
              aria-label="חזרה לסימולציות"
              tabIndex={0}
            >
              חזרה לסימולציות
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <button
              onClick={handleBackClick}
              className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4 sm:mb-6 font-medium transition-colors duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-lg p-2 -m-2"
              aria-label="חזרה לבחירת רמת קושי"
              tabIndex={0}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              חזרה
            </button>
            
            <div className={`bg-gradient-to-r ${getDifficultyColor(difficulty)} text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/20 backdrop-blur-sm shadow-2xl`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div className="bg-white bg-opacity-20 rounded-xl sm:rounded-2xl p-3 sm:p-4 ml-0 sm:ml-4 backdrop-blur-sm flex-shrink-0">
                  {getDifficultyIcon(difficulty)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    סטי תרגול - {getTypeInHebrew(type)}
                  </h1>
                  <p className="text-white text-opacity-90 text-base sm:text-lg lg:text-xl">
                    רמת קושי: {getDifficultyInHebrew(difficulty)} | סה"כ {totalQuestions} שאלות
                  </p>
                  <p className="text-white text-opacity-80 text-xs sm:text-sm mt-2 sm:mt-3 bg-white/10 rounded-lg px-2 sm:px-3 py-1 inline-block">
                    🎯 כל סט מכיל 10 שאלות למיקוד מותאם
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {questionSets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  לא נמצאו שאלות
                </h2>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">
                  אין שאלות זמינות עבור {getTypeInHebrew(type)} ברמת קושי {getDifficultyInHebrew(difficulty)}
                </p>
                <Button 
                  onClick={handleBackClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm sm:text-base"
                  aria-label="חזרה לבחירת אפשרויות"
                  tabIndex={0}
                >
                  חזרה לבחירת אפשרויות
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Premium Sets Section */}
              {premiumSets.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
                      🏆 סטי פרימיום מתקדמים
                    </h2>
                    <p className="text-yellow-200 text-sm sm:text-base opacity-90">
                      תוכן פרימיום עם שאלות ייחודיות והסברים מפורטים
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {premiumSets.map((premiumSet, index) => (
                      <motion.div
                        key={premiumSet.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <PremiumSetCard
                          premiumSet={premiumSet}
                          onAccessAttempt={handlePremiumSetAccess}
                          onUpgradeClick={handleUpgradeClick}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Regular Sets Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: premiumSets.length > 0 ? 0.4 : 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-2">
                    📚 סטי תרגול רגילים
                  </h2>
                  <p className="text-cyan-200 text-sm sm:text-base opacity-90">
                    סטים בסיסיים לתרגול מובנה
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {questionSets.map((set, index) => (
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (premiumSets.length > 0 ? 0.5 : 0.3) + index * 0.1 }}
                      className="group"
                    >
                      <SetProgressCard
                        setId={set.id}
                        setTitle={set.title}
                        setDescription={set.description}
                        questionsCount={set.questionsCount}
                        progress={progressSummary[set.id]}
                        onStart={() => handleSetStart(set)}
                        onContinue={() => handleSetContinue(set)}
                        onRestart={() => handleSetRestart(set)}
                        isLoading={progressLoading}
                        difficultyColor={getDifficultyColor(difficulty)}
                        className="h-full"
                        questionType={getTypeInHebrew(type)}
                        difficulty={getDifficultyInHebrew(difficulty)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        setTitle={premiumSets.length > 0 ? premiumSets[0].title : "תוכן פרימיום"}
      />
    </>
  );
};

export default TypeSpecificSets;