
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Flag, Edit, ChevronLeft, ChevronRight, MessageSquare, Trophy, AlertCircle, Lightbulb, BookOpen } from "lucide-react";
import { Question } from "@/data/questionsData";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { useEffect, useState } from "react";
import { QuestionImage } from "@/components/common/QuestionImage";

interface QuestionCardWithStoryProps {
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

const QuestionCardWithStory = ({
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
}: QuestionCardWithStoryProps) => {
  const { isAdmin, isPremium } = useAuth();
  const { isQuestionSaved, saveQuestion, removeQuestionById } = useSavedQuestions();
  const [localIsSaved, setLocalIsSaved] = useState(false);
  const [showTip, setShowTip] = useState(false);
  
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
        <Card className="border-0 shadow-lg bg-white">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/10 text-white backdrop-blur-sm text-sm font-medium px-3 py-1 border border-white/20">
                  שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6 text-amber-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                לא נמצאה שאלה
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              מצטערים, לא נמצאה שאלה לתצוגה. ייתכן שאין שאלות בקבוצת שאלות זו או שאירעה שגיאה בטעינת השאלות.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between">
              <Button 
                onClick={onNextQuestion} 
                className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white shadow-md"
              >
                חזרה לרשימת השאלות
                <ChevronLeft className="h-4 w-4 mr-1" />
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

  // Get question type badge
  const getQuestionTypeBadge = () => {
    switch (currentQuestion.questionType) {
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

  // Check if this question has a reading passage (story)
  const hasReadingPassage = () => {
    return (currentQuestion.passageWithLines && currentQuestion.passageWithLines.length > 0) ||
           (currentQuestion.passageTitle || currentQuestion.passageText);
  };

  // Render the reading passage for reading comprehension questions
  const renderReadingPassage = () => {
    if (!hasReadingPassage()) {
      return null;
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-xl">
          <h4 className="text-xl font-bold text-white flex items-center gap-3">
            <BookOpen className="h-6 w-6" />
            {currentQuestion.passageTitle || "Reading Passage"}
          </h4>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-5">
            {currentQuestion.passageWithLines && currentQuestion.passageWithLines.length > 0 ? (
              // Structured passage with line numbers
              currentQuestion.passageWithLines.map((line) => (
                <div key={line.lineNumber} className="flex gap-4 group">
                  {currentQuestion.lineNumbers && (
                    <div className="flex-shrink-0 w-16 text-center">
                      <span className="inline-block text-sm text-blue-700 font-mono bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm">
                        {line.startLine}-{line.endLine}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <p className="text-gray-800 leading-relaxed text-lg font-medium">
                      {line.text}
                    </p>
                  </div>
                </div>
              ))
            ) : currentQuestion.passageText ? (
              // Simple passage text
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-100 shadow-sm">
                <p className="text-gray-800 leading-relaxed text-lg font-medium whitespace-pre-line">
                  {currentQuestion.passageText}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      <Card className="border-0 shadow-lg bg-white">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge className="bg-white/10 text-white backdrop-blur-sm text-sm font-medium px-3 py-1 border border-white/20">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-200 backdrop-blur-sm text-sm font-medium px-3 py-1 border border-blue-300/20">
                {getQuestionTypeBadge()}
              </Badge>
              {localIsSaved && (
                <Badge className="bg-amber-500/10 text-amber-200 backdrop-blur-sm flex items-center gap-1 border border-amber-300/20">
                  <Flag className="h-3 w-3 fill-current" />
                  <span>Saved</span>
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={handleSaveStatusChange}
              >
                <Flag className={cn("h-4 w-4", localIsSaved && "fill-current")} />
              </Button>
              
              {isAdmin && onEditQuestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 hidden md:flex"
                  onClick={() => onEditQuestion(currentQuestion)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Reading Comprehension Layout - Professional side-by-side */}
          {hasReadingPassage() ? (
            <div className="space-y-8">
              {/* Reading Passage - Always visible and prominent */}
              <div className="w-full">
                {renderReadingPassage()}
              </div>

              {/* Question and Options */}
              <div className="w-full">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 leading-relaxed">
                    {currentQuestion.text}
                  </h3>
                  
                  {currentQuestion.image && (
                    <QuestionImage 
                      src={currentQuestion.image} 
                      alt={`Diagram for question ${currentQuestionIndex + 1}`}
                      maxHeightRem={12}
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
                        <button 
                          className={cn(
                            "w-full text-left px-6 py-5 border-2 rounded-xl text-lg transition-all duration-200 group shadow-sm hover:shadow-md",
                            selectedAnswerIndex === index 
                              ? "border-blue-500 bg-blue-50 shadow-md" 
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white",
                            isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                              "border-green-500 bg-green-50 shadow-md",
                            isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                              "border-red-500 bg-red-50 shadow-md",
                            isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                              selectedAnswerIndex !== index && "border-green-500 bg-green-50 shadow-md"
                          )}
                          onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                          disabled={isAnswerSubmitted}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 font-bold text-lg",
                                selectedAnswerIndex === index 
                                  ? "bg-blue-500 border-blue-500 text-white" 
                                  : "border-gray-300 bg-white text-gray-600 group-hover:border-gray-400",
                                isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                                  "bg-green-500 border-green-500 text-white",
                                isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                                  "bg-red-500 border-red-500 text-white",
                                isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                                  "bg-green-500 border-green-500 text-white"
                              )}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className={cn(
                                "flex-grow leading-relaxed text-lg font-medium",
                                isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && "text-green-700",
                                isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && "text-red-700",
                                isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && "text-green-700"
                              )}>
                                {option}
                              </span>
                            </div>
                            
                            {isAnswerSubmitted && showCorrectAnswer && (
                              <div className="flex-shrink-0 ml-4">
                                {selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && (
                                  <CheckCircle className="h-7 w-7 text-green-600" />
                                )}
                                {selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && (
                                  <XCircle className="h-7 w-7 text-red-600" />
                                )}
                                {index === currentQuestion.correctAnswer && selectedAnswerIndex !== index && (
                                  <CheckCircle className="h-7 w-7 text-green-600" />
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Hint/Tip Button - show before submitting answer */}
                  {!isAnswerSubmitted && currentQuestion.tips && (
                    <div className="mb-6">
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
                            className="overflow-hidden mt-4"
                          >
                            <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="h-5 w-5 text-amber-600" />
                                <span className="font-semibold text-amber-800 text-lg">Hint</span>
                              </div>
                              <p className="text-amber-700 leading-relaxed text-base">
                                {currentQuestion.tips}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Submit/Navigation buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    {!isAnswerSubmitted ? (
                      <Button 
                        onClick={onSubmitAnswer} 
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold text-lg px-10 py-4"
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
                            className="flex-1 sm:flex-none border-2 font-medium text-base px-6 py-3"
                          >
                            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                          </Button>
                        )}
                        
                        <Button 
                          onClick={onNextQuestion} 
                          className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white shadow-md font-medium text-base px-6 py-3"
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard question layout for non-reading comprehension */
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800 leading-relaxed">
                {currentQuestion.text}
              </h3>
              
              {currentQuestion.image && (
                <QuestionImage 
                  src={currentQuestion.image} 
                  alt={`Diagram for question ${currentQuestionIndex + 1}`}
                  maxHeightRem={16}
                />
              )}
              
              <div className="space-y-3 mb-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div 
                      className={cn(
                        "relative border rounded-lg p-4 transition-all duration-200 cursor-pointer group",
                        selectedAnswerIndex === index 
                          ? "border-blue-300 bg-blue-50/30" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                        isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                          "border-green-400 bg-green-50/40",
                        isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                          "border-red-400 bg-red-50/40",
                        isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                          selectedAnswerIndex !== index && "border-green-400 bg-green-50/40"
                      )}
                      onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                          selectedAnswerIndex === index 
                            ? "bg-blue-400 border-blue-400 text-white" 
                            : "border-gray-300 bg-white text-gray-600 group-hover:border-gray-400",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                            "bg-green-500 border-green-500 text-white",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                            "bg-red-500 border-red-500 text-white",
                          isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                            "bg-green-500 border-green-500 text-white"
                        )}>
                          <span className="font-semibold text-lg">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <span className={cn(
                          "flex-grow leading-relaxed transition-colors duration-200",
                          selectedAnswerIndex === index ? "text-gray-900 font-medium" : "text-gray-700",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && "text-green-700 font-medium",
                          isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && "text-red-700",
                          isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && "text-green-700 font-medium"
                        )}>
                          {option}
                        </span>
                      </div>
                      
                      {isAnswerSubmitted && showCorrectAnswer && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                          {selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                          {index === currentQuestion.correctAnswer && selectedAnswerIndex !== index && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Hint/Tip Button for standard questions */}
              {!isAnswerSubmitted && currentQuestion.tips && (
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
              
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-2">
                  {currentQuestionIndex > 0 && (
                    <Button 
                      onClick={onPreviousQuestion} 
                      variant="outline"
                      className="flex-1 sm:flex-none border hover:bg-gray-50"
                      disabled={examMode && !isAnswerSubmitted}
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  )}
                  
                  {isAnswerSubmitted && (
                    <Button 
                      onClick={onNextQuestion} 
                      className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white shadow-md"
                    >
                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <>
                          Next
                          <ChevronLeft className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Finish Test
                          <Trophy className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {!isAnswerSubmitted ? (
                    <Button 
                      onClick={onSubmitAnswer} 
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-medium text-base px-6 py-2"
                      disabled={selectedAnswerIndex === null}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    currentQuestion.explanation && (!examMode || showAnswersImmediately === true) && (
                      <Button 
                        variant="outline" 
                        onClick={onToggleExplanation}
                        className="flex-1 sm:flex-none border"
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
                className="overflow-hidden mt-6"
              >
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-slate-600 p-1.5 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800">Detailed Explanation</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
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

export default QuestionCardWithStory;
