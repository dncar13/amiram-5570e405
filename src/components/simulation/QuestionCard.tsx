import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Flag, Edit, ChevronLeft, ChevronRight, MessageSquare, Trophy, AlertCircle, Lightbulb } from "lucide-react";
import { Question } from "@/data/questionsData";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { useEffect, useState } from "react";
import { QuestionImage } from "@/components/common/QuestionImage";

interface QuestionCardProps {
  currentQuestion: Question | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  isFlagged: boolean;
  examMode?: boolean;
  showAnswersImmediately?: boolean;
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
  onEditQuestion?: (question: Question) => void;
}

const QuestionCard = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswerIndex,
  isAnswerSubmitted,
  showExplanation,
  isFlagged,
  examMode = false,
  showAnswersImmediately = true,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleQuestionFlag,
  onEditQuestion
}: QuestionCardProps) => {
  const { isAdmin, isPremium } = useAuth();
  const { isQuestionSaved, saveQuestion, removeQuestionById } = useSavedQuestions();
  const [localIsSaved, setLocalIsSaved] = useState(false);
  const [showTip, setShowTip] = useState(false);
  
  // Control tips display - set to false to hide all tips
  const SHOW_TIPS = false;
  
  useEffect(() => {
    if (currentQuestion) {
      setLocalIsSaved(isQuestionSaved(currentQuestion.id));
    }
  }, [currentQuestion, isQuestionSaved]);
  
  const handleSaveStatusChange = () => {
    if (!currentQuestion) return;
    
    if (localIsSaved) {
      removeQuestionById(currentQuestion.id);
      onToggleQuestionFlag();
    } else {
      saveQuestion(currentQuestion);
      onToggleQuestionFlag();
    }
    setLocalIsSaved(!localIsSaved);
  };

  // If no question is available, show a message
  if (!currentQuestion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 p-6 rounded-t-xl border-b border-slate-600/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Badge className="bg-slate-800/60 text-slate-200 backdrop-blur-sm text-base font-medium px-4 py-2 border border-slate-600/50 shadow-lg">
                  שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8 text-amber-400">
              <AlertCircle className="h-8 w-8" />
              <h3 className="text-2xl font-bold text-slate-100 leading-relaxed">
                לא נמצאה שאלה
              </h3>
            </div>
            
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              מצטערים, לא נמצאה שאלה לתצוגה. ייתכן שאין שאלות בקבוצת שאלות זו או שאירעה שגיאה בטעינת השאלות.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-between">
              <Button 
                onClick={onNextQuestion} 
                className="flex-1 sm:flex-none bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white shadow-lg border border-slate-600/50 text-lg py-3"
              >
                חזרה לרשימת השאלות
                <ChevronLeft className="h-5 w-5 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const isCorrect = isAnswerSubmitted && selectedAnswerIndex === currentQuestion.correctAnswer;
  const isIncorrect = isAnswerSubmitted && selectedAnswerIndex !== currentQuestion.correctAnswer && selectedAnswerIndex !== null;
  const showCorrectAnswer = isAnswerSubmitted && (showAnswersImmediately || !examMode);

  // Get question type badge - using the 'type' property instead of 'questionType'
  const getQuestionTypeBadge = () => {
    switch (currentQuestion.type) {
      case 'reading-comprehension':
        return 'Reading Comprehension';
      case 'sentence-completion':
        return 'Sentence Completion';
      case 'restatement':
        return 'Restatement';
      default:
        return 'Question';
    }
  };

  // Render the reading passage for reading comprehension questions
  const renderReadingPassage = () => {
    if (!currentQuestion.passageWithLines || currentQuestion.passageWithLines.length === 0) {
      return null;
    }

    return (
      <div className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-8 overflow-y-auto max-h-[600px] shadow-2xl">
        <h4 className="text-2xl font-bold mb-6 text-slate-200 flex items-center gap-4">
          <div className="bg-slate-700/60 p-2 rounded-lg border border-slate-600/50">
            <MessageSquare className="h-6 w-6 text-slate-300" />
          </div>
          {currentQuestion.passageTitle || "Reading Passage"}
        </h4>
        
        <div className="space-y-6">
          {currentQuestion.passageWithLines.map((line) => (
            <div key={line.lineNumber} className="flex gap-4">
              {currentQuestion.lineNumbers && (
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-sm text-slate-400 font-mono bg-slate-700/40 px-3 py-2 rounded-lg border border-slate-600/30">
                    {line.startLine}-{line.endLine}
                  </span>
                </div>
              )}
              <p className="text-slate-200 leading-relaxed text-xl flex-1">
                {line.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl ml-0"
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 p-6 rounded-t-xl border-b border-slate-600/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge className="bg-slate-800/60 text-slate-200 backdrop-blur-sm text-base font-medium px-4 py-2 border border-slate-600/50 shadow-lg">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Badge>
              <Badge className="bg-slate-800/60 text-slate-200 backdrop-blur-sm text-base font-medium px-4 py-2 border border-slate-600/50 shadow-lg">
                {getQuestionTypeBadge()}
              </Badge>
              {localIsSaved && (
                <Badge className="bg-amber-500/20 text-amber-300 backdrop-blur-sm flex items-center gap-2 border border-amber-400/30 px-4 py-2 shadow-lg">
                  <Flag className="h-4 w-4 fill-current" />
                  <span>Saved</span>
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 border border-slate-600/50",
                  localIsSaved && "text-amber-400 hover:text-amber-300"
                )}
                onClick={handleSaveStatusChange}
              >
                <Flag className={cn("h-5 w-5", localIsSaved && "fill-current")} />
              </Button>
              
              {isAdmin && onEditQuestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hidden md:flex border border-slate-600/50"
                  onClick={() => onEditQuestion(currentQuestion)}
                >
                  <Edit className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          {/* Reading Comprehension Layout - Professional side-by-side */}
          {currentQuestion.type === 'reading-comprehension' && 
           currentQuestion.passageWithLines && 
           currentQuestion.passageWithLines.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[600px]">
              {/* Right side - Reading Passage */}
              <div className="order-2 lg:order-1">
                {renderReadingPassage()}
              </div>

              {/* Left side - Question and Options */}
              <div className="order-1 lg:order-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-8 text-slate-100 leading-relaxed">
                    {currentQuestion.text}
                  </h3>
                  
                  {currentQuestion.image && (
                    <QuestionImage 
                      src={currentQuestion.image} 
                      alt={`Diagram for question ${currentQuestionIndex + 1}`}
                      maxHeightRem={12}
                    />
                  )}
                  
                  <div className="space-y-5 mb-8">
                    {currentQuestion.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <button 
                          className={cn(
                            "w-full text-right px-6 py-5 border-2 rounded-xl text-xl transition-all duration-200 group shadow-lg hover:shadow-xl",
                            selectedAnswerIndex === index 
                              ? "border-slate-500 bg-slate-700/60" 
                              : "border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-700/40 bg-slate-800/40",
                            isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                              "border-green-500 bg-green-500/20",
                            isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                              "border-red-500 bg-red-500/20",
                            isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                              selectedAnswerIndex !== index && "border-green-500 bg-green-500/20"
                          )}
                          onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                          disabled={isAnswerSubmitted}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "flex-grow leading-relaxed text-slate-200",
                              isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && "text-green-300 font-medium",
                              isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && "text-red-300",
                              isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && "text-green-300 font-medium"
                            )}>
                              {option}
                            </span>
                            
                            {isAnswerSubmitted && showCorrectAnswer && (
                              <div className="flex-shrink-0 ml-5">
                                {selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && (
                                  <CheckCircle className="h-7 w-7 text-green-400" />
                                )}
                                {selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && (
                                  <XCircle className="h-7 w-7 text-red-400" />
                                )}
                                {index === currentQuestion.correctAnswer && selectedAnswerIndex !== index && (
                                  <CheckCircle className="h-7 w-7 text-green-400" />
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Hint/Tip Button - show before submitting answer */}
                  {SHOW_TIPS && !isAnswerSubmitted && currentQuestion.tips && (
                    <div className="mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTip(!showTip)}
                        className="flex items-center gap-2 text-amber-700 border-amber-300 hover:bg-amber-50"
                      >
                        <Lightbulb className="h-4 w-4" />
                        {showTip ? 'Hide Hint' : 'Show Hint'}
                      </Button>
                      
                      <AnimatePresence>
                        {showTip && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-3"
                          >
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="h-4 w-4 text-amber-600" />
                                <span className="font-medium text-amber-800">Hint</span>
                              </div>
                              <p className="text-amber-700 text-sm leading-relaxed">
                                {currentQuestion.tips}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Submit/Navigation buttons at bottom */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-end">
                  {!isAnswerSubmitted ? (
                    <Button 
                      onClick={onSubmitAnswer} 
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl font-bold text-xl px-10 py-4 border border-emerald-500/50"
                      disabled={selectedAnswerIndex === null}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <div className="flex gap-4 w-full sm:w-auto">
                      {currentQuestion.explanation && (!examMode || showAnswersImmediately === true) && (
                        <Button 
                          variant="outline" 
                          onClick={onToggleExplanation}
                          className="flex-1 sm:flex-none border-2 border-slate-600/50 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 hover:text-slate-100 text-lg py-3"
                        >
                          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                        </Button>
                      )}
                      
                      <Button 
                        onClick={onNextQuestion} 
                        className="flex-1 sm:flex-none bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white shadow-xl border border-slate-500/50 text-lg py-3"
                      >
                        {currentQuestionIndex < totalQuestions - 1 ? (
                          <>
                            Next
                            <ChevronLeft className="h-6 w-6 ml-2" />
                          </>
                        ) : (
                          <>
                            Finish Test
                            <Trophy className="h-6 w-6 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Standard question layout for non-reading comprehension */
            <div className="bg-slate-800/60 rounded-xl p-8 border border-slate-600/50 shadow-lg">
              <h3 className="text-2xl font-bold mb-8 text-slate-100 leading-relaxed">
                {currentQuestion.text}
              </h3>
              
              {currentQuestion.image && (
                <QuestionImage 
                  src={currentQuestion.image} 
                  alt={`Diagram for question ${currentQuestionIndex + 1}`}
                  maxHeightRem={16}
                />
              )}
              
              <div className="space-y-4 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div 
                      className={cn(
                        "relative border-2 rounded-xl p-6 transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-xl",
                        selectedAnswerIndex === index 
                          ? "border-slate-500 bg-slate-700/60" 
                          : "border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-700/40 bg-slate-800/40",
                        isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                          "border-green-500 bg-green-500/20",
                        isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                          "border-red-500 bg-red-500/20",
                        isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                          selectedAnswerIndex !== index && "border-green-500 bg-green-500/20"
                      )}
                      onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                    >
                      <div className="flex items-start gap-5">
                        <div className={cn(
                          "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                          selectedAnswerIndex === index 
                            ? "bg-slate-600 border-slate-500 text-slate-100" 
                            : "border-slate-500/70 bg-slate-800/60 text-slate-300 group-hover:border-slate-400",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                            "bg-green-500 border-green-500 text-white",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                            "bg-red-500 border-red-500 text-white",
                          isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                            "bg-green-500 border-green-500 text-white"
                        )}>
                          <span className="font-bold text-xl">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <span className={cn(
                          "flex-grow leading-relaxed transition-colors duration-200 text-xl",
                          selectedAnswerIndex === index ? "text-slate-100 font-medium" : "text-slate-200",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && "text-green-300 font-medium",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && "text-red-300",
                          isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && "text-green-300 font-medium"
                        )}>
                          {option}
                        </span>
                      </div>
                      
                      {isAnswerSubmitted && showCorrectAnswer && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                          {selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-7 w-7 text-green-400" />
                          )}
                          {selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && (
                            <XCircle className="h-7 w-7 text-red-400" />
                          )}
                          {index === currentQuestion.correctAnswer && selectedAnswerIndex !== index && (
                            <CheckCircle className="h-7 w-7 text-green-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Hint/Tip Button for standard questions */}
              {SHOW_TIPS && !isAnswerSubmitted && currentQuestion.tips && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTip(!showTip)}
                    className="flex items-center gap-2 text-amber-700 border-amber-300 hover:bg-amber-50"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {showTip ? 'Hide Hint' : 'Show Hint'}
                  </Button>
                  
                  <AnimatePresence>
                    {showTip && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-3"
                      >
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-amber-600" />
                            <span className="font-medium text-amber-800">Hint</span>
                          </div>
                          <p className="text-amber-700 text-sm leading-relaxed">
                            {currentQuestion.tips}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-3">
                  {currentQuestionIndex > 0 && (
                    <Button 
                      onClick={onPreviousQuestion} 
                      variant="outline"
                      className="flex-1 sm:flex-none border-2 border-slate-600/50 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 hover:text-slate-100 text-lg py-3"
                      disabled={examMode && !isAnswerSubmitted}
                    >
                      <ChevronRight className="h-5 w-5 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {isAnswerSubmitted && (
                    <Button 
                      onClick={onNextQuestion} 
                      className="flex-1 sm:flex-none bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white shadow-xl border border-slate-500/50 text-lg py-3"
                    >
                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <>
                          Next
                          <ChevronLeft className="h-5 w-5 ml-2" />
                        </>
                      ) : (
                        <>
                          Finish Test
                          <Trophy className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {!isAnswerSubmitted ? (
                    <Button 
                      onClick={onSubmitAnswer} 
                      className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl font-bold text-xl px-8 py-4 border border-emerald-500/50"
                      disabled={selectedAnswerIndex === null}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    currentQuestion.explanation && (!examMode || showAnswersImmediately === true) && (
                      <Button 
                        variant="outline" 
                        onClick={onToggleExplanation}
                        className="flex-1 sm:flex-none border-2 border-slate-600/50 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 hover:text-slate-100 text-lg py-3"
                      >
                        {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {(isAnswerSubmitted && currentQuestion.explanation && showAnswersImmediately && showExplanation) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-8"
              >
                <div className="p-8 bg-slate-800/60 border border-slate-600/50 rounded-xl shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-slate-700 p-3 rounded-lg border border-slate-600/50">
                      <MessageSquare className="h-6 w-6 text-slate-300" />
                    </div>
                    <h4 className="font-bold text-slate-200 text-xl">Detailed Explanation</h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                    {currentQuestion.explanation}
                  </p>
                  
                  {currentQuestion.explanationImage && (
                    <QuestionImage
                      src={currentQuestion.explanationImage}
                      alt="Explanation diagram"
                      maxHeightRem={14}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
