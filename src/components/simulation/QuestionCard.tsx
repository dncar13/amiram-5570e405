
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

  return (
    <div className="w-full max-w-none">
      <Card className="mb-6 shadow-2xl border-0 bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm border border-slate-600/50">
        <CardHeader className="pb-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-slate-100 mb-4">
                שאלה #{currentQuestionIndex + 1} מתוך {totalQuestions}
              </CardTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 border-blue-400/30"
                >
                  {getTypeIcon(currentQuestion.type)}
                  {getTypeLabel(currentQuestion.type)}
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={`px-3 py-1 text-sm font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}
                >
                  {getDifficultyLabel(currentQuestion.difficulty)}
                </Badge>

                {currentQuestion.metadata?.estimatedTime && (
                  <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-500/20 text-purple-300 border-purple-400/30">
                    <Clock className="h-3 w-3" />
                    {currentQuestion.metadata.estimatedTime} דק'
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
            <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-400/30 backdrop-blur-sm">
              <div className="flex justify-between text-sm text-blue-300">
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

        <CardContent className="space-y-6 p-6">
          {/* Passage Text (for reading comprehension) */}
          {currentQuestion.passageText && (
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm">
              <h4 className="font-bold text-slate-200 mb-4 text-lg">
                {currentQuestion.passageTitle || 'קטע לקריאה'}
              </h4>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {currentQuestion.passageText}
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm">
            <p className="text-slate-200 font-medium leading-relaxed text-lg">
              {currentQuestion.text}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-lg">אפשרויות תשובה:</h4>
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                  selectedAnswerIndex === index && !isSubmittedOrShowAnswer
                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-200 shadow-lg shadow-blue-500/20'
                    : canShowAnswer && index === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border-green-400/50 text-green-200 shadow-lg shadow-green-500/20'
                    : selectedAnswerIndex === index && isSubmittedOrShowAnswer
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-green-500/20 border-green-400/50 text-green-200 shadow-lg shadow-green-500/20'
                      : 'bg-red-500/20 border-red-400/50 text-red-200 shadow-lg shadow-red-500/20'
                    : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-600/30 hover:border-slate-500/50'
                }`}
                onClick={() => {
                  if (!isSubmittedOrShowAnswer && onAnswerSelect) {
                    onAnswerSelect(index);
                  }
                }}
              >
                <span className="font-bold text-lg mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {canShowAnswer && index === currentQuestion.correctAnswer && (
                  <span className="mr-3 text-green-400 font-bold text-xl">✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <div className="flex gap-3">
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

            <div className="flex gap-3">
              {!isSubmittedOrShowAnswer && selectedAnswerIndex !== null && onSubmitAnswer && (
                <Button
                  onClick={onSubmitAnswer}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg shadow-blue-500/20"
                >
                  שלח תשובה
                </Button>
              )}

              {onToggleExplanation && isSubmittedOrShowAnswer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleExplanation}
                  className="flex items-center gap-2 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200"
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

              {/* Finish Button - Show when on last question and answer is submitted */}
              {isLastQuestion && isSubmittedOrShowAnswer && onFinishSimulation && (
                <Button
                  onClick={onFinishSimulation}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg shadow-green-500/20"
                >
                  <Trophy className="h-4 w-4" />
                  סיים סימולציה
                </Button>
              )}
            </div>

            <div className="flex gap-3">
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
          </div>

          {/* Explanation */}
          {canShowAnswer && showExplanation && currentQuestion.explanation && (
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/30 backdrop-blur-sm">
              <h4 className="font-bold text-blue-300 mb-3 text-lg">הסבר:</h4>
              <p className="text-blue-200 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Tips */}
          {currentQuestion.tips && (
            <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-400/30 backdrop-blur-sm">
              <h4 className="font-bold text-yellow-300 mb-3 text-lg">טיפים:</h4>
              <p className="text-yellow-200 leading-relaxed">
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
