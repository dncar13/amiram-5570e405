import { useState, useEffect } from "react";
import { Question } from "@/data/questionsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Flag, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  Edit3,
  Save,
  Heart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Explanation {
  text: string;
}

interface QuestionResult {
  isCorrect: boolean;
  explanation?: Explanation;
}

interface QuestionType {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  type?: string;
  passageText?: string;
  passageTitle?: string;
  passageWithLines?: string[];
}

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
  remainingTime?: number;
  answeredQuestionsCount?: number;
  correctQuestionsCount?: number;
  progressPercentage?: number;
  variant?: 'practice' | 'simulation';
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
  onEditQuestion?: (question: Question) => void;
}

// Auto-detect text direction based on content
const detectTextDirection = (text: string): 'rtl' | 'ltr' => {
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text) ? 'rtl' : 'ltr';
};

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
  remainingTime,
  answeredQuestionsCount = 0,
  correctQuestionsCount = 0,
  progressPercentage = 0,
  variant = 'practice',
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleQuestionFlag,
  onEditQuestion
}: UnifiedQuestionCardProps) => {
  const { isPremium, isAdmin } = useAuth();
  const { isQuestionSaved, saveQuestion, removeQuestionById } = useSavedQuestions();
  const [localIsSaved, setLocalIsSaved] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (currentQuestion) {
      setLocalIsSaved(isQuestionSaved(currentQuestion.id));
      setEditedQuestion(currentQuestion);
    }
  }, [currentQuestion, isQuestionSaved]);

  const handleSaveStatusChange = () => {
    if (!isPremium || !currentQuestion) return;
    
    if (localIsSaved) {
      removeQuestionById(currentQuestion.id);
    } else {
      saveQuestion(currentQuestion);
    }
    setLocalIsSaved(!localIsSaved);
  };

  const handleEditToggle = () => {
    if (isEditMode && editedQuestion && onEditQuestion) {
      onEditQuestion(editedQuestion);
    }
    setIsEditMode(!isEditMode);
  };

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleNextOrFinish = () => {
    if (isLastQuestion) {
      if (!isAnswerSubmitted && selectedAnswerIndex !== null) {
        onSubmitAnswer();
        setTimeout(() => {
          onNextQuestion();
        }, 100);
      } else {
        onNextQuestion();
      }
    } else {
      onNextQuestion();
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-5xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-slate-800 to-slate-700 text-white animate-fade-in">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">טוען שאלה...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentScore = totalQuestions > 0 ? Math.round((correctQuestionsCount / totalQuestions) * 100) : 0;
  const currentAccuracy = answeredQuestionsCount > 0 ? Math.round((correctQuestionsCount / answeredQuestionsCount) * 100) : 0;
  
  const questionDirection = detectTextDirection(currentQuestion.text);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in px-4">
      {/* Real-time Stats Panel */}
      {variant === 'simulation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold mb-1">{answeredQuestionsCount}/{totalQuestions}</div>
              <div className="text-sm opacity-90">נענו</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold mb-1">{currentAccuracy}%</div>
              <div className="text-sm opacity-90">דיוק</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold mb-1">{Math.round(progressPercentage)}%</div>
              <div className="text-sm opacity-90">התקדמות</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Question Card */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-50 to-white text-slate-800 transition-all duration-500 hover:shadow-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl font-bold">
                שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
              </CardTitle>
              
              {examMode && remainingTime !== undefined && (
                <Badge variant="secondary" className="bg-red-600 text-white animate-pulse px-3 py-2">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {isPremium && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveStatusChange}
                  className={`transition-all duration-300 hover:scale-110 ${localIsSaved ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'}`}
                >
                  <Heart className={`h-6 w-6 ${localIsSaved ? 'fill-current' : ''}`} />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleQuestionFlag}
                className={`transition-all duration-300 hover:scale-110 ${isFlagged ? 'text-orange-400 hover:text-orange-300' : 'text-gray-400 hover:text-orange-400'}`}
              >
                <Flag className={`h-6 w-6 ${isFlagged ? 'fill-current' : ''}`} />
              </Button>
              
              {isAdmin && onEditQuestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditToggle}
                  className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                >
                  {isEditMode ? <Save className="h-6 w-6" /> : <Edit3 className="h-6 w-6" />}
                </Button>
              )}
            </div>
          </div>
          
          {variant === 'simulation' && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-3 opacity-90">
                <span>התקדמות: {Math.round(progressPercentage)}%</span>
                <span>דיוק נוכחי: {currentAccuracy}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-slate-600/50" 
                indicatorClassName="bg-gradient-to-r from-blue-400 to-purple-400"
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Question Text */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-8 rounded-xl border-2 border-slate-200 shadow-inner">
            {isEditMode ? (
              <textarea
                value={editedQuestion?.text || ''}
                onChange={(e) => setEditedQuestion(prev => prev ? {...prev, text: e.target.value} : null)}
                className="w-full bg-white text-slate-800 p-6 rounded-lg border-2 border-slate-300 resize-none text-xl leading-relaxed font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                rows={4}
                dir={questionDirection}
              />
            ) : (
              <div 
                className="text-xl leading-relaxed font-medium text-slate-800 whitespace-pre-wrap break-words"
                dir={questionDirection}
                style={{ textAlign: questionDirection === 'rtl' ? 'right' : 'left' }}
              >
                {currentQuestion.text}
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswerIndex === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = isAnswerSubmitted && showAnswersImmediately;
              const optionDirection = detectTextDirection(option);
              
              let buttonClasses = "group relative w-full p-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border-2 rounded-xl ";
              
              if (showResult) {
                if (isCorrect) {
                  buttonClasses += "bg-gradient-to-r from-green-50 to-green-100 border-green-400 text-green-800 shadow-lg shadow-green-500/20 animate-scale-in";
                } else if (isSelected && !isCorrect) {
                  buttonClasses += "bg-gradient-to-r from-red-50 to-red-100 border-red-400 text-red-800 shadow-lg shadow-red-500/20";
                } else {
                  buttonClasses += "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 text-gray-600";
                }
              } else {
                if (isSelected) {
                  buttonClasses += "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 text-blue-800 shadow-lg shadow-blue-500/20 scale-105 ring-2 ring-blue-200";
                } else {
                  buttonClasses += "bg-white border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 hover:border-slate-400 hover:shadow-md";
                }
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClasses}
                  onClick={() => !isAnswerSubmitted && onAnswerSelect(index)}
                  disabled={isAnswerSubmitted}
                >
                  <div className="flex items-center justify-between w-full min-h-[3rem]">
                    <div className="flex items-center gap-4">
                      {showResult && isCorrect && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white">
                          <XCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div 
                        className="flex-1 whitespace-pre-wrap break-words leading-relaxed"
                        dir={optionDirection}
                        style={{ textAlign: optionDirection === 'rtl' ? 'right' : 'left' }}
                      >
                        {option}
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 text-lg font-bold bg-slate-100 text-slate-700 rounded-full flex-shrink-0 group-hover:bg-slate-200 transition-colors duration-300">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && currentQuestion.explanation && (
            <div className="mt-8 p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-200 animate-fade-in shadow-inner">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-blue-800">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                הסבר:
              </h3>
              <p 
                className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words text-lg"
                dir={detectTextDirection(currentQuestion.explanation)}
                style={{ textAlign: detectTextDirection(currentQuestion.explanation) === 'rtl' ? 'right' : 'left' }}
              >
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t-2 border-slate-200">
            <Button
              variant="outline"
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 px-6 py-3 text-lg rounded-xl hover:shadow-md"
            >
              <ChevronLeft className="h-5 w-5 ml-2" />
              הקודמת
            </Button>

            <div className="flex gap-6">
              {!isAnswerSubmitted && selectedAnswerIndex !== null ? (
                <Button
                  onClick={onSubmitAnswer}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                >
                  <CheckCircle className="h-6 w-6 mr-3" />
                  שלח תשובה
                </Button>
              ) : isAnswerSubmitted && showAnswersImmediately && (
                <Button
                  variant="outline"
                  onClick={onToggleExplanation}
                  className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-300 px-6 py-3 text-lg rounded-xl hover:shadow-md"
                >
                  {showExplanation ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
                  {showExplanation ? 'הסתר הסבר' : 'הצג הסבר'}
                </Button>
              )}

              {(isAnswerSubmitted || selectedAnswerIndex === null) && (
                <Button
                  onClick={handleNextOrFinish}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                >
                  {isLastQuestion ? (
                    <>
                      <CheckCircle className="h-6 w-6 mr-3" />
                      סיים
                    </>
                  ) : (
                    <>
                      הבאה
                      <ChevronRight className="h-5 w-5 ml-3" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedQuestionCard;
