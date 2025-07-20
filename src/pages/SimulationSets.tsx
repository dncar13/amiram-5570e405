import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Target, Zap, Gamepad2, Lock, Crown } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getQuestionsByDifficultyAndType } from "@/services/questionsService";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSetProgressSummary } from "@/hooks/useSetProgress";
import { SetProgressCard } from "@/components/ui/SetProgressCard";
import { SetProgressService } from "@/services/setProgressService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface QuestionSet {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  startIndex: number;
  endIndex: number;
  isPremium: boolean;
}

const SimulationSets = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [freeQuestions, setFreeQuestions] = useState(0);
  const [premiumQuestions, setPremiumQuestions] = useState(0);
  const isMobile = useIsMobile();
  const { currentUser, isPremium } = useAuth();
  
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
        // Get ALL questions for this type and difficulty (both free and premium)
        const questions = await getQuestionsByDifficultyAndType(difficulty, type);
        setTotalQuestions(questions.length);

        // Count free vs premium questions
        const freeCount = questions.filter(q => !q.is_premium).length;
        const premiumCount = questions.filter(q => q.is_premium).length;
        setFreeQuestions(freeCount);
        setPremiumQuestions(premiumCount);

        // Create sets of 10 questions each
        const questionsPerSet = 10;
        const numberOfSets = Math.ceil(questions.length / questionsPerSet);
        
        const sets: QuestionSet[] = [];
        for (let i = 0; i < numberOfSets; i++) {
          const startIndex = i * questionsPerSet;
          const endIndex = Math.min(startIndex + questionsPerSet, questions.length);
          const actualCount = endIndex - startIndex;
          
          // Determine if this set contains premium questions
          const setQuestions = questions.slice(startIndex, endIndex);
          const hasPremiumQuestions = setQuestions.some(q => q.is_premium);
          
          sets.push({
            id: i + 1,
            title: hasPremiumQuestions ? `סט ${i + 1} פרימיום` : `סט ${i + 1}`,
            description: `שאלות ${startIndex + 1}-${endIndex} ברמת קושי ${getDifficultyInHebrew(difficulty)}`,
            questionsCount: actualCount,
            startIndex,
            endIndex: endIndex - 1,
            isPremium: hasPremiumQuestions
          });
        }
        
        setQuestionSets(sets);
        
        console.log(`🔍 Loaded ${questions.length} questions: ${freeCount} free, ${premiumCount} premium`);
      } catch (error) {
        console.error('Error loading questions for sets:', error);
        setTotalQuestions(0);
        setQuestionSets([]);
      }
    };

    loadQuestions();
  }, [type, difficulty]);

  // Refresh progress when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser) {
        refreshSummary();
      }
    };

    const handleFocus = () => {
      if (currentUser) {
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

  const handleSetAccess = (set: QuestionSet) => {
    // If set contains premium content and user is not premium, show upgrade message
    if (set.isPremium && !isPremium) {
      toast.error("תוכן זה זמין למנויי פרימיום בלבד", {
        description: "שדרג לפרימיום כדי לגשת לכל השאלות",
        action: {
          label: "שדרג עכשיו",
          onClick: () => navigate('/premium')
        }
      });
      return;
    }

    // Navigate to simulation with set parameters
    navigate(`/simulation/${type}/${difficulty}?set=${set.id}&start=${set.startIndex}`);
  };
  
  const handleSetContinue = (set: QuestionSet) => {
    // Same premium check for continue
    if (set.isPremium && !isPremium) {
      toast.error("תוכן זה זמין למנויי פרימיום בלבד");
      return;
    }

    navigate(`/simulation/${type}/${difficulty}?set=${set.id}&start=${set.startIndex}&continue=true`);
  };
  
  const handleSetRestart = async (set: QuestionSet) => {
    if (!type || !difficulty || !currentUser) return;
    
    // Premium check for restart
    if (set.isPremium && !isPremium) {
      toast.error("תוכן זה זמין למנויי פרימיום בלבד");
      return;
    }
    
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
      
      await refreshSummary();
      
      const navigationUrl = `/simulation/${type}/${difficulty}?set=${set.id}&start=${set.startIndex}&reset=true`;
      navigate(navigationUrl);
    } catch (error) {
      console.error('Error resetting set progress:', error);
      throw error;
    }
  };

  const handleBackClick = () => {
    navigate(`/simulation/type/${type}/${difficulty}`);
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
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
              className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4 sm:mb-6 font-medium transition-colors duration-300"
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
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                    <span className="text-white text-opacity-80 text-xs sm:text-sm bg-green-500/20 rounded-lg px-2 sm:px-3 py-1">
                      🆓 {freeQuestions} שאלות חינמיות
                    </span>
                    <span className="text-white text-opacity-80 text-xs sm:text-sm bg-yellow-500/20 rounded-lg px-2 sm:px-3 py-1">
                      👑 {premiumQuestions} שאלות פרימיום
                    </span>
                  </div>
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  חזרה לבחירת אפשרויות
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {questionSets.map((set, index) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Premium overlay for locked content */}
                  {set.isPremium && !isPremium && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm z-10 flex items-center justify-center border border-yellow-500/30">
                      <div className="text-center">
                        <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-yellow-200 font-semibold text-sm">תוכן פרימיום</p>
                        <Button
                          onClick={() => navigate('/premium')}
                          size="sm"
                          className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          שדרג עכשיו
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <SetProgressCard
                    setId={set.id}
                    setTitle={set.title}
                    setDescription={set.description}
                    questionsCount={set.questionsCount}
                    progress={progressSummary[set.id]}
                    onStart={() => handleSetAccess(set)}
                    onContinue={() => handleSetContinue(set)}
                    onRestart={() => handleSetRestart(set)}
                    isLoading={progressLoading}
                    difficultyColor={getDifficultyColor(difficulty)}
                    className={`h-full transition-all duration-300 ${
                      set.isPremium && !isPremium 
                        ? 'opacity-75 hover:opacity-90' 
                        : 'hover:scale-105'
                    }`}
                    questionType={getTypeInHebrew(type)}
                    difficulty={getDifficultyInHebrew(difficulty)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SimulationSets;