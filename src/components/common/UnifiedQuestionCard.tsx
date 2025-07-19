
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Brain, FileText, Volume2, PenTool, Eye, EyeOff, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Flag, RotateCcw } from "lucide-react";
import { Question } from "@/data/types/questionTypes";

interface UnifiedQuestionCardProps {
  // Core question data
  currentQuestion?: Question;
  question?: Question;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  
  // Answer state
  selectedAnswerIndex?: number | null;
  isAnswerSubmitted?: boolean;
  showExplanation?: boolean;
  showAnswer?: boolean;
  isAnswered?: boolean;
  userAnswer?: number;
  isCorrect?: boolean;
  showUserAnswer?: boolean;
  
  // Flags and states
  isFlagged?: boolean;
  isSaved?: boolean;
  
  // Mode configuration
  examMode?: boolean;
  showAnswersImmediately?: boolean;
  variant?: 'practice' | 'simulation' | 'review';
  
  // Timer
  remainingTime?: number;
  
  // Progress data
  answeredQuestionsCount?: number;
  correctQuestionsCount?: number;
  progressPercentage?: number;
  
  // UI options
  showSaveButton?: boolean;
  
  // Event handlers
  onAnswerSelect?: (index: number) => void;
  onSubmitAnswer?: () => void;
  onNextQuestion?: () => void;
  onPreviousQuestion?: () => void;
  onToggleExplanation?: () => void;
  onToggleAnswer?: () => void;
  onToggleQuestionFlag?: () => void;
  onToggleSave?: () => void;
  onEditQuestion?: (question: Question) => void;
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
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
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

const UnifiedQuestionCard: React.FC<UnifiedQuestionCardProps> = ({
  currentQuestion,
  question,
  currentQuestionIndex = 0,
  totalQuestions = 1,
  selectedAnswerIndex = null,
  isAnswerSubmitted = false,
  showExplanation = false,
  showAnswer = false,
  isAnswered = false,
  userAnswer,
  isCorrect,
  showUserAnswer = false,
  isFlagged = false,
  isSaved = false,
  examMode = false,
  showAnswersImmediately = true,
  variant = 'practice',
  remainingTime,
  answeredQuestionsCount,
  correctQuestionsCount,
  progressPercentage,
  showSaveButton = true,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleAnswer,
  onToggleQuestionFlag,
  onToggleSave,
  onEditQuestion
}) => {
  // Use either currentQuestion or question prop
  const activeQuestion = currentQuestion || question;
  
  if (!activeQuestion) {
    return null;
  }

  const canShowAnswer = showAnswer || (showExplanation && showAnswersImmediately);
  const isSubmittedOrShowAnswer = isAnswerSubmitted || showAnswer;

  return (
    <Card className="w-full mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-3">
              שאלה #{currentQuestionIndex + 1} מתוך {totalQuestions}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium border"
              >
                {getTypeIcon(activeQuestion.type)}
                {getTypeLabel(activeQuestion.type)}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={`px-2 py-1 text-xs font-medium border ${getDifficultyColor(activeQuestion.difficulty)}`}
              >
                {getDifficultyLabel(activeQuestion.difficulty)}
              </Badge>

              {activeQuestion.is_premium && (
                <Badge 
                  variant="outline" 
                  className="px-2 py-1 text-xs font-medium border bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-orange-200"
                >
                  ⭐ פרימיום
                </Badge>
              )}

              {activeQuestion.metadata?.estimatedTime && (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {activeQuestion.metadata.estimatedTime} דק'
                </Badge>
              )}

              {remainingTime !== undefined && examMode && (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                </Badge>
              )}

              {isAnswered && (
                <Badge 
                  variant="outline" 
                  className={`px-2 py-1 text-xs font-medium ${
                    isCorrect 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {isCorrect ? '✓ נכון' : '✗ שגוי'}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showSaveButton && onToggleSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSave}
                className="flex-shrink-0"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            )}

            {onToggleQuestionFlag && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleQuestionFlag}
                className="flex-shrink-0"
              >
                <Flag className={`h-4 w-4 ${isFlagged ? 'text-red-600 fill-current' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Information */}
        {variant === 'simulation' && (answeredQuestionsCount !== undefined || progressPercentage !== undefined) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between text-sm text-blue-800">
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

      <CardContent className="space-y-4">
        {/* Passage Text (for reading comprehension) */}
        {activeQuestion.passageText && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">
              {activeQuestion.passageTitle || 'קטע לקריאה'}
            </h4>
            <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
              {activeQuestion.passageText}
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-800 font-medium leading-relaxed">
            {activeQuestion.text}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 text-sm">אפשרויות תשובה:</h4>
          {activeQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedAnswerIndex === index && !isSubmittedOrShowAnswer
                  ? 'bg-blue-50 border-blue-300 text-blue-900'
                  : canShowAnswer && index === activeQuestion.correctAnswer
                  ? 'bg-green-50 border-green-300 text-green-900'
                  : showUserAnswer && index === userAnswer && userAnswer !== activeQuestion.correctAnswer
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : selectedAnswerIndex === index && isSubmittedOrShowAnswer
                  ? index === activeQuestion.correctAnswer
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => {
                if (!isSubmittedOrShowAnswer && onAnswerSelect) {
                  onAnswerSelect(index);
                }
              }}
            >
              <span className="font-medium text-sm mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
              {canShowAnswer && index === activeQuestion.correctAnswer && (
                <span className="mr-2 text-green-600 font-bold">✓</span>
              )}
              {showUserAnswer && index === userAnswer && userAnswer !== activeQuestion.correctAnswer && (
                <span className="mr-2 text-red-600 font-bold">✗</span>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            {onPreviousQuestion && currentQuestionIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousQuestion}
                className="flex items-center gap-2"
              >
                <ChevronRight className="h-4 w-4" />
                קודם
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {!isSubmittedOrShowAnswer && selectedAnswerIndex !== null && onSubmitAnswer && (
              <Button
                onClick={onSubmitAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                שלח תשובה
              </Button>
            )}

            {onToggleExplanation && isSubmittedOrShowAnswer && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleExplanation}
                className="flex items-center gap-2"
              >
                {showExplanation ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    הסתר הסבר
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    הצג הסבר
                  </>
                )}
              </Button>
            )}

            {onToggleAnswer && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleAnswer}
                className="flex items-center gap-2"
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    הסתר תשובה
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    הצג תשובה
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {onNextQuestion && currentQuestionIndex < totalQuestions - 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNextQuestion}
                className="flex items-center gap-2"
              >
                הבא
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Explanation */}
        {canShowAnswer && showExplanation && activeQuestion.explanation && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">הסבר:</h4>
            <div className="explanation-container text-blue-800 text-sm leading-relaxed">
              {activeQuestion.explanation}
            </div>
          </div>
        )}

        {/* Tips */}
        {activeQuestion.tips && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-semibold text-yellow-900 mb-2">טיפים:</h4>
            <p className="text-yellow-800 text-sm leading-relaxed">
              {activeQuestion.tips}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedQuestionCard;
