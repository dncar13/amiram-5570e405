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
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 p-6 rounded-t-xl border-b border-slate-600/50">
            <div className="flex justify-start items-center">
              <div className="flex items-center gap-3">
                <Badge className="bg-slate-800/60 text-slate-200 backdrop-blur-sm text-base font-medium px-4 py-2 border border-slate-600/50 shadow-lg">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8 text-amber-400">
              <AlertCircle className="h-8 w-8" />
              <h3 className="text-2xl font-bold text-slate-100 leading-relaxed">
                Question Not Found
              </h3>
            </div>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              Sorry, no question was found for display. There may be no questions in this question set or an error occurred while loading the questions.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-between">
              <Button 
                onClick={onNextQuestion} 
                className="flex-1 sm:flex-none bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white shadow-lg border border-slate-600/50 text-lg py-3"
              >
                Back to Question List
                <ChevronLeft className="h-5 w-5 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Ensure question text exists - use the 'text' field
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
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-xl shadow-2xl h-fit">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 px-8 py-6 rounded-t-xl border-b border-slate-600/50">
            <h4 className="text-2xl font-bold text-slate-100 flex items-center gap-4 text-left" dir="ltr" style={{direction: 'ltr', textAlign: 'left'}}>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
                <BookOpen className="h-7 w-7 text-slate-300" />
              </div>
              <span>{storyTitle || currentQuestion.passageTitle || "Reading Passage"}</span>
            </h4>
          </div>
          {/* Content - כל הטקסט */}
          <div className="p-8">
            <div className="bg-slate-700/40 backdrop-blur-sm rounded-xl p-8 border border-slate-600/30 shadow-lg">              <div 
                className={cn(
                  "text-slate-100 leading-relaxed text-xl font-medium whitespace-pre-line",
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
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {/* MAIN HEADER */}
        <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 p-6 rounded-t-xl border-b border-slate-600/50">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-3">
              {/* Badges Row */}
              <div className="flex items-center gap-4">
                <Badge className="bg-slate-800/60 text-slate-200 backdrop-blur-sm text-base font-medium px-4 py-2 border border-slate-600/50 shadow-lg" dir="ltr" style={{direction: 'ltr'}}>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </Badge>
                <Badge className="bg-slate-800/60 text-slate-200 backdrop-blur-sm text-base font-medium px-4 py-2 border border-slate-600/50 shadow-lg">
                  {getQuestionTypeBadge()}
                </Badge>
                {localIsSaved && (
                  <Badge className="bg-amber-500/20 text-amber-300 backdrop-blur-sm flex items-center gap-2 border border-amber-400/30 px-4 py-2 shadow-lg" dir="ltr" style={{direction: 'ltr'}}>
                    <Flag className="h-4 w-4 fill-current" />
                    <span>Saved</span>
                  </Badge>
                )}
              </div>

              {/* Story Name */}
              {currentQuestion.passageTitle && (
                <div 
                  className="text-slate-300 text-lg font-medium flex items-center gap-2"
                  dir="ltr"
                  style={{direction: 'ltr', textAlign: 'left'}}
                >
                  <BookOpen className="h-5 w-5" />
                  {currentQuestion.passageTitle}
                </div>
              )}

              {/* Progress Line */}
              <div className="text-slate-400 text-base" dir="ltr" style={{direction: 'ltr', textAlign: 'left'}}>
                Progress: {currentQuestionIndex + 1} / {totalQuestions} Questions
              </div>
            </div>
            
            {/* Admin Edit Button */}
            <div className="flex items-center gap-3">
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
        </div>        <CardContent className="p-8">
          {/* RESPONSIVE LAYOUT: Mobile (stacked) vs Desktop (side-by-side) */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            {/* LEFT COLUMN (Desktop) / TOP (Mobile): Reading Passage */}
            {hasReadingPassage() && (
              <div className="w-full md:w-1/2 md:flex-shrink-0">
                {renderFullReadingPassage()}
              </div>
            )}            {/* RIGHT COLUMN (Desktop) / BOTTOM (Mobile): Question and Options */}
            <div className={cn("w-full", hasReadingPassage() ? "md:w-1/2" : "")}>
              <div className="bg-slate-800/60 rounded-xl p-8 border border-slate-600/50 shadow-lg">
                {/* Question Header with Save Button */}
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-2xl font-bold text-slate-200">Question</h4>
                  
                  {/* Save Question Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 flex-shrink-0 border text-lg",
                      localIsSaved 
                        ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 bg-amber-500/10 border-amber-400/30" 
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 border-slate-600/50"
                    )}
                    onClick={handleSaveStatusChange}
                    title={localIsSaved ? "הסר שאלה משמורות" : "שמור שאלה"}
                  >
                    <Flag className={cn("h-5 w-5", localIsSaved && "fill-current")} />
                    <span className="font-medium hidden sm:inline">
                      {localIsSaved ? "שמורה" : "שמור"}
                    </span>
                  </Button>
                </div>

                {/* Question Text */}
                <h3 
                  className={cn(
                    "text-2xl font-medium text-slate-100 leading-relaxed mb-8",
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
                            "w-full text-right px-8 py-6 border-2 rounded-xl text-xl transition-all duration-200 group shadow-lg hover:shadow-xl",
                            selectedAnswerIndex === index 
                              ? "border-slate-500 bg-slate-700/60 shadow-xl" 
                              : "border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-700/40 bg-slate-800/40",
                            isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && 
                              "border-green-500 bg-green-500/20 shadow-xl",
                            isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && 
                              "border-red-500 bg-red-500/20 shadow-xl",
                            isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && 
                              selectedAnswerIndex !== index && "border-green-500 bg-green-500/20 shadow-xl"
                          )}
                          onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                          disabled={isAnswerSubmitted}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5 flex-1" dir="ltr" style={{ direction: 'ltr' }}>
                              <div className={cn(
                                "flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-200 font-bold text-xl",
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
                                {index + 1}
                              </div>
                              <span 
                                className={cn(
                                  "flex-grow leading-relaxed text-xl font-medium",
                                  isEnglishText(option) ? "text-left" : "text-right",
                                  "text-slate-200",
                                  isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && "text-green-300",
                                  isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && "text-red-300",
                                  isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && "text-green-300"
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
                              <div className="flex-shrink-0 mr-5">
                                {selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && (
                                  <CheckCircle className="h-8 w-8 text-green-400" />
                                )}
                                {selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && (
                                  <XCircle className="h-8 w-8 text-red-400" />
                                )}
                                {index === currentQuestion.correctAnswer && selectedAnswerIndex !== index && (
                                  <CheckCircle className="h-8 w-8 text-green-400" />
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
                <div className="flex flex-col sm:flex-row gap-5 justify-start items-start">                  {!isAnswerSubmitted ? (
                    <Button 
                      onClick={onSubmitAnswer} 
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl font-bold text-xl px-12 py-5 border border-emerald-500/50"
                      disabled={selectedAnswerIndex === null}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <div className="flex gap-5 w-full sm:w-auto justify-start">
                      {currentQuestion.explanation && (!examMode || showAnswersImmediately === true) && (                        <Button 
                          variant="outline" 
                          onClick={onToggleExplanation}
                          className="flex-1 sm:flex-none border-2 border-slate-600/50 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 hover:text-slate-100 font-medium text-lg px-8 py-4"
                        >
                          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                        </Button>
                      )}                      <Button 
                        onClick={onNextQuestion} 
                        className="flex-1 sm:flex-none bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white shadow-xl font-medium text-lg px-8 py-4 border border-slate-500/50"
                      >
                        {currentQuestionIndex < totalQuestions - 1 ? (
                          <>
                            Next
                            <ChevronLeft className="h-6 w-6 mr-3" />
                          </>
                        ) : (
                          <>
                            Finish Exam
                            <Trophy className="h-6 w-6 mr-3" />
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
                    className="overflow-hidden mt-6"
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
            </div>
          </div>        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionCardWithStory;
