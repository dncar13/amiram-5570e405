import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, HelpCircle, ArrowLeft, ArrowRight, Flag, Eye, EyeOff, BookOpen } from "lucide-react";
import { Question } from "@/data/questionsData";
import { QuestionImage } from "@/components/common/QuestionImage";
import { ReadingPassage } from "@/components/simulation/ReadingPassage";
import { cn } from "@/lib/utils";

interface UnifiedQuestionCardProps {
  currentQuestion: Question | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  isFlagged: boolean;
  examMode?: boolean;
  showAnswersImmediately?: boolean;
  answeredQuestionsCount?: number;
  correctQuestionsCount?: number;
  progressPercentage?: number;
  remainingTime?: number;
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
  onEditQuestion?: (question: Question) => void;
  variant?: 'simulation' | 'practice';
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
  answeredQuestionsCount,
  correctQuestionsCount,
  progressPercentage,
  remainingTime,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleQuestionFlag,
  onEditQuestion,
  variant = 'simulation'
}: UnifiedQuestionCardProps) => {
  const questionCardRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine if explanations should be shown based only on props
  // This removes the global pathname check and makes the component purely prop-driven
  const shouldShowExplanations = showAnswersImmediately && !examMode;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const answerOptions = currentQuestion?.options || currentQuestion?.answers || [];
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentQuestionIndex > 0) onPreviousQuestion();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (isAnswerSubmitted && currentQuestionIndex < totalQuestions - 1) onNextQuestion();
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

  // Smooth transitions between questions
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

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
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center text-slate-400">Error loading question - no answers found</div>
        </CardContent>
      </Card>
    );
  }

  const calculatedProgressPercentage = progressPercentage || Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  const isCorrect = isAnswerSubmitted && selectedAnswerIndex === currentQuestion.correctAnswer;
  const isIncorrect = isAnswerSubmitted && selectedAnswerIndex !== null && selectedAnswerIndex !== currentQuestion.correctAnswer;

  const hasReadingPassage = currentQuestion.type === 'reading-comprehension' && 
    (currentQuestion.passageText || (currentQuestion.passageWithLines && currentQuestion.passageWithLines.length > 0));

  // Enhanced progress stats
  const currentScorePercentage = answeredQuestionsCount && correctQuestionsCount 
    ? Math.round((correctQuestionsCount / answeredQuestionsCount) * 100)
    : 0;

  const renderProgressStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-400">{calculatedProgressPercentage}%</div>
        <div className="text-sm text-slate-400">Progress</div>
      </div>
      {answeredQuestionsCount !== undefined && (
        <>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{currentScorePercentage}%</div>
            <div className="text-sm text-slate-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{answeredQuestionsCount}/{totalQuestions}</div>
            <div className="text-sm text-slate-400">Answered</div>
          </div>
        </>
      )}
    </div>
  );

  if (hasReadingPassage) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-100px)]">
        {/* Reading Passage */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl h-full">
          <CardHeader className="pb-3 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
            <CardTitle className="text-lg font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {currentQuestion.passageTitle || 'Reading Passage'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-auto h-full">
            <div dir="ltr" className="text-left h-full">
              <ReadingPassage 
                passageWithLines={currentQuestion.passageWithLines}
                passageText={currentQuestion.passageText}
                showLineNumbers={currentQuestion.lineNumbers}
              />
            </div>
          </CardContent>
        </Card>

        {/* Question Area */}
        <div className="flex flex-col h-full">
          <Card className={cn(
            "bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl h-full flex flex-col transition-all duration-300",
            isAnimating && "scale-[0.98] opacity-80"
          )}>
            <CardHeader className="pb-3 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
                    <CheckCircle className="h-6 w-6 text-slate-300" />
                  </div>
                  <span className="font-bold text-slate-100">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  {remainingTime !== undefined && (
                    <div className={cn(
                      "px-3 py-1 rounded-lg text-sm font-medium",
                      remainingTime < 10 ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"
                    )}>
                      {remainingTime}s
                    </div>
                  )}
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
                  >
                    <Flag className={cn("h-5 w-5", isFlagged && "fill-amber-400")} />
                  </Button>
                </div>
              </div>
              
              {renderProgressStats()}
              
              <Progress 
                value={calculatedProgressPercentage} 
                className="h-3 bg-slate-800/60 rounded-full border border-slate-600/50" 
                indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              />
            </CardHeader>

            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <div dir="ltr" className="text-left">
                <h3 className="text-xl font-bold text-white leading-relaxed">{currentQuestion.text}</h3>
              </div>
              
              {currentQuestion.image && (
                <QuestionImage 
                  src={currentQuestion.image} 
                  alt={`Question ${currentQuestionIndex + 1} diagram`}
                  maxHeightRem={12}
                />
              )}

              <div className="space-y-3 flex-1" dir="ltr">
                {answerOptions.map((answer, index) => {
                  const isSelected = selectedAnswerIndex === index;
                  const isCorrectAnswer = index === currentQuestion.correctAnswer;
                  const shouldShowCorrect = isAnswerSubmitted && isCorrectAnswer && shouldShowExplanations;
                  const shouldShowIncorrect = isAnswerSubmitted && isSelected && !isCorrectAnswer && shouldShowExplanations;
                  
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "w-full p-4 h-auto rounded-xl border-2 transition-all duration-300 text-left justify-start text-wrap transform",
                        "bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/60",
                        isSelected && !isAnswerSubmitted && "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20 scale-[1.02]",
                        shouldShowCorrect && "bg-green-600/20 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20",
                        shouldShowIncorrect && "bg-red-600/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20",
                        !isAnswerSubmitted && "hover:scale-[1.01]"
                      )}
                      onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                      disabled={isAnswerSubmitted}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-base font-medium leading-relaxed flex-1 text-left">
                          {answer}
                        </span>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="bg-slate-700/80 text-slate-300 px-3 py-1 rounded-lg text-sm font-bold border border-slate-600/50">
                            {index + 1}
                          </span>
                          {shouldShowCorrect && <CheckCircle className="h-5 w-5 text-green-400" />}
                          {shouldShowIncorrect && <XCircle className="h-5 w-5 text-red-400" />}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Enhanced answer feedback - only if explanations should be shown */}
              {isAnswerSubmitted && shouldShowExplanations && (
                <div className={cn(
                  "rounded-xl p-5 border-2 shadow-xl backdrop-blur-sm animate-fade-in",
                  isCorrect 
                    ? "bg-green-600/10 border-green-500/30 shadow-green-500/10" 
                    : "bg-red-600/10 border-red-500/30 shadow-red-500/10"
                )}>
                  <div className="flex items-center gap-4 mb-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                        <div>
                          <h4 className="text-xl font-bold text-green-300">Excellent!</h4>
                          <p className="text-green-200">You got it right! Keep going strong.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8 text-red-400" />
                        <div>
                          <h4 className="text-xl font-bold text-red-300">Not quite right</h4>
                          <p className="text-red-200">The correct answer is: <span className="font-semibold">{answerOptions[currentQuestion.correctAnswer]}</span></p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Explanation section - only if explanations should be shown */}
              {isAnswerSubmitted && currentQuestion.explanation && shouldShowExplanations && (
                <div className="space-y-3">
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
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-600/50 shadow-lg animate-fade-in">
                      <h4 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Explanation:
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            {/* Enhanced navigation */}
            <CardFooter className="pt-4 pb-6 border-t border-slate-600/50">
              <div className="flex justify-between items-center w-full gap-4">
                <Button
                  variant="outline"
                  onClick={onPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={cn(
                    "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 rounded-xl px-6 py-3 transition-all",
                    currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ArrowLeft className="h-5 w-5 ml-2" />
                  Previous
                </Button>

                {!isAnswerSubmitted ? (
                  <Button
                    onClick={onSubmitAnswer}
                    disabled={selectedAnswerIndex === null}
                    className={cn(
                      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 transform",
                      selectedAnswerIndex === null ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    )}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={onNextQuestion}
                    className={cn(
                      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 transform hover:scale-105"
                    )}
                  >
                    {currentQuestionIndex >= totalQuestions - 1 ? 'Finish' : 'Next Question'}
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Regular question layout (non-reading comprehension)
  return (
    <Card ref={questionCardRef} className={cn(
      "bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 rounded-2xl transition-all duration-300 max-w-4xl mx-auto",
      isAnimating && "scale-[0.98] opacity-80",
      variant === 'practice' && "border-t-4 border-t-electric-blue bg-white shadow-lg"
    )}>
      <CardHeader className={cn(
        "pb-4 border-b border-slate-600/50 rounded-t-2xl",
        variant === 'simulation' 
          ? "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white" 
          : "bg-electric-blue/8"
      )}>
        <div className="flex justify-between items-center">
          <CardTitle className={cn(
            "text-xl flex items-center gap-3",
            variant === 'simulation' ? "text-slate-100" : "text-electric-navy"
          )}>
            <div className={cn(
              "p-2 rounded-lg border",
              variant === 'simulation' 
                ? "bg-slate-800/60 border-slate-600/50" 
                : "bg-electric-blue text-white"
            )}>
              <CheckCircle className="h-6 w-6" />
            </div>
            <span className="font-bold">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {remainingTime !== undefined && (
              <div className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium",
                remainingTime < 10 ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"
              )}>
                {remainingTime}s
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-10 w-10 rounded-lg border transition-all duration-300",
                isFlagged 
                  ? "bg-amber-600/20 border-amber-500/50 text-amber-400 hover:bg-amber-600/30" 
                  : variant === 'simulation'
                    ? "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60"
                    : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-yellow-50"
              )}
              onClick={onToggleQuestionFlag}
            >
              <Flag className={cn("h-5 w-5", isFlagged && "fill-amber-400")} />
            </Button>
          </div>
        </div>

        {renderProgressStats()}
        
        <Progress 
          value={calculatedProgressPercentage} 
          className={cn(
            "h-3 rounded-full border",
            variant === 'simulation' 
              ? "bg-slate-800/60 border-slate-600/50" 
              : "bg-gray-200"
          )}
          indicatorClassName={cn(
            "rounded-full transition-all duration-500",
            variant === 'simulation' 
              ? "bg-gradient-to-r from-blue-500 to-blue-600" 
              : "bg-electric-blue"
          )}
        />
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className={variant === 'practice' ? 'text-right' : 'text-left'}>
          <h3 className={cn(
            "text-xl font-bold leading-relaxed",
            variant === 'simulation' ? "text-white" : "text-electric-navy"
          )}>
            {currentQuestion.text}
          </h3>
        </div>
        
        {currentQuestion.image && (
          <QuestionImage 
            src={currentQuestion.image} 
            alt={`Question ${currentQuestionIndex + 1} diagram`}
            maxHeightRem={15}
          />
        )}

        <div className={cn("space-y-3", variant === 'practice' ? 'text-right' : 'text-left')}>
          {answerOptions.map((answer, index) => {
            const isSelected = selectedAnswerIndex === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswer;
            const shouldShowCorrect = isAnswerSubmitted && isCorrectAnswer && shouldShowExplanations;
            const shouldShowIncorrect = isAnswerSubmitted && isSelected && !isCorrectAnswer && shouldShowExplanations;
            
            return (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "w-full p-4 h-auto rounded-xl border-2 transition-all duration-300 justify-start text-wrap transform",
                  variant === 'simulation' 
                    ? "bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/60"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                  isSelected && !isAnswerSubmitted && (
                    variant === 'simulation' 
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20"
                      : "bg-electric-blue/10 border-electric-blue text-electric-blue"
                  ),
                  shouldShowCorrect && "bg-green-600/20 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20",
                  shouldShowIncorrect && "bg-red-600/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20",
                  !isAnswerSubmitted && "hover:scale-[1.01]"
                )}
                onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                disabled={isAnswerSubmitted}
              >
                <div className={cn(
                  "flex items-center w-full gap-3",
                  variant === 'practice' ? 'flex-row-reverse' : 'flex-row'
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold",
                    shouldShowCorrect && "bg-green-500 text-white border-green-500",
                    shouldShowIncorrect && "bg-red-500 text-white border-red-500",
                    isSelected && !isAnswerSubmitted && (
                      variant === 'simulation' ? "bg-blue-500 text-white border-blue-500" : "bg-electric-blue text-white border-electric-blue"
                    ),
                    !isSelected && !shouldShowCorrect && !shouldShowIncorrect && (
                      variant === 'simulation' ? "bg-slate-700/80 border-slate-600/50 text-slate-300" : "bg-gray-100 border-gray-300 text-gray-600"
                    )
                  )}>
                    {shouldShowCorrect ? <CheckCircle className="h-4 w-4" /> : 
                     shouldShowIncorrect ? <XCircle className="h-4 w-4" /> : 
                     index + 1}
                  </div>
                  <span className={cn(
                    "text-base font-medium leading-relaxed flex-1",
                    variant === 'practice' ? 'text-right' : 'text-left'
                  )}>
                    {answer}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Enhanced answer feedback - only if explanations should be shown */}
        {isAnswerSubmitted && shouldShowExplanations && (
          <div className={cn(
            "rounded-xl p-5 border-2 shadow-xl backdrop-blur-sm animate-fade-in",
            isCorrect 
              ? "bg-green-600/10 border-green-500/30 shadow-green-500/10" 
              : "bg-red-600/10 border-red-500/30 shadow-red-500/10"
          )}>
            <div className="flex items-center gap-4">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <div>
                    <h4 className="text-xl font-bold text-green-300">Excellent!</h4>
                    <p className="text-green-200">You got it right! Keep going strong.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-red-400" />
                  <div>
                    <h4 className="text-xl font-bold text-red-300">Not quite right</h4>
                    <p className="text-red-200">The correct answer is: <span className="font-semibold">{answerOptions[currentQuestion.correctAnswer]}</span></p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Explanation section - only if explanations should be shown */}
        {isAnswerSubmitted && currentQuestion.explanation && shouldShowExplanations && (
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={onToggleExplanation}
              className={cn(
                "rounded-xl transition-colors",
                variant === 'simulation'
                  ? "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
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
              <div className={cn(
                "backdrop-blur-sm rounded-xl p-5 border shadow-lg animate-fade-in",
                variant === 'simulation'
                  ? "bg-slate-800/60 border-slate-600/50"
                  : "bg-blue-50 border-blue-200"
              )}>
                <h4 className={cn(
                  "text-lg font-semibold mb-3 flex items-center gap-2",
                  variant === 'simulation' ? "text-slate-200" : "text-electric-navy"
                )}>
                  <HelpCircle className="h-5 w-5" />
                  Explanation:
                </h4>
                <div className={cn(
                  "leading-relaxed prose prose-sm max-w-none",
                  variant === 'simulation' ? "text-slate-300" : "text-electric-slate"
                )} 
                dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className={cn(
        "pt-4 pb-6 border-t",
        variant === 'simulation' ? "border-slate-600/50" : "border-gray-200"
      )}>
        <div className="flex justify-between items-center w-full gap-4">
          <Button
            variant="outline"
            onClick={onPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "rounded-xl px-6 py-3 transition-all",
              variant === 'simulation'
                ? "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
              currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ArrowLeft className="h-5 w-5 ml-2" />
            Previous
          </Button>

          {!isAnswerSubmitted ? (
            <Button
              onClick={onSubmitAnswer}
              disabled={selectedAnswerIndex === null}
              className={cn(
                "font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 transform",
                variant === 'simulation'
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  : "bg-electric-blue hover:bg-blue-600 text-white",
                selectedAnswerIndex === null ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              )}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={onNextQuestion}
              className={cn(
                "font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 transform hover:scale-105",
                variant === 'simulation'
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  : "bg-electric-blue hover:bg-blue-600 text-white"
              )}
            >
              {currentQuestionIndex >= totalQuestions - 1 ? 'Finish' : 'Next Question'}
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UnifiedQuestionCard;
