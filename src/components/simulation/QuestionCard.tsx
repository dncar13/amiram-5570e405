import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Flag, Edit, ChevronLeft, ChevronRight, MessageSquare, Trophy, AlertCircle } from "lucide-react";
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

  // אנימציית הבהוב מוגבלת ל-3 פעמים
  const pulseAnimation = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.5,
        repeat: 2, // הבהוב 3 פעמים בלבד (0, 1, 2)
        repeatType: "loop" as const
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg bg-white">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge className="bg-white/10 text-white backdrop-blur-sm text-sm font-medium px-3 py-1 border border-white/20">
                שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
              </Badge>
              {localIsSaved && (
                <Badge className="bg-amber-500/10 text-amber-200 backdrop-blur-sm flex items-center gap-1 border border-amber-300/20">
                  <Flag className="h-3 w-3 fill-current" />
                  <span>נשמרה</span>
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
          <h3 className="text-xl font-semibold mb-6 text-gray-800 leading-relaxed">
            {currentQuestion.text}
          </h3>
          
          {currentQuestion.image && (
            <QuestionImage 
              src={currentQuestion.image} 
              alt={`תרשים לשאלה ${currentQuestionIndex + 1}`}
              maxHeightRem={16}
            />
          )}
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                variants={
                  isAnswerSubmitted && index === currentQuestion.correctAnswer
                    ? pulseAnimation
                    : undefined
                }
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
                  <div className="flex items-start gap-4" style={{ direction: 'rtl' }}>
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
                      <span className="font-semibold text-lg">{index + 1}</span>
                    </div>
                    <span className={cn(
                      "flex-grow text-right leading-relaxed transition-colors duration-200",
                      selectedAnswerIndex === index ? "text-gray-900 font-medium" : "text-gray-700",
                      isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex === currentQuestion.correctAnswer && "text-green-700 font-medium",
                      isAnswerSubmitted && selectedAnswerIndex === index && selectedAnswerIndex !== currentQuestion.correctAnswer && "text-red-700",
                      isAnswerSubmitted && showCorrectAnswer && index === currentQuestion.correctAnswer && "text-green-700 font-medium"
                    )}>
                      {option}
                    </span>
                  </div>
                  
                  {isAnswerSubmitted && showCorrectAnswer && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
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
          
          <AnimatePresence>
            {(isAnswerSubmitted && currentQuestion.explanation && showAnswersImmediately && showExplanation) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
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
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex gap-2">
              {currentQuestionIndex > 0 && (
                <Button 
                  onClick={onPreviousQuestion} 
                  variant="outline"
                  className="flex-1 sm:flex-none border hover:bg-gray-50"
                  disabled={examMode && !isAnswerSubmitted}
                >
                  <ChevronRight className="h-4 w-4 ml-1" />
                  הקודמת
                </Button>
              )}
              
              {isAnswerSubmitted && (
                <Button 
                  onClick={onNextQuestion} 
                  className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white shadow-md"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <>
                      הבאה
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </>
                  ) : (
                    <>
                      סיים סימולציה
                      <Trophy className="h-4 w-4 mr-1" />
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
                  הגש תשובה
                </Button>
              ) : (
                currentQuestion.explanation && (!examMode || showAnswersImmediately === true) && (
                  <Button 
                    variant="outline" 
                    onClick={onToggleExplanation}
                    className="flex-1 sm:flex-none border"
                  >
                    {showExplanation ? 'הסתר הסבר' : 'הצג הסבר'}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
