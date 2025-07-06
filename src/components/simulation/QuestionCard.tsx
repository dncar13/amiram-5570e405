import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Brain, FileText, Volume2, PenTool, Eye, EyeOff, Flag, ChevronLeft, ChevronRight, Trophy, RotateCcw } from "lucide-react";
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
  onResetQuestion?: () => void;
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
  onFinishSimulation,
  onResetQuestion
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
    <div className="w-full max-w-none px-1 sm:px-4">
      <Card className="mb-4 sm:mb-6 shadow-2xl border-0 bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm border border-slate-600/50">
        <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <CardTitle className="text-base sm:text-xl font-bold text-slate-100 text-center sm:text-right">
                  שאלה #{currentQuestionIndex + 1} מתוך {totalQuestions}
                </CardTitle>
                
                {/* Visual Progress Bar - קו התקדמות ויזואלי */}
                {totalQuestions > 0 && (
                  <div className="w-full sm:w-auto sm:min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">התקדמות</span>
                      <span className="text-xs font-bold text-slate-200">
                        {currentQuestionIndex + 1}/{totalQuestions}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 h-2 rounded-full bg-slate-700/30 overflow-hidden">
                      {Array.from({ length: totalQuestions }, (_, index) => {
                        // קביעת הצבע לכל שאלה
                        let bgColor = 'bg-slate-600/40'; // אפור בהיר - לא נענה
                        
                        if (index < currentQuestionIndex) {
                          // שאלה שכבר נענתה - כרגע לא יודעים איזו נכונה ואיזו לא
                          // אז נציג הכל כ"נענה" עד שנקבל מידע מדויק יותר
                          bgColor = 'bg-blue-400/70';
                        } else if (index === currentQuestionIndex) {
                          // השאלה הנוכחית
                          bgColor = 'bg-blue-500/80 animate-pulse';
                        }
                        
                        return (
                          <div
                            key={index}
                            className={`flex-1 h-full ${bgColor} transition-all duration-300 ${
                              index === currentQuestionIndex ? 'ring-1 ring-blue-400/50' : ''
                            }`}
                            style={{ minWidth: `${100 / totalQuestions}%` }}
                          />
                        );
                      })}
                    </div>
                    
                    {/* מידע קומפקטי על דיוק - תיקון החישוב */}
                    {correctQuestionsCount !== undefined && answeredQuestionsCount !== undefined && answeredQuestionsCount > 0 && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-green-400">
                          ✓ {correctQuestionsCount}
                        </span>
                        <span className="text-xs text-slate-400">
                          {Math.round((correctQuestionsCount / answeredQuestionsCount) * 100)}% דיוק
                        </span>
                        <span className="text-xs text-red-400">
                          ✗ {answeredQuestionsCount - correctQuestionsCount}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border-blue-400/30"
                >
                  {getTypeIcon(currentQuestion.type)}
                  <span className="hidden sm:inline">{getTypeLabel(currentQuestion.type)}</span>
                  <span className="sm:hidden text-xs">{getTypeLabel(currentQuestion.type).substring(0, 6)}</span>
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={`px-2 py-1 text-xs font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}
                >
                  {getDifficultyLabel(currentQuestion.difficulty)}
                </Badge>

                {currentQuestion.metadata?.estimatedTime && (
                  <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 text-purple-300 border-purple-400/30">
                    <Clock className="h-3 w-3" />
                    <span>{currentQuestion.metadata.estimatedTime}'</span>
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleQuestionFlag}
                className="flex items-center gap-2 flex-shrink-0 hover:bg-slate-600/50 px-3 py-2"
              >
                <Flag className={`h-4 w-4 ${isFlagged ? 'text-red-400 fill-current' : 'text-slate-400'}`} />
                <span className="text-xs text-slate-400">שמור</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetQuestion}
                className="flex items-center gap-2 flex-shrink-0 hover:bg-slate-600/50 px-3 py-2"
              >
                <RotateCcw className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-400">איפוס</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-6 p-4 sm:p-6">
          {/* Question Text - Clean and minimal */}
          <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="bg-blue-500 rounded-full p-1">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h4 className="font-bold text-blue-300 text-sm sm:text-base">שאלה:</h4>
            </div>
            <div 
              dir="ltr" 
              style={{direction: 'ltr', textAlign: 'left'}}
            >
              <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
                {currentQuestion.text}
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-bold text-slate-200 text-sm sm:text-base mb-2">אפשרויות תשובה:</h4>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswerIndex === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isIncorrect = isSelected && isSubmittedOrShowAnswer && !isCorrect;
              // Always use bright text after submission for readability
              const answerTextColor = isSubmittedOrShowAnswer
                ? 'text-slate-100'
                : isSubmittedOrShowAnswer && isCorrect
                ? 'text-green-100'
                : isIncorrect
                ? 'text-red-100'
                : isSelected
                ? 'text-blue-100'
                : 'text-slate-300';
              return (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 cursor-pointer backdrop-blur-sm text-sm sm:text-base ${
                    isSelected && !isSubmittedOrShowAnswer
                      ? 'bg-blue-500/30 border-blue-400 text-blue-100 shadow-lg shadow-blue-500/20'
                      : isSubmittedOrShowAnswer && isCorrect
                      ? 'bg-green-600/30 border-green-400 text-green-100 shadow-lg shadow-green-500/20'
                      : isIncorrect
                      ? 'bg-red-600/30 border-red-400 text-red-100 shadow-lg shadow-red-500/20'
                      : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-600/30 hover:border-slate-500/50'
                  } ${!isSubmittedOrShowAnswer ? 'active:scale-95' : ''}`}
                  onClick={() => {
                    if (!isSubmittedOrShowAnswer && onAnswerSelect && onSubmitAnswer) {
                      // Select and immediately submit the answer without delay
                      onAnswerSelect(index);
                      onSubmitAnswer();
                    }
                  }}
                  dir="ltr" 
                  style={{direction: 'ltr', textAlign: 'left'}}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1 gap-2 sm:gap-3">
                      <span className={`font-bold text-sm sm:text-base flex-shrink-0 mt-0.5 ${
                        isSubmittedOrShowAnswer && isCorrect 
                          ? 'text-green-300' 
                          : isIncorrect 
                          ? 'text-red-300' 
                          : isSelected 
                          ? 'text-blue-300' 
                          : 'text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className={`flex-1 leading-relaxed ${answerTextColor}`}>{option}</span>
                    </div>
                    <div className="flex items-center gap-1 mr-1">
                      {isSubmittedOrShowAnswer && isCorrect && (
                        <span className="text-green-400 font-bold text-lg">✓</span>
                      )}
                      {isIncorrect && (
                        <span className="text-red-400 font-bold text-lg">✗</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons - שיפור תצוגה במובייל */}
          {/* SINGLE ROW OF BUTTONS ONLY! No duplication between mobile/desktop. */}
          <div className="flex w-full flex-wrap gap-2 justify-between items-center pt-4 sm:pt-6">
            {/* Previous button */}
            {onPreviousQuestion && currentQuestionIndex > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={onPreviousQuestion}
                className="flex items-center gap-2 bg-slate-700/80 border-slate-500 text-slate-200 hover:bg-slate-600 hover:text-white px-4 py-3 font-medium text-sm sm:text-lg"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                קודם
              </Button>
            )}
            {/* Explanation button */}
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
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg shadow-green-500/20 px-6 sm:px-8 py-3 text-base sm:text-lg"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">סיים סימולציה</span>
                <span className="sm:hidden">סיים</span>
              </Button>
            )}
            {/* Next button */}
            {onNextQuestion && currentQuestionIndex < totalQuestions - 1 && (
              <Button
                variant="outline"
                size="lg"
                onClick={onNextQuestion}
                className="flex items-center gap-2 bg-slate-700/80 border-slate-500 text-slate-200 hover:bg-slate-600 hover:text-white px-4 py-3 font-medium text-sm sm:text-lg"
              >
                הבא
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
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
