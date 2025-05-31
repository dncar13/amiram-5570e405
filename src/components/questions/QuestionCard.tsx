
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, ArrowLeft, ArrowRight, Image, Edit, Flag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Question } from "@/data/questionsData";
import { useAuth } from "@/context/AuthContext";
import { QuestionImage } from "@/components/common/QuestionImage";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  currentQuestion: Question;
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
  const questionCardRef = useRef<HTMLDivElement>(null);
  // כדי לעקוב אחרי הזמן שנותר לשאלה בבחינה
  const [remainingTime, setRemainingTime] = useState(examMode ? 60 : 0); // 60 שניות לדוגמה

  useEffect(() => {
    if (currentQuestion) {
      setLocalIsSaved(isQuestionSaved(currentQuestion.id));
    }
  }, [currentQuestion, isQuestionSaved]);

  useEffect(() => {
    if (questionCardRef.current) {
      questionCardRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
    
    // איפוס הטיימר בכל שאלה חדשה
    if (examMode) {
      setRemainingTime(60);
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, examMode]);

  const handleSaveStatusChange = () => {
    if (!isPremium) {
      toast({
        title: "תכונה זו זמינה למשתמשי פרימיום בלבד",
        description: "שדרג לפרימיום כדי לשמור שאלות ולקבל גישה לתכונות נוספות",
        variant: "destructive",
      });
      return;
    }
    
    if (localIsSaved) {
      removeQuestionById(currentQuestion.id);
    } else {
      saveQuestion(currentQuestion);
    }
    setLocalIsSaved(!localIsSaved);
  };

  if (!currentQuestion) {
    return (
      <Card className="shadow-md border-t-4 border-t-red-500 overflow-hidden transition-all animate-fade-in max-w-3xl mx-auto">
        <CardHeader className="pb-2 bg-red-50">
          <CardTitle className="text-lg text-red-700">
            שאלה לא נמצאה
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-700">
            לא נמצאה שאלה להצגה. ייתכן שאין שאלות לנושא זה או שאירעה שגיאה בטעינת השאלות.
          </p>
        </CardContent>
        <CardFooter className="pt-2 pb-4 flex flex-col items-center">
          <Button 
            onClick={onNextQuestion} 
            className="bg-electric-blue hover:bg-blue-600 font-medium">
            חזרה לרשימת הנושאים
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const renderProgressBar = () => {
    const percentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    return (
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
        <div 
          className="bg-electric-blue h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <Card ref={questionCardRef} className="shadow-md border-t-4 border-t-electric-blue overflow-hidden transition-all animate-fade-in max-w-3xl mx-auto">
      {renderProgressBar()}
      
      <CardHeader className="pb-2 bg-electric-blue/8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="text-lg text-electric-navy flex items-start gap-2 w-full">
            <span className="bg-electric-blue text-white rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
              {currentQuestionIndex + 1}
            </span>
            <span className="break-words">{currentQuestion.text}</span>
          </CardTitle>
          
          <div className="flex items-center">
            {examMode && (
              <div className={`mr-2 text-sm font-medium rounded-full py-1 px-3 ${
                remainingTime < 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {remainingTime}s
              </div>
            )}
            
            {isAdmin && onEditQuestion && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-electric-blue hover:bg-electric-blue/10"
                onClick={() => onEditQuestion(currentQuestion)}
              >
                <Edit className="h-4 w-4 ml-1" />
                ערוך שאלה
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {currentQuestion.image && (
          <QuestionImage 
            src={currentQuestion.image} 
            alt={`תרשים לשאלה ${currentQuestionIndex + 1}`}
            maxHeightRem={15}
          />
        )}
        
        <div className="space-y-3" role="radiogroup" aria-labelledby="question-options">
          {currentQuestion.options && currentQuestion.options.map((option, index) => {
            const isCorrectAnswer = index === currentQuestion.correctAnswer;
            const isSelectedAnswer = selectedAnswerIndex === index;
            const showCorrectAnswer = isAnswerSubmitted && (!examMode || examMode && !showAnswersImmediately === false);

            return (
              <div 
                key={index}
                onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center gap-3 text-right
                  ${isSelectedAnswer 
                    ? showCorrectAnswer 
                      ? isCorrectAnswer 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50' 
                      : 'border-electric-blue bg-electric-blue/8' 
                    : showCorrectAnswer && isCorrectAnswer 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-electric-blue hover:bg-electric-blue/5'
                  } ${!isAnswerSubmitted && 'hover:scale-[1.01] hover:shadow-sm'}
                  ${isSelectedAnswer ? 'ring-2 ring-electric-blue border-2' : ''}
                  `}
                style={{touchAction: "manipulation"}}
                role="radio"
                aria-checked={isSelectedAnswer}
                aria-label={`אפשרות ${index + 1}: ${option}`}
                tabIndex={isAnswerSubmitted ? -1 : 0}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 text-xs
                  ${
                    isSelectedAnswer 
                      ? showCorrectAnswer 
                        ? isCorrectAnswer 
                          ? 'bg-green-500 text-white border-green-500' 
                          : 'bg-red-500 text-white border-red-500' 
                        : 'bg-electric-blue text-white border-electric-blue' 
                      : showCorrectAnswer && isCorrectAnswer 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'border-gray-300 bg-gray-50'
                  }`}>
                  {showCorrectAnswer ? (
                    isCorrectAnswer ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : isSelectedAnswer ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className={`flex-grow text-sm text-right leading-relaxed break-words ${
                    showCorrectAnswer && (
                      isCorrectAnswer ? 'text-green-700 font-medium' : 
                      isSelectedAnswer ? 'text-red-700' : ''
                    )
                  }`}>
                  {option}
                </span>
                {isCorrectAnswer && showCorrectAnswer && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                    תשובה נכונה: {currentQuestion.correctAnswer + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {isAnswerSubmitted && showExplanation && currentQuestion.explanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-electric-navy font-medium flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4" />
              הסבר:
            </h4>
            <div className="text-electric-slate prose prose-sm max-w-none whitespace-pre-line text-sm" dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
            {currentQuestion.explanationImage && (
              <QuestionImage 
                src={currentQuestion.explanationImage} 
                alt={`הסבר חזותי לשאלה ${currentQuestionIndex + 1}`}
                maxHeightRem={14}
              />
            )}
            {currentQuestion.explanationVideo && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-electric-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1 1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                    </svg>
                  </div>
                  <span className="text-sm">צפה בסרטון הסבר מפורט</span>
                </div>
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded">
                  <iframe 
                    src={currentQuestion.explanationVideo} 
                    title={`הסבר וידאו לשאלה ${currentQuestionIndex + 1}`}
                    className="absolute top-0 left-0 w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-4 flex flex-col-reverse md:flex-row gap-3 justify-between">
        
        <div className="flex w-full md:w-auto order-1 md:order-1 justify-between items-center gap-2">
          {currentQuestionIndex > 0 && (
            <Button 
              onClick={onPreviousQuestion} 
              variant="outline"
              className="hover:bg-electric-gray/30 flex items-center gap-2 order-1 md:order-1 ml-2"
              disabled={examMode && !isAnswerSubmitted} // אם במצב בחינה, לא ניתן לחזור אחורה לפני הגשת התשובה
            >
              <ArrowRight className="h-4 w-4 ml-1" />
              <span className="hidden sm:inline">לשאלה הקודמת</span>
              <span className="inline sm:hidden">הקודמת</span>
            </Button>
          )}

          {isAnswerSubmitted && (
            <Button 
              onClick={onNextQuestion} 
              className="bg-electric-blue hover:bg-blue-600 font-medium flex items-center gap-2 transition-transform hover:scale-[1.02] order-2 md:order-2"
            >
              {currentQuestionIndex < totalQuestions - 1 ? (
                <>
                  <span className="hidden sm:inline">לשאלה הבאה</span>
                  <span className="inline sm:hidden">הבאה</span>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                </>
              ) : (
                'סיים סימולציה'
              )}
            </Button>
          )}
        </div>
        
        <div className="flex w-full md:w-auto order-2 md:order-2 justify-end gap-2 mb-2 md:mb-0">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-gray-500 hover:text-yellow-500 hover:bg-yellow-50",
              localIsSaved && "text-yellow-500 bg-yellow-50",
              !isPremium && "opacity-70"
            )}
            onClick={handleSaveStatusChange}
            title={isPremium ? (localIsSaved ? "הסר מהשמורות" : "שמור שאלה") : "תכונה זו זמינה למשתמשי פרימיום בלבד"}
          >
            <Flag className={cn("h-4 w-4 ml-1", localIsSaved && "fill-current")} />
            {localIsSaved ? 'נשמרה' : 'שמור'}
          </Button>
        </div>
        
        <div className="flex justify-center w-full md:w-auto order-3 md:order-3">
          {!isAnswerSubmitted ? (
            <Button 
              onClick={onSubmitAnswer} 
              className="w-full md:w-auto px-8 py-5 text-base bg-electric-blue hover:bg-blue-600 font-medium transition-transform hover:scale-[1.02]"
              disabled={selectedAnswerIndex === null}
            >
              הגש תשובה
            </Button>
          ) : (
            currentQuestion.explanation && (!examMode || showAnswersImmediately) && (
              <Button 
                variant="outline" 
                onClick={onToggleExplanation}
                className="w-full md:w-auto hover:bg-electric-gray/30"
              >
                {showExplanation ? 'הסתר הסבר' : 'הצג הסבר'}
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
