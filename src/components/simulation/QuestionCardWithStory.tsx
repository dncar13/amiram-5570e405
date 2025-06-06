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
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  storyTitle?: string;
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
  storyTitle,
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
    console.error("QuestionCardWithStory: No current question provided");
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-white">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-t-xl">
            <div className="flex justify-start items-center">
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

  // וודא שיש טקסט שאלה - השתמש בשדה 'text'
  const questionText = currentQuestion.text || '';
  
  if (!questionText) {
    console.error("QuestionCardWithStory: No question text found", currentQuestion);
  }

  // וודא שיש אפשרויות תשובה
  if (!currentQuestion.options || currentQuestion.options.length === 0) {
    console.error("QuestionCardWithStory: No options found", currentQuestion);
  }

  const isCorrect = isAnswerSubmitted && selectedAnswerIndex === currentQuestion.correctAnswer;
  const isIncorrect = isAnswerSubmitted && selectedAnswerIndex !== currentQuestion.correctAnswer && selectedAnswerIndex !== null;
  const showCorrectAnswer = isAnswerSubmitted && (showAnswersImmediately || !examMode);

  // Get question type badge - using the 'type' property instead of 'questionType'
  const getQuestionTypeBadge = () => {
    switch (currentQuestion.type) {
      case 'reading-comprehension':
        return <span dir="ltr" style={{direction: 'ltr'}}>Reading Comprehension</span>;
      case 'sentence-completion':
        return <span dir="ltr" style={{direction: 'ltr'}}>Sentence Completion</span>;
      case 'restatement':
        return <span dir="ltr" style={{direction: 'ltr'}}>Restatement</span>;
      default:
        return 'Question';
    }
  };

  // פונקציה לזיהוי אם טקסט הוא באנגלית
  const isEnglishText = (text: string) => {
    if (!text) return false;
    const englishPattern = /^[a-zA-Z0-9\s.,!?;:()\-'"]+$/;
    return englishPattern.test(text.trim());
  };

  // פונקציה לבניית הטקסט המלא של הקטע - מציגה את כל הסיפור
  const getFullPassageText = () => {
    // אם יש passageText רגיל, השתמש בו
    if (currentQuestion.passageText) {
      return currentQuestion.passageText;
    }
    
    // אם יש passageWithLines, צור טקסט אחד רציף מכל השורות
    if (currentQuestion.passageWithLines && currentQuestion.passageWithLines.length > 0) {
      return currentQuestion.passageWithLines.map(line => line.text).join(' ');
    }
    
    return null;
  };

  // בדיקה אם יש קטע קריאה
  const hasReadingPassage = () => {
    return getFullPassageText() !== null || currentQuestion.passageTitle;
  };
  // רינדור הקטע המלא
  const renderFullReadingPassage = () => {
    const fullText = getFullPassageText();
    
    if (!hasReadingPassage()) {
      console.log('No reading passage found for question:', currentQuestion.id);
      return null;
    }

    console.log('Rendering full reading passage for question:', currentQuestion.id);

    return (
      <div className="w-full h-fit">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm h-fit">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-xl">
            <h4 className="text-xl font-bold text-white flex items-center gap-3 text-left" dir="ltr" style={{direction: 'ltr', textAlign: 'left'}}>
              <BookOpen className="h-6 w-6" />
              <span>{storyTitle || currentQuestion.passageTitle || "Reading Passage"}</span>
            </h4>
          </div>
          {/* Content - כל הטקסט */}
          <div className="p-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-100 shadow-sm">              <div 
                className={cn(
                  "text-gray-800 leading-relaxed text-xl font-medium whitespace-pre-line",
                  isEnglishText(fullText || "") ? "text-left" : "text-right"
                )}
                dir={isEnglishText(fullText || "") ? "ltr" : "rtl"}
                style={{
                  direction: isEnglishText(fullText || "") ? 'ltr' : 'rtl',
                  textAlign: isEnglishText(fullText || "") ? 'left' : 'right'
                }}
              >
                {fullText || "קטע קריאה זמין עבור שאלה זו"}
              </div>
            </div>
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
      className="max-w-7xl"
    >
      <Card className="border-0 shadow-lg bg-white">        {/* MAIN HEADER - PROPER RTL/LTR ALIGNMENT */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded-t-xl">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-2">
              {/* Badges Row */}
              <div className="flex items-center gap-3">
                <Badge className="bg-white/10 text-white backdrop-blur-sm text-sm font-medium px-3 py-1 border border-white/20" dir="ltr" style={{direction: 'ltr'}}>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-200 backdrop-blur-sm text-sm font-medium px-3 py-1 border border-blue-300/20">
                  {getQuestionTypeBadge()}
                </Badge>
                {localIsSaved && (
                  <Badge className="bg-amber-500/10 text-amber-200 backdrop-blur-sm flex items-center gap-1 border border-amber-300/20" dir="ltr" style={{direction: 'ltr'}}>
                    <Flag className="h-3 w-3 fill-current" />
                    <span>Saved</span>
                  </Badge>
                )}
              </div>

              {/* Story Name - PROPERLY ALIGNED */}
              {currentQuestion.passageTitle && (
                <div 
                  className="text-white/90 text-sm font-medium"
                  dir="ltr"
                  style={{direction: 'ltr', textAlign: 'left'}}
                >
                  <BookOpen className="inline h-4 w-4 ml-1" />
                  {currentQuestion.passageTitle}
                </div>
              )}

              {/* Progress Line - PROPERLY ALIGNED */}
              <div className="text-white/80 text-sm" dir="ltr" style={{direction: 'ltr', textAlign: 'left'}}>
                Progress: {currentQuestionIndex + 1} / {totalQuestions} Questions
              </div>            </div>            
            {/* Admin Edit Button - PROPERLY ALIGNED */}
            <div className="flex items-center gap-2">
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
        </div>        <CardContent className="p-6">
          {/* RESPONSIVE LAYOUT: Mobile (stacked) vs Desktop (side-by-side) */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* LEFT COLUMN (Desktop) / TOP (Mobile): Reading Passage */}
            {hasReadingPassage() && (
              <div className="w-full md:w-1/2 md:flex-shrink-0">
                {renderFullReadingPassage()}
              </div>
            )}            {/* RIGHT COLUMN (Desktop) / BOTTOM (Mobile): Question and Options */}
            <div className={cn("w-full", hasReadingPassage() ? "md:w-1/2" : "")}>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                {/* Question Header with Save Button */}
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-700">Question</h4>
                  
                  {/* Save Question Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0",
                      localIsSaved 
                        ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50 bg-amber-50/50" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={handleSaveStatusChange}
                    title={localIsSaved ? "הסר שאלה משמורות" : "שמור שאלה"}
                  >
                    <Flag className={cn("h-4 w-4", localIsSaved && "fill-current")} />
                    <span className="text-sm font-medium hidden sm:inline">
                      {localIsSaved ? "שמורה" : "שמור"}
                    </span>
                  </Button>
                </div>

                {/* Question Text */}
                <h3 
                  className={cn(
                    "text-xl font-medium text-gray-900 leading-relaxed mb-6",
                    isEnglishText(questionText) ? "text-left" : "text-right"
                  )}
                  dir={isEnglishText(questionText) ? "ltr" : "rtl"}
                  style={{
                    direction: isEnglishText(questionText) ? 'ltr' : 'rtl',
                    textAlign: isEnglishText(questionText) ? 'left' : 'right'
                  }}
                >
                  {questionText}
                </h3>
                
                {currentQuestion.image && (
                  <QuestionImage 
                    src={currentQuestion.image} 
                    alt={`תרשים לשאלה ${currentQuestionIndex + 1}`}
                    maxHeightRem={12}
                  />
                )}
                
                {currentQuestion.options && currentQuestion.options.length > 0 && (
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
                            <div className="flex items-center gap-4 flex-1" dir="ltr" style={{ direction: 'ltr' }}>
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
                              <span 
                                className={cn(
                                  "flex-grow leading-relaxed text-lg font-medium",
                                  isEnglishText(option) ? "text-left" : "text-right",
                                  isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && "text-green-700",
                                  isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && "text-red-700",
                                  isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && "text-green-700"
                                )}
                                dir={isEnglishText(option) ? "ltr" : "rtl"}
                                style={{
                                  direction: isEnglishText(option) ? 'ltr' : 'rtl',
                                  textAlign: isEnglishText(option) ? 'left' : 'right'
                                }}
                              >
                                {option}
                              </span>
                            </div>
                            
                            {isAnswerSubmitted && showCorrectAnswer && (
                              <div className="flex-shrink-0 mr-4">
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
                )}

                {/* Hint/Tip Button - show before submitting answer */}
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
                )}                {/* Submit/Navigation buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                  {!isAnswerSubmitted ? (
                    <Button 
                      onClick={onSubmitAnswer} 
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold text-lg px-10 py-4"
                      disabled={selectedAnswerIndex === null}
                      dir="ltr"
                      style={{direction: 'ltr'}}
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
                          {showExplanation ? 'הסתר הסבר' : 'הצג הסבר'}
                        </Button>
                      )}
                      <Button 
                        onClick={onNextQuestion} 
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-md font-medium text-base px-6 py-3"
                        dir="ltr"
                        style={{direction: 'ltr'}}
                      >
                        {currentQuestionIndex < totalQuestions - 1 ? (
                          <>
                            Next
                            <ChevronLeft className="h-5 w-5 mr-2" />
                          </>
                        ) : (
                          <>
                            Finish Exam
                            <Trophy className="h-5 w-5 mr-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation Section - Now within the question column */}
              <AnimatePresence>
                {(isAnswerSubmitted && currentQuestion.explanation && showAnswersImmediately && showExplanation) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4"
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
            </div>
          </div>        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionCardWithStory;