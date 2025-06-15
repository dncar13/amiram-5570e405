
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/data/questionsData";
import { ChevronRight, ChevronLeft, Flag, Eye, EyeOff, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { ReadingPassage } from "./ReadingPassage";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface QuestionCardWithStoryProps {
  currentQuestion: Question | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  isFlagged: boolean;
  examMode: boolean;
  showAnswersImmediately: boolean;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
}

const QuestionCardWithStory = ({
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
  onToggleQuestionFlag
}: QuestionCardWithStoryProps) => {

  // Add keyboard navigation (same as QuestionCard)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent keyboard shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentQuestionIndex > 0) {
            onPreviousQuestion();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (isAnswerSubmitted && currentQuestionIndex < totalQuestions - 1) {
            onNextQuestion();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          const answerIndex = parseInt(event.key) - 1;
          if (!isAnswerSubmitted && currentQuestion && currentQuestion.answers && answerIndex < currentQuestion.answers.length) {
            onAnswerSelect(answerIndex);
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (!isAnswerSubmitted && selectedAnswerIndex !== null) {
            onSubmitAnswer();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex, totalQuestions, isAnswerSubmitted, selectedAnswerIndex, currentQuestion, onPreviousQuestion, onNextQuestion, onAnswerSelect, onSubmitAnswer]);

  if (!currentQuestion) {
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center text-slate-400">טוען שאלה...</div>
        </CardContent>
      </Card>
    );
  }

  // Add additional safety check for answers array
  if (!currentQuestion.answers || !Array.isArray(currentQuestion.answers)) {
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center text-slate-400">שגיאה בטעינת השאלה - אין תשובות זמינות</div>
        </CardContent>
      </Card>
    );
  }

  const isCorrect = isAnswerSubmitted && selectedAnswerIndex === currentQuestion.correctAnswer;
  const isIncorrect = isAnswerSubmitted && selectedAnswerIndex !== null && selectedAnswerIndex !== currentQuestion.correctAnswer;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Reading Passage Section */}
      <div className="lg:order-1">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl h-full">
          <CardHeader className="pb-4 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
                <BookOpen className="h-6 w-6 text-slate-300" />
              </div>
              <span className="font-bold text-slate-100">קטע לקריאה</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ReadingPassage 
              title={currentQuestion.passageTitle}
              passageWithLines={currentQuestion.passageWithLines}
              showLineNumbers={currentQuestion.lineNumbers}
            />
          </CardContent>
        </Card>
      </div>

      {/* Question Section */}
      <div className="lg:order-2">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl h-full">
          <CardHeader className="pb-4 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
                  <CheckCircle className="h-6 w-6 text-slate-300" />
                </div>
                <span className="font-bold text-slate-100">
                  שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
                </span>
              </CardTitle>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-10 w-10 rounded-lg border transition-all duration-300",
                  isFlagged 
                    ? "bg-amber-600/20 border-amber-500/50 text-amber-400 hover:bg-amber-600/30" 
                    : "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60"
                )}
                onClick={onToggleQuestionFlag}
                title={isFlagged ? "הסר סימון" : "סמן שאלה"}
              >
                <Flag className={cn("h-5 w-5", isFlagged && "fill-amber-400")} />
              </Button>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
                <span>התקדמות</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-slate-800/60 rounded-full border border-slate-600/50" 
                indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              />
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
                <h3 className="text-xl font-bold text-slate-100 mb-4 leading-relaxed">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="space-y-4">
                {currentQuestion.answers.map((answer, index) => {
                  const isSelected = selectedAnswerIndex === index;
                  const isCorrectAnswer = index === currentQuestion.correctAnswer;
                  const shouldShowCorrect = isAnswerSubmitted && isCorrectAnswer;
                  const shouldShowIncorrect = isAnswerSubmitted && isSelected && !isCorrectAnswer;
                  
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "w-full p-6 h-auto rounded-xl border-2 transition-all duration-300 text-right justify-start text-wrap",
                        "bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/60",
                        isSelected && !isAnswerSubmitted && "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20",
                        shouldShowCorrect && "bg-green-600/20 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20",
                        shouldShowIncorrect && "bg-red-600/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20"
                      )}
                      onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                      disabled={isAnswerSubmitted}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-lg font-medium leading-relaxed flex-1 text-right">
                          {answer}
                        </span>
                        <div className="flex items-center gap-3 mr-4">
                          <span className="bg-slate-700/80 text-slate-300 px-3 py-1 rounded-lg text-sm font-bold border border-slate-600/50">
                            {index + 1}
                          </span>
                          {shouldShowCorrect && <CheckCircle className="h-6 w-6 text-green-400" />}
                          {shouldShowIncorrect && <XCircle className="h-6 w-6 text-red-400" />}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {isAnswerSubmitted && (
              <div className={cn(
                "rounded-xl p-6 border-2 shadow-xl backdrop-blur-sm",
                isCorrect 
                  ? "bg-green-600/10 border-green-500/30 shadow-green-500/10" 
                  : "bg-red-600/10 border-red-500/30 shadow-red-500/10"
              )}>
                <div className="flex items-center gap-4 mb-4">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-green-400" />
                      <div>
                        <h4 className="text-xl font-bold text-green-300">תשובה נכונה!</h4>
                        <p className="text-green-200">כל הכבוד, המשך כך</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8 text-red-400" />
                      <div>
                        <h4 className="text-xl font-bold text-red-300">תשובה שגויה</h4>
                        <p className="text-red-200">התשובה הנכונה היא: {currentQuestion.answers[currentQuestion.correctAnswer]}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {isAnswerSubmitted && currentQuestion.explanation && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={onToggleExplanation}
                  className="bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 rounded-xl"
                >
                  {showExplanation ? (
                    <>
                      <EyeOff className="h-5 w-5 ml-2" />
                      הסתר הסבר
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 ml-2" />
                      הצג הסבר
                    </>
                  )}
                </Button>
                
                {showExplanation && (
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
                    <h4 className="text-lg font-semibold text-slate-200 mb-3">הסבר:</h4>
                    <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Updated navigation buttons section */}
            <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-600/50">
              {/* Previous Question Button */}
              <Button
                variant="outline"
                onClick={onPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={cn(
                  "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 rounded-xl px-6 py-3",
                  currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-5 w-5 ml-2" />
                שאלה קודמת
              </Button>

              {/* Keyboard shortcuts hint */}
              <div className="text-center text-sm text-slate-400 bg-slate-800/40 rounded-lg px-4 py-2 border border-slate-600/30">
                <div>מקלדת: ←→ ניווט | 1-4 תשובות | Enter שליחה</div>
              </div>

              {/* Submit/Next Button */}
              {!isAnswerSubmitted ? (
                <Button
                  onClick={onSubmitAnswer}
                  disabled={selectedAnswerIndex === null}
                  className={cn(
                    "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg transition-all duration-300",
                    selectedAnswerIndex === null && "opacity-50 cursor-not-allowed"
                  )}
                >
                  שלח תשובה
                  <ChevronRight className="h-5 w-5 mr-2" />
                </Button>
              ) : (
                <Button
                  onClick={onNextQuestion}
                  disabled={currentQuestionIndex >= totalQuestions - 1}
                  className={cn(
                    "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg transition-all duration-300",
                    currentQuestionIndex >= totalQuestions - 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  שאלה הבאה
                  <ChevronRight className="h-5 w-5 mr-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionCardWithStory;
