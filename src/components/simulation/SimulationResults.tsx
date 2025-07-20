
import React from "react";
import { Question } from "@/data/types/questionTypes";
import ResultsSummary from "./results/ResultsSummary";
import ResultsActions from "./results/ResultsActions";
import ResultsQuestionReview from "./results/ResultsQuestionReview";
import { checkUserPremiumStatus } from "@/services/supabaseQuestionsService";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles } from "lucide-react";

interface SimulationResultsProps {
  score: number;
  questionsData: Question[];
  userAnswers: (number | null)[];
  questionFlags: boolean[];
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  onRestart: () => void;
  onBackToTopics: () => string;
  onNavigateToQuestion: (index: number) => void;
  isQuestionSet?: boolean;
}

const SimulationResults = ({
  score,
  questionsData,
  userAnswers,
  questionFlags,
  answeredQuestionsCount,
  correctQuestionsCount,
  onRestart,
  onBackToTopics,
  onNavigateToQuestion,
  isQuestionSet
}: SimulationResultsProps) => {
  const [userIsPremium, setUserIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const isPremium = await checkUserPremiumStatus();
        setUserIsPremium(isPremium);
      } catch (error) {
        console.error('Error checking premium status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, []);

  const handleUpgradeClick = () => {
    // Navigate to premium page or show upgrade modal
    window.location.href = '/premium';
  };

  const showUpgradePrompt = !userIsPremium && !isLoading;

  return (
    <div className="w-full max-w-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Results Summary */}
          <ResultsSummary
            score={score}
            answeredQuestionsCount={answeredQuestionsCount}
            correctQuestionsCount={correctQuestionsCount}
            totalQuestions={questionsData.length}
          />

          {/* Premium Upgrade Prompt */}
          {showUpgradePrompt && (
            <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-700/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-300">הושלמו כל השאלות החינמיות!</h3>
                  <p className="text-amber-200/80">שדרג לפרמיום כדי לגשת לאלפי שאלות נוספות</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleUpgradeClick}
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium px-6"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  שדרג לפרמיום
                </Button>
                <div className="text-sm text-amber-200/60">
                  ✨ גישה לכל השאלות • 📊 מעקב מתקדם • 🎯 תרגול מותאם אישית
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <ResultsActions
            onRestart={onRestart}
            onBackToTopics={onBackToTopics}
            isQuestionSet={isQuestionSet}
          />

          {/* Question Review */}
          <ResultsQuestionReview
            questionsData={questionsData}
            userAnswers={userAnswers}
            questionFlags={questionFlags}
            onNavigateToQuestion={onNavigateToQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
