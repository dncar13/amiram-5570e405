
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/data/questionsData";
import { ChevronRight, ChevronLeft, Flag, Eye, EyeOff, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { ReadingPassage } from "./ReadingPassage";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

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
}

const QuestionCard = ({
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
}: QuestionCardProps) => {

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      const answerOptions = currentQuestion?.options || currentQuestion?.answers || [];
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
          if (!isAnswerSubmitted && currentQuestion && answerOptions && answerIndex < answerOptions.length) {
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
          <div className="text-center text-slate-400">Loading question...</div>
        </CardContent>
      </Card>
    );
  }

  const answerOptions = currentQuestion.options || currentQuestion.answers || [];
  if (!answerOptions || !Array.isArray(answerOptions) || answerOptions.length === 0) {
    console.error('QuestionCard: No answer options found', { 
      id: currentQuestion.id,
      options: currentQuestion.options,
      answers: currentQuestion.answers,
      type: currentQuestion.type
    });
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center text-slate-400">Error loading question - no answers found</div>
          <div className="text-center text-slate-500 text-sm mt-2">
            ID: {currentQuestion.id}, Type: {currentQuestion.type}
          </div>
        </CardContent>
      </Card>
    );
  }

  const calculatedProgressPercentage = progressPercentage || Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  const isCorrect = isAnswerSubmitted && selectedAnswerIndex === currentQuestion.correctAnswer;
  const isIncorrect = isAnswerSubmitted && selectedAnswerIndex !== null && selectedAnswerIndex !== currentQuestion.correctAnswer;

  const hasReadingPassage = currentQuestion.type === 'reading-comprehension' && 
    (currentQuestion.passageText || (currentQuestion.passageWithLines && currentQuestion.passageWithLines.length > 0));

  if (hasReadingPassage) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
        {/* Reading Passage */}
        <div className="lg:order-1 h-full">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl h-full">
            <CardHeader className="h-[80px] pb-4 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
              <CardTitle className="text-2xl flex items-center" dir="ltr">
                <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50 mr-3">
                  <BookOpen className="h-6 w-6 text-slate-300" />
                </div>
                {currentQuestion.passageTitle && (
                  <span className="font-bold text-slate-100">
                    {currentQuestion.passageTitle}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-full">
              <div dir="ltr" className="text-left h-full flex flex-col">
                <ReadingPassage 
                  passageWithLines={currentQuestion.passageWithLines}
                  passageText={currentQuestion.passageText}
                  showLineNumbers={currentQuestion.lineNumbers}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Question Area */}
        <div className="lg:order-2 h-full flex flex-col">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl h-full flex flex-col">
            <CardHeader className="h-[80px] pb-4 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
                    <CheckCircle className="h-5 w-5 text-slate-300" />
                  </div>
                  <span className="font-medium text-slate-100">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 rounded-lg border transition-all duration-300",
                    isFlagged 
                      ? "bg-amber-600/20 border-amber-500/50 text-amber-400 hover:bg-amber-600/30" 
                      : "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60"
                  )}
                  onClick={onToggleQuestionFlag}
                  title={isFlagged ? "Remove flag" : "Flag question"}
                >
                  <Flag className={cn("h-4 w-4", isFlagged && "fill-amber-400")} />
                </Button>
              </div>
              <div className="mt-3">
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span>Progress</span>
                  <span>{calculatedProgressPercentage}%</span>
                </div>
                <Progress 
                  value={calculatedProgressPercentage} 
                  className="h-2 bg-slate-800/60 rounded-full border border-slate-600/50" 
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8 flex-1 flex flex-col">
              {/* Question Text */}
              <div dir="ltr" className="text-left">
                <h3 className="text-2xl font-bold text-white">{currentQuestion.text}</h3>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1" dir="ltr">
                  {answerOptions.map((answer, index) => {
                    const isSelected = selectedAnswerIndex === index;
                    const isCorrectAnswer = index === currentQuestion.correctAnswer;
                    const shouldShowCorrect = isAnswerSubmitted && isCorrectAnswer;
                    const shouldShowIncorrect = isAnswerSubmitted && isSelected && !isCorrectAnswer;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={cn(
                          "w-full p-6 h-auto rounded-xl border-2 transition-all duration-300 text-left justify-start text-wrap",
                          "bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/60",
                          isSelected && !isAnswerSubmitted && "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20",
                          shouldShowCorrect && "bg-green-600/20 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20",
                          shouldShowIncorrect && "bg-red-600/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20"
                        )}
                        onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                        disabled={isAnswerSubmitted}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-lg font-medium leading-relaxed flex-1 text-left">
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

              {/* Answer feedback and explanation section */}
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
                          <h4 className="text-xl font-bold text-green-300">Correct answer!</h4>
                          <p className="text-green-200">Well done, keep going</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8 text-red-400" />
                        <div>
                          <h4 className="text-xl font-bold text-red-300">Wrong answer</h4>
                          <p className="text-red-200">The correct answer is: {answerOptions[currentQuestion.correctAnswer]}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Explanation section */}
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
                        Hide explanation
                      </>
                    ) : (
                      <>
                        <Eye className="h-5 w-5 ml-2" />
                        Show explanation
                      </>
                    )}
                  </Button>
                  {showExplanation && (
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg text-left">
                      <h4 className="text-lg font-semibold text-slate-200 mb-3">Explanation:</h4>
                      <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-600/50">
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
                  Previous question
                </Button>

                {!isAnswerSubmitted ? (
                  <Button
                    onClick={onSubmitAnswer}
                    disabled={selectedAnswerIndex === null}
                    className={cn(
                      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg transition-all duration-300",
                      selectedAnswerIndex === null && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Submit answer
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
                    Next question
                    <ChevronRight className="h-5 w-5 mr-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl">
        <CardHeader className="pb-4 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
                <CheckCircle className="h-6 w-6 text-slate-300" />
              </div>
              <span className="font-bold text-slate-100">
                Question {currentQuestionIndex + 1} of {totalQuestions}
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
              title={isFlagged ? "Remove flag" : "Flag question"}
            >
              <Flag className={cn("h-5 w-5", isFlagged && "fill-amber-400")} />
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
              <span>Progress</span>
              <span>{calculatedProgressPercentage}%</span>
            </div>
            <Progress 
              value={calculatedProgressPercentage} 
              className="h-3 bg-slate-800/60 rounded-full border border-slate-600/50" 
              indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            />
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Question Text */}
          <div dir="ltr" className="text-left">
            <h3 className="text-2xl font-bold text-white">{currentQuestion.text}</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-4" dir="ltr">
              {answerOptions.map((answer, index) => {
                const isSelected = selectedAnswerIndex === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const shouldShowCorrect = isAnswerSubmitted && isCorrectAnswer;
                const shouldShowIncorrect = isAnswerSubmitted && isSelected && !isCorrectAnswer;
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={cn(
                      "w-full p-6 h-auto rounded-xl border-2 transition-all duration-300 text-left justify-start text-wrap",
                      "bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/60",
                      isSelected && !isAnswerSubmitted && "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20",
                      shouldShowCorrect && "bg-green-600/20 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20",
                      shouldShowIncorrect && "bg-red-600/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20"
                    )}
                    onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                    disabled={isAnswerSubmitted}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg font-medium leading-relaxed flex-1 text-left">
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

          {/* Answer feedback */}
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
                      <h4 className="text-xl font-bold text-green-300">Correct answer!</h4>
                      <p className="text-green-200">Well done, keep going</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-red-400" />
                    <div>
                      <h4 className="text-xl font-bold text-red-300">Wrong answer</h4>
                      <p className="text-red-200">The correct answer is: {answerOptions[currentQuestion.correctAnswer]}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Explanation */}
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
                    Hide explanation
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5 ml-2" />
                    Show explanation
                  </>
                )}
              </Button>
              
              {showExplanation && (
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
                  <h4 className="text-lg font-semibold text-slate-200 mb-3">Explanation:</h4>
                  <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-600/50">
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
              Previous question
            </Button>

            {!isAnswerSubmitted ? (
              <Button
                onClick={onSubmitAnswer}
                disabled={selectedAnswerIndex === null}
                className={cn(
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg transition-all duration-300",
                  selectedAnswerIndex === null && "opacity-50 cursor-not-allowed"
                )}
              >
                Submit answer
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
                Next question
                <ChevronRight className="h-5 w-5 mr-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;
