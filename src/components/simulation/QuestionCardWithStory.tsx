
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Flag, Edit, ChevronLeft, ChevronRight, MessageSquare, Trophy, AlertCircle, Lightbulb, BookOpen, BarChart3, ChevronUp, ChevronDown } from "lucide-react";
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
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
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
  answeredQuestionsCount,
  correctQuestionsCount,
  progressPercentage,
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
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  
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
            ) : (
              // Simple passage text
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-100 shadow-sm">
                <p className="text-gray-800 leading-relaxed text-lg font-medium whitespace-pre-line">
                  {currentQuestion.passageText}
                </p>
              </div>
            )}
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
                שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-200 backdrop-blur-sm text-sm font-medium px-3 py-1 border border-blue-300/20">
                {getQuestionTypeBadge()}
              </Badge>
              {localIsSaved && (
                <Badge className="bg-amber-500/10 text-amber-200 backdrop-blur-sm flex items-center gap-1 border border-amber-300/20">
                  <Flag className="h-3 w-3 fill-current" />
                  <span>נשמר</span>
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
                    alt={`תרשים לשאלה ${currentQuestionIndex + 1}`}
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
                          "w-full text-right px-6 py-5 border-2 rounded-xl text-lg transition-all duration-200 group shadow-sm hover:shadow-md",
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
                              {index + 1}
                            </div>
                            <span className={cn(
                              "flex-grow leading-relaxed text-lg font-medium text-right",
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
                </div>                {/* Hint/Tip Button - show before submitting answer */}
                {SHOW_TIPS && !isAnswerSubmitted && currentQuestion.tips && (
                  <div className="mb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTip(!showTip)}
                      className="flex items-center gap-2 text-amber-700 border-amber-300 hover:bg-amber-50"
                    >
                      <Lightbulb className="h-4 w-4" />
                      {showTip ? 'הסתר רמז' : 'הצג רמז'}
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
                              <span className="font-semibold text-amber-800 text-lg">רמז</span>
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
                      הגש תשובה
                    </Button>
                  ) : (
                    <div className="flex gap-4 w-full sm:w-auto">
                      {currentQuestion.explanation && (!examMode || showAnswersImmediately === true) && (
                        <Button 
                          variant="outline" 
                          onClick={onToggleExplanation}
                          className="flex-1 sm:flex-none border-2 font-medium text-base px-6 py-3"
                        >
                          {showExplanation ? 'הסתר הסבר' : 'הצג הסבר'}
                        </Button>
                      )}
                        <Button 
                        onClick={onNextQuestion} 
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-md font-medium text-base px-6 py-3"
                      >
                        {currentQuestionIndex < totalQuestions - 1 ? (
                          <>
                            הבא
                            <ChevronLeft className="h-5 w-5 mr-2" />
                          </>
                        ) : (
                          <>
                            סיים בחינה
                            <Trophy className="h-5 w-5 mr-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
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
                    <h4 className="font-semibold text-slate-800">הסבר מפורט</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentQuestion.explanation}
                  </p>
                  
                  {currentQuestion.explanationImage && (
                    <QuestionImage
                      src={currentQuestion.explanationImage}
                      alt="תרשים הסבר"
                      maxHeightRem={14}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>        {/* Enhanced Comprehensive Progress Bar */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
            {/* Header Section */}
            <div 
              className="cursor-pointer" 
              onClick={() => setShowProgressDetails(!showProgressDetails)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">התקדמות במבחן</h3>
                    <p className="text-sm text-gray-600">שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
                    <div className="text-xs text-gray-500">הושלם</div>
                  </div>
                  <motion.div
                    animate={{ rotate: showProgressDetails ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </motion.div>
                </div>
              </div>
              
              {/* Main Progress Bar */}
              <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Detailed Statistics */}
            <AnimatePresence>
              {showProgressDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-6"
                >
                  {/* Statistics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{answeredQuestionsCount}</div>
                          <div className="text-sm text-gray-600">שאלות שנענו</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{correctQuestionsCount}</div>
                          <div className="text-sm text-gray-600">תשובות נכונות</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-red-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">{answeredQuestionsCount - correctQuestionsCount}</div>
                          <div className="text-sm text-gray-600">תשובות שגויות</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Accuracy Percentage */}
                  {answeredQuestionsCount > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-amber-500" />
                          <span className="font-semibold text-gray-700">אחוז הצלחה</span>
                        </div>
                        <span className={cn(
                          "text-2xl font-bold",
                          (correctQuestionsCount / answeredQuestionsCount) * 100 >= 60 
                            ? "text-green-600" 
                            : "text-red-600"
                        )}>
                          {Math.round((correctQuestionsCount / answeredQuestionsCount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={cn(
                            "h-3 rounded-full transition-all duration-500",
                            (correctQuestionsCount / answeredQuestionsCount) * 100 >= 60
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : "bg-gradient-to-r from-red-400 to-red-600"
                          )}
                          style={{ width: `${(correctQuestionsCount / answeredQuestionsCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Remaining Questions */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                        <span className="font-semibold text-gray-700">שאלות נותרות</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-600">{totalQuestions - (currentQuestionIndex + 1)}</div>
                        <div className="text-xs text-gray-500">שאלות</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuestionCardWithStory;
