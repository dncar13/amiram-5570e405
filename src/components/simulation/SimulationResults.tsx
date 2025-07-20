
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, RotateCcw, Home, TrendingUp, Clock, Target, Award, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Question } from "@/data/types/questionTypes";

interface SimulationResultsProps {
  score?: number;
  totalQuestions?: number;
  timeSpent?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  questions?: Question[];
  questionsData?: Question[];
  userAnswers?: Record<number, number | null> | (number | null)[];
  onRestart?: () => void;
  onReview?: () => void;
  onBackToTopics?: () => string;
  onNavigateToQuestion?: (index: number) => void;
  difficulty?: string;
  type?: string;
  completionTime?: string;
  isQuestionSet?: boolean;
  // New props for backward compatibility
  answeredQuestionsCount?: number;
  correctQuestionsCount?: number;
  questionFlags?: boolean[];
}

interface QuestionAnalysis {
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
  questionIndex: number;
}

const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-400';
  if (percentage >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

const getScoreBadgeColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-green-600/20 text-green-300 border-green-400/30';
  if (percentage >= 60) return 'bg-yellow-600/20 text-yellow-300 border-yellow-400/30';
  return 'bg-red-600/20 text-red-300 border-red-400/30';
};

const getPerformanceMessage = (percentage: number): string => {
  if (percentage >= 90) return "ביצוע מעולה! 🎉";
  if (percentage >= 80) return "ביצוע טוב מאוד! 👏";
  if (percentage >= 70) return "ביצוע טוב! 👍";
  if (percentage >= 60) return "ביצוע סביר. יש מקום לשיפור.";
  return "צריך להתאמן יותר. אל תתייאש!";
};

const SimulationResults: React.FC<SimulationResultsProps> = ({
  score,
  totalQuestions,
  timeSpent,
  correctAnswers,
  incorrectAnswers,
  questions,
  questionsData,
  userAnswers = {},
  onRestart,
  onReview,
  onBackToTopics,
  onNavigateToQuestion,
  difficulty,
  type,
  completionTime,
  isQuestionSet,
  answeredQuestionsCount,
  correctQuestionsCount
}) => {
  const navigate = useNavigate();
  
  // Use either questions or questionsData
  const activeQuestions = questions || questionsData || [];
  const activeTotalQuestions = totalQuestions || activeQuestions.length;
  const activeScore = score || correctQuestionsCount || 0;
  const activeCorrectAnswers = correctAnswers || correctQuestionsCount || 0;
  const activeIncorrectAnswers = incorrectAnswers || (activeTotalQuestions - activeCorrectAnswers);
  
  const percentage = activeTotalQuestions > 0 ? Math.round((activeScore / activeTotalQuestions) * 100) : 0;

  // Convert userAnswers to consistent format
  const normalizedUserAnswers: Record<number, number | null> = Array.isArray(userAnswers) 
    ? userAnswers.reduce((acc, answer, index) => ({ ...acc, [index]: answer }), {} as Record<number, number | null>)
    : userAnswers;

  // Create question analysis
  const questionAnalysis: QuestionAnalysis[] = activeQuestions.map((question, index) => ({
    question,
    userAnswer: normalizedUserAnswers[index] ?? null,
    isCorrect: normalizedUserAnswers[index] === question.correctAnswer,
    questionIndex: index
  }));

  // Separate correct and incorrect answers for easier review
  const incorrectQuestions = questionAnalysis.filter(analysis => !analysis.isCorrect && analysis.userAnswer !== null);
  const correctQuestions = questionAnalysis.filter(analysis => analysis.isCorrect);

  const formatTime = (seconds?: number): string => {
    if (!seconds) return 'לא זמין';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Results Card */}
      <Card className="text-center bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-100">
            סיום הסימולציה!
          </CardTitle>
          <p className="text-slate-300 mt-2">
            {getPerformanceMessage(percentage)}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="space-y-3">
            <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-slate-300">
              <span className="text-xl font-semibold">{activeScore}</span>
              <span className="text-sm"> מתוך </span>
              <span className="text-xl font-semibold">{activeTotalQuestions}</span>
              <span className="text-sm"> שאלות</span>
            </div>
            <Progress value={percentage} className="w-full h-3" />
          </div>

          {/* Performance Badge */}
          <Badge 
            variant="outline" 
            className={`px-4 py-2 text-lg font-semibold ${getScoreBadgeColor(percentage)}`}
          >
            {percentage >= 80 ? 'מצוין' : percentage >= 60 ? 'טוב' : 'דורש שיפור'}
          </Badge>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center bg-gradient-to-br from-slate-800/60 to-slate-700/60 border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{activeCorrectAnswers}</div>
            <div className="text-sm text-slate-300">תשובות נכונות</div>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-slate-800/60 to-slate-700/60 border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">{activeIncorrectAnswers}</div>
            <div className="text-sm text-slate-300">תשובות שגויות</div>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-slate-800/60 to-slate-700/60 border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-slate-300">זמן ביצוע</div>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-slate-800/60 to-slate-700/60 border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">{percentage}%</div>
            <div className="text-sm text-slate-300">אחוז הצלחה</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onRestart && (
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg shadow-blue-500/20"
          >
            <RotateCcw className="h-4 w-4" />
            התחל מחדש
          </Button>
        )}

        {onReview && (
          <Button
            onClick={onReview}
            variant="outline"
            className="flex items-center gap-2 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200"
          >
            <TrendingUp className="h-4 w-4" />
            סקור תשובות
          </Button>
        )}

        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center gap-2 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200"
        >
          <Home className="h-4 w-4" />
          חזור לעמוד הבית
        </Button>
      </div>

      {/* Incorrect Answers Section - Highlighted for review */}
      {incorrectQuestions.length > 0 && (
        <Card className="border-red-500/30 bg-red-600/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-300">
              <Target className="h-5 w-5" />
              שאלות שנענו שגוי - מומלץ לסקור ({incorrectQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {incorrectQuestions.map((analysis, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 bg-red-600/20 border-red-500/50 cursor-pointer hover:shadow-md transition-shadow hover:bg-red-600/30 backdrop-blur-sm"
                  onClick={() => onNavigateToQuestion && onNavigateToQuestion(analysis.questionIndex)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-red-200">
                      שאלה #{analysis.questionIndex + 1}
                    </span>
                    <span className="text-lg text-red-400">✗</span>
                  </div>
                  <div className="text-xs text-red-200 mb-1">
                    תשובתך: {analysis.userAnswer !== null 
                      ? String.fromCharCode(65 + analysis.userAnswer)
                      : 'לא נענה'
                    }
                  </div>
                  <div className="text-xs text-green-300">
                    תשובה נכונה: {String.fromCharCode(65 + analysis.question.correctAnswer)}
                  </div>
                  <div className="text-xs text-slate-300 mt-2 truncate">
                    {analysis.question.text.substring(0, 50)}...
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Correct Answers Section */}
      {correctQuestions.length > 0 && (
        <Card className="border-green-500/30 bg-green-600/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-300">
              <CheckCircle className="h-5 w-5" />
              שאלות שנענו נכון ({correctQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {correctQuestions.map((analysis, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border-2 bg-green-600/20 border-green-500/50 cursor-pointer hover:shadow-md transition-shadow hover:bg-green-600/30 backdrop-blur-sm"
                  onClick={() => onNavigateToQuestion && onNavigateToQuestion(analysis.questionIndex)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-green-200">
                      שאלה #{analysis.questionIndex + 1}
                    </span>
                    <span className="text-lg text-green-400">✓</span>
                  </div>
                  <div className="text-xs text-green-200 mt-1">
                    תשובה: {String.fromCharCode(65 + analysis.userAnswer!)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationResults;
