
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Brain, FileText, Volume2, PenTool, Eye, EyeOff, Flag, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Question } from "@/data/types/questionTypes";

interface QuestionCardProps {
  currentQuestion: Question | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  isFlagged: boolean;
  examMode: boolean;
  showAnswersImmediately: boolean;
  answeredQuestionsCount?: number;
  correctQuestionsCount?: number;
  progressPercentage?: number;
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
  onFinishSimulation?: () => void;
}

const getTypeIcon = (type: Question['type']) => {
  switch (type) {
    case 'reading-comprehension': {
      const Icon = BookOpen;
      return <Icon className="h-4 w-4" />;
    }
    case 'sentence-completion': {
      const Icon = FileText;
      return <Icon className="h-4 w-4" />;
    }
    case 'restatement': {
      const Icon = Brain;
      return <Icon className="h-4 w-4" />;
    }
    case 'vocabulary': {
      const Icon = PenTool;
      return <Icon className="h-4 w-4" />;
    }
    case 'grammar': {
      const Icon = FileText;
      return <Icon className="h-4 w-4" />;
    }
    case 'writing': {
      const Icon = PenTool;
      return <Icon className="h-4 w-4" />;
    }
    case 'listening': {
      const Icon = Volume2;
      return <Icon className="h-4 w-4" />;
    }
    default: {
      const Icon = Brain;
      return <Icon className="h-4 w-4" />;
    }
  }
};

const getTypeLabel = (type: Question['type']) => {
  const labels = {
    'reading-comprehension': 'הבנת הנקרא',
    'sentence-completion': 'השלמת משפטים',
    'restatement': 'ניסוח מחדש',
    'vocabulary': 'אוצר מילים',
    'grammar': 'דקדוק',
    'writing': 'כתיבה',
    'listening': 'הבנת הנשמע',
    'comprehensive': 'כללי'
  };
  return labels[type] || type;
};

const getDifficultyColor = (difficulty: Question['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-300 border-green-400/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
    case 'hard':
      return 'bg-red-500/20 text-red-300 border-red-400/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  }
};

const getDifficultyLabel = (difficulty: Question['difficulty']) => {
  const labels = {
    easy: 'קל',
    medium: 'בינוני',
    hard: 'קשה'
  };
  return labels[difficulty] || difficulty;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswerIndex,
  isAnswerSubmitted,
  showExplanation,
  isFlagged,
  examMode,
  showAnswersImmediately,
  answeredQuestionsCount,
  correctQuestionsCount,
  progressPercentage,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleQuestionFlag,
  onFinishSimulation
}) => {
  if (!currentQuestion) {
    return null;
  }

  const canShowAnswer = showExplanation && showAnswersImmediately;
  const isSubmittedOrShowAnswer = isAnswerSubmitted;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  console.log('QuestionCard render:', {
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    isAnswerSubmitted,
    onFinishSimulation: !!onFinishSimulation
  });

  return (
    <div className="w-full max-w-none px-2 sm:px-4">
      <Card className="mb-6 shadow-2xl border-0 bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm border border-slate-600/50">
        <CardHeader className="pb-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 px-3 sm:px-6">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-100 mb-3 sm:mb-4">
                שאלה #{currentQuestionIndex + 1} מתוך {totalQuestions}
              </CardTitle>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-300 border-blue-400/30"
                >
                  {getTypeIcon(currentQuestion.type)}
                  <span className="hidden sm:inline">{getTypeLabel(currentQuestion.type)}</span>
                  <span className="sm:hidden">{getTypeLabel(currentQuestion.type).substring(0, 8)}</span>
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}
                >
                  {getDifficultyLabel(currentQuestion.difficulty)}
                </Badge>

                {currentQuestion.metadata?.estimatedTime && (
                  <Badge variant="outline" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-500/20 text-purple-300 border-purple-400/30">
                    <Clock className="h-3 w-3" />
                    <span className="hidden sm:inline">{currentQuestion.metadata.estimatedTime} דק'</span>
                    <span className="sm:hidden">{currentQuestion.metadata.estimatedTime}'</span>
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleQuestionFlag}
                className="flex-shrink-0 hover:bg-slate-600/50"
              >
                <Flag className={`h-5 w-5 ${isFlagged ? 'text-red-400 fill-current' : 'text-slate-400'}`} />
              </Button>
            </div>
          </div>

          {/* Progress Information */}
          {(answeredQuestionsCount !== undefined || progressPercentage !== undefined) && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-500/10 rounded-xl border border-blue-400/30 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0 text-xs sm:text-sm text-blue-300">
                {answeredQuestionsCount !== undefined && (
                  <span>נענו: {answeredQuestionsCount} שאלות</span>
                )}
                {correctQuestionsCount !== undefined && answeredQuestionsCount !== undefined && answeredQuestionsCount > 0 && (
                  <span>דיוק: {Math.round((correctQuestionsCount / answeredQuestionsCount) * 100)}%</span>
                )}
                {progressPercentage !== undefined && (
                  <span>התקדמות: {Math.round(progressPercentage)}%</span>
                )}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Passage Text (for reading comprehension) - רחב יותר במובייל */}
          {currentQuestion.passageText && (
            <div 
              className="bg-slate-700/50 rounded-xl p-4 sm:p-6 border border-slate-600/30 backdrop-blur-sm -mx-1 sm:mx-0"
              dir="ltr" 
              style={{direction: 'ltr', textAlign: 'left'}}
            >
              <h4 className="font-bold text-slate-200 mb-3 sm:mb-4 text-base sm:text-lg">
                {currentQuestion.passageTitle || 'קטע לקריאה'}
              </h4>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {currentQuestion.passageText}
              </div>
            </div>
          )}

          {/* Question Text - עיצוב משופר כדי להבדיל מהתשובות */}
          <div 
            className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl p-4 sm:p-6 border-2 border-blue-400/50 backdrop-blur-sm shadow-lg shadow-blue-500/10 -mx-1 sm:mx-0"
            dir="ltr" 
            style={{direction: 'ltr', textAlign: 'left'}}
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-500/30 rounded-full p-2 flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-blue-300 font-bold mb-2 text-sm uppercase tracking-wide">Question</h4>
                <p className="text-slate-100 font-medium leading-relaxed text-base sm:text-lg">
                  {currentQuestion.text}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-bold text-slate-200 text-base sm:text-lg">אפשרויות תשובה:</h4>
            
            {/* הודעה על תוצאת התשובה */}
            {isSubmittedOrShowAnswer && selectedAnswerIndex !== null && (
              <div className={`p-3 rounded-lg border ${
                selectedAnswerIndex === currentQuestion.correctAnswer
                  ? 'bg-green-500/20 border-green-400/50 text-green-300'
                  : 'bg-red-500/20 border-red-400/50 text-red-300'
              }`}>
                {selectedAnswerIndex === currentQuestion.correctAnswer ? (
                  <span className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>תשובה נכונה! כל הכבוד!</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>תשובה שגויה. התשובה הנכונה היא: <strong>{String.fromCharCode(65 + currentQuestion.correctAnswer)}</strong></span>
                  </span>
                )}
              </div>
            )}
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswerIndex === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isIncorrect = isSelected && isSubmittedOrShowAnswer && !isCorrect;
              
              return (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-sm text-sm sm:text-base ${
                    isSelected && !isSubmittedOrShowAnswer
                      ? 'bg-blue-500/30 border-blue-400 text-blue-100 shadow-lg shadow-blue-500/20'
                      : isSubmittedOrShowAnswer && isCorrect
                      ? 'bg-green-600/30 border-green-400 text-green-100 shadow-lg shadow-green-500/20'
                      : isIncorrect
                      ? 'bg-red-600/30 border-red-400 text-red-100 shadow-lg shadow-red-500/20'
                      : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-600/30 hover:border-slate-500/50'
                  }`}
                  onClick={() => {
                    if (!isSubmittedOrShowAnswer && onAnswerSelect) {
                      onAnswerSelect(index);
                    }
                  }}
                  dir="ltr" 
                  style={{direction: 'ltr', textAlign: 'left'}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start flex-1">
                      <span className="font-bold text-base sm:text-lg mr-2 sm:mr-3 flex-shrink-0">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="flex-1">{option}</span>
                    </div>
                    <div className="flex items-center gap-2 mr-2 sm:mr-3">
                      {isSubmittedOrShowAnswer && isCorrect && (
                        <span className="text-green-400 font-bold text-lg sm:text-xl">✓</span>
                      )}
                      {isIncorrect && (
                        <span className="text-red-400 font-bold text-lg sm:text-xl">✗</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons - שיפור תצוגה במובייל */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 pt-4 sm:pt-6">
            
            {/* Mobile Layout - כפתורי ניווט למעלה */}
            <div className="flex sm:hidden w-full justify-between items-center">
              {/* Previous button - משמאל במובייל */}
              {onPreviousQuestion && currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onPreviousQuestion}
                  className="flex items-center gap-2 bg-slate-700/80 border-slate-500 text-slate-200 hover:bg-slate-600 hover:text-white px-6 py-3 font-medium"
                >
                  <ChevronRight className="h-5 w-5" />
                  קודם
                </Button>
              )}
              
              {/* Next button - מימין במובייל */}
              {onNextQuestion && currentQuestionIndex < totalQuestions - 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onNextQuestion}
                  className="flex items-center gap-2 bg-slate-700/80 border-slate-500 text-slate-200 hover:bg-slate-600 hover:text-white px-6 py-3 font-medium"
                >
                  הבא
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Desktop Layout */}
            {/* Next button - left side in RTL */}
            <div className="hidden sm:flex gap-3">
              {onNextQuestion && currentQuestionIndex < totalQuestions - 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextQuestion}
                  className="flex items-center gap-2 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200"
                >
                  הבא
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Center buttons - תמיד במרכז */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
              {!isSubmittedOrShowAnswer && selectedAnswerIndex !== null && onSubmitAnswer && (
                <Button
                  onClick={onSubmitAnswer}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg shadow-blue-500/20 px-6 sm:px-8 py-3 text-base sm:text-lg flex-1 sm:flex-none"
                >
                  שלח תשובה
                </Button>
              )}

              {onToggleExplanation && isSubmittedOrShowAnswer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleExplanation}
                  className="flex items-center gap-1 sm:gap-2 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200 px-3 sm:px-4"
                >
                  {showExplanation ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span className="hidden sm:inline">הסתר הסבר</span>
                      <span className="sm:hidden">הסתר</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">הצג הסבר</span>
                      <span className="sm:hidden">הסבר</span>
                    </>
                  )}
                </Button>
              )}

              {/* Finish Button */}
              {isLastQuestion && isSubmittedOrShowAnswer && onFinishSimulation && (
                <Button
                  onClick={onFinishSimulation}
                  size="lg"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg shadow-green-500/20 px-6 sm:px-8 py-3 text-base sm:text-lg flex-1 sm:flex-none"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">סיים סימולציה</span>
                  <span className="sm:hidden">סיים</span>
                </Button>
              )}
            </div>

            {/* Previous button - right side in RTL (Desktop only - במובייל זה למעלה) */}
            <div className="hidden sm:flex gap-3">
              {onPreviousQuestion && currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousQuestion}
                  className="flex items-center gap-2 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200"
                >
                  <ChevronRight className="h-4 w-4" />
                  קודם
                </Button>
              )}
            </div>
          </div>

          {/* Explanation - Enhanced with clear border */}
          {canShowAnswer && showExplanation && currentQuestion.explanation && (
            <div className="bg-blue-500/10 rounded-xl p-4 sm:p-6 border-2 border-blue-400/50 backdrop-blur-sm shadow-lg shadow-blue-500/10">
              <h4 className="font-bold text-blue-300 mb-2 sm:mb-3 text-base sm:text-lg">הסבר:</h4>
              <p 
                className="text-blue-200 leading-relaxed text-sm sm:text-base"
                dir="ltr" 
                style={{direction: 'ltr', textAlign: 'left'}}
              >
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Tips */}
          {currentQuestion.tips && (
            <div className="bg-yellow-500/10 rounded-xl p-4 sm:p-6 border border-yellow-400/30 backdrop-blur-sm">
              <h4 className="font-bold text-yellow-300 mb-2 sm:mb-3 text-base sm:text-lg">טיפים:</h4>
              <p className="text-yellow-200 leading-relaxed text-sm sm:text-base">
                {currentQuestion.tips}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;
