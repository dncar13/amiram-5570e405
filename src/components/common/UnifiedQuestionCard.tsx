
import React, { useState, useEffect } from "react";
import { Question } from "@/data/questionsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Flag,
  Bookmark,
  Clock,
  Edit,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { SaveButton } from "@/components/questions/SaveButton";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";

interface UnifiedQuestionCardProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  isFlagged: boolean;
  examMode?: boolean;
  showAnswersImmediately?: boolean;
  remainingTime?: number;
  answeredQuestionsCount?: number;
  correctQuestionsCount?: number;
  progressPercentage?: number;
  variant?: 'practice' | 'simulation';
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
  onEditQuestion?: (question: Question) => void;
}

const UnifiedQuestionCard = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswerIndex,
  isAnswerSubmitted,
  showExplanation,
  isFlagged,
  examMode = false,
  showAnswersImmediately = true,
  remainingTime,
  answeredQuestionsCount,
  correctQuestionsCount,
  progressPercentage,
  variant = 'practice',
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleQuestionFlag,
  onEditQuestion
}: UnifiedQuestionCardProps) => {
  const { isAdmin, isPremium } = useAuth();
  const { isQuestionSaved } = useSavedQuestions();
  const [localIsFlagged, setLocalIsFlagged] = useState(isFlagged);
  
  useEffect(() => {
    setLocalIsFlagged(isFlagged);
  }, [isFlagged]);

  const handleFlagChange = (flagged: boolean) => {
    setLocalIsFlagged(flagged);
    onToggleQuestionFlag();
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">טוען שאלה...</p>
      </div>
    );
  }

  const correctAnswerIndex = currentQuestion.correctAnswer;
  const isCorrect = selectedAnswerIndex === correctAnswerIndex;
  const showCorrectAnswer = isAnswerSubmitted && showAnswersImmediately;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use the correct property names based on Question type
  const questionText = currentQuestion.text || currentQuestion.question || '';
  const answerOptions = currentQuestion.options || currentQuestion.answers || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with progress and timer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-lg border border-slate-600/50">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-100 mb-2">
            שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
          </h2>
          {progressPercentage !== undefined && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span>התקדמות: {Math.round(progressPercentage)}%</span>
              <Progress value={progressPercentage} className="w-24 h-2" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {remainingTime !== undefined && examMode && (
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4" />
              <span className={cn(
                "font-mono font-bold",
                remainingTime <= 10 ? "text-red-400" : "text-slate-300"
              )}>
                {formatTime(remainingTime)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <SaveButton 
              question={currentQuestion}
              variant="flag"
              isFlagged={localIsFlagged}
              onFlagChange={handleFlagChange}
              className="text-sm"
            />
            
            <SaveButton 
              question={currentQuestion}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600/50 text-slate-100">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl leading-relaxed text-right">
              {questionText}
            </CardTitle>
            {isAdmin && onEditQuestion && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditQuestion(currentQuestion)}
                className="text-slate-400 hover:text-slate-200"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Answer Options */}
          <div className="grid gap-3">
            {answerOptions.map((answer, index) => {
              const isSelected = selectedAnswerIndex === index;
              const isCorrectAnswer = index === correctAnswerIndex;
              const shouldShowCorrect = showCorrectAnswer && isCorrectAnswer;
              const shouldShowWrong = showCorrectAnswer && isSelected && !isCorrectAnswer;

              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                  disabled={isAnswerSubmitted}
                  className={cn(
                    "w-full p-4 h-auto text-right justify-start text-wrap whitespace-normal transition-all duration-200",
                    "border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/70",
                    isSelected && !isAnswerSubmitted && "bg-blue-600/30 border-blue-500 text-blue-200",
                    shouldShowCorrect && "bg-green-600/30 border-green-500 text-green-200",
                    shouldShowWrong && "bg-red-600/30 border-red-500 text-red-200",
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-grow text-right">
                      {answer}
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold">
                      {shouldShowCorrect && <CheckCircle className="w-5 h-5" />}
                      {shouldShowWrong && <XCircle className="w-5 h-5" />}
                      {!showCorrectAnswer && (
                        <span className={cn(
                          isSelected ? "text-blue-200" : "text-slate-400"
                        )}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {!isAnswerSubmitted ? (
              <Button
                onClick={onSubmitAnswer}
                disabled={selectedAnswerIndex === null}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              >
                שלח תשובה
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={onToggleExplanation}
                  variant="outline"
                  className="flex-1 border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/70"
                >
                  {showExplanation ? (
                    <>
                      <EyeOff className="w-4 h-4 ml-2" />
                      הסתר הסבר
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 ml-2" />
                      הצג הסבר
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={onNextQuestion}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <ChevronLeft className="w-4 h-4 ml-2" />
                  שאלה הבאה
                </Button>
              </div>
            )}
          </div>

          {/* Explanation */}
          {showExplanation && isAnswerSubmitted && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                הסבר
              </h3>
              <p className="text-slate-300 leading-relaxed text-right">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Result Badge */}
          {isAnswerSubmitted && showAnswersImmediately && (
            <div className="flex justify-center">
              <Badge 
                variant={isCorrect ? "default" : "destructive"}
                className={cn(
                  "text-base px-4 py-2",
                  isCorrect 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                {isCorrect ? "תשובה נכונה! ✓" : "תשובה שגויה ✗"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/70"
        >
          <ChevronRight className="w-4 h-4 ml-2" />
          שאלה קודמת
        </Button>

        <div className="text-center text-slate-400">
          {answeredQuestionsCount !== undefined && correctQuestionsCount !== undefined && (
            <div className="text-sm">
              נענו: {answeredQuestionsCount} | נכונות: {correctQuestionsCount}
            </div>
          )}
        </div>

        <Button
          onClick={onNextQuestion}
          variant="outline"
          className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/70"
        >
          <ChevronLeft className="w-4 h-4 ml-2" />
          שאלה הבאה
        </Button>
      </div>
    </div>
  );
};

export default UnifiedQuestionCard;
