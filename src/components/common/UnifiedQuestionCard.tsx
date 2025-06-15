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
      // אם זו השאלה האחרונה ולא הוגשה תשובה - הגש אותה קודם
      if (!isAnswerSubmitted && selectedAnswerIndex !== null) {
        onSubmitAnswer();
        // נחכה רגע ואז נעבור לשאלה הבאה (שתסיים את הסימולציה)
        setTimeout(() => {
          onNextQuestion();
        }, 100);
      } else {
        // אם כבר הוגשה תשובה או אין תשובה נבחרת - סיים את הסימולציה
        onNextQuestion();
      }
    } else {
      onNextQuestion();
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-slate-800 to-slate-700 text-white animate-fade-in">
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Real-time Stats Panel */}
      {variant === 'simulation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{answeredQuestionsCount}/{totalQuestions}</div>
              <div className="text-sm opacity-90">נענו</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0 text-white">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{currentAccuracy}%</div>
              <div className="text-sm opacity-90">דיוק</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-0 text-white">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <div className="text-sm opacity-90">התקדמות</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Question Card */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-800 to-slate-700 text-white transition-all duration-500 hover:shadow-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl font-bold">
                שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
              </CardTitle>
              
              {examMode && remainingTime !== undefined && (
                <Badge variant="secondary" className="bg-red-600 text-white animate-pulse">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isPremium && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveStatusChange}
                  className={`transition-all duration-300 ${localIsSaved ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'}`}
                >
                  <Heart className={`h-5 w-5 ${localIsSaved ? 'fill-current' : ''}`} />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleQuestionFlag}
                className={`transition-all duration-300 ${isFlagged ? 'text-orange-400 hover:text-orange-300' : 'text-gray-400 hover:text-orange-400'}`}
              >
                <Flag className={`h-5 w-5 ${isFlagged ? 'fill-current' : ''}`} />
              </Button>
              
              {isAdmin && onEditQuestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditToggle}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  {isEditMode ? <Save className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </div>
          
          {variant === 'simulation' && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>התקדמות: {Math.round(progressPercentage)}%</span>
                <span>דיוק נוכחי: {currentAccuracy}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-slate-600" />
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Question Text */}
          <div className="text-xl leading-relaxed font-medium text-gray-100 mb-8 bg-slate-600/30 p-6 rounded-lg border border-slate-500/30">
            {isEditMode ? (
              <textarea
                value={editedQuestion?.text || ''}
                onChange={(e) => setEditedQuestion(prev => prev ? {...prev, text: e.target.value} : null)}
                className="w-full bg-slate-700 text-white p-4 rounded border border-slate-500 resize-none"
                rows={3}
              />
            ) : (
              currentQuestion.text
            )}
          </div>

          {/* Answer Options */}
          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswerIndex === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = isAnswerSubmitted && showAnswersImmediately;
              
              let buttonClasses = "w-full p-6 text-right text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] border-2 ";
              
              if (showResult) {
                if (isCorrect) {
                  buttonClasses += "bg-green-600/80 border-green-400 text-white shadow-lg shadow-green-500/30 animate-scale-in";
                } else if (isSelected && !isCorrect) {
                  buttonClasses += "bg-red-600/80 border-red-400 text-white shadow-lg shadow-red-500/30";
                } else {
                  buttonClasses += "bg-slate-600/50 border-slate-500 text-gray-300";
                }
              } else {
                if (isSelected) {
                  buttonClasses += "bg-blue-600/80 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105";
                } else {
                  buttonClasses += "bg-slate-600/50 border-slate-500 text-gray-100 hover:bg-slate-600/70 hover:border-slate-400";
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
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {showResult && isCorrect && <CheckCircle className="h-6 w-6 text-green-300" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-300" />}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="flex-1">{option}</span>
                      <span className="text-sm font-bold bg-slate-700/50 px-3 py-1 rounded-full">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && currentQuestion.explanation && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30 animate-fade-in">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-300">
                <BookOpen className="h-5 w-5" />
                הסבר:
              </h3>
              <p className="text-gray-200 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-slate-600">
            <Button
              variant="outline"
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-slate-600/50 border-slate-500 text-gray-100 hover:bg-slate-600/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5 ml-2" />
              הקודמת
            </Button>

            <div className="flex gap-4">
              {!isAnswerSubmitted && selectedAnswerIndex !== null ? (
                <Button
                  onClick={onSubmitAnswer}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  שלח תשובה
                </Button>
              ) : isAnswerSubmitted && showAnswersImmediately && (
                <Button
                  variant="outline"
                  onClick={onToggleExplanation}
                  className="bg-slate-600/50 border-slate-500 text-gray-100 hover:bg-slate-600/70 transition-all duration-300"
                >
                  {showExplanation ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
                  {showExplanation ? 'הסתר הסבר' : 'הצג הסבר'}
                </Button>
              )}

              {(isAnswerSubmitted || selectedAnswerIndex === null) && (
                <Button
                  onClick={handleNextOrFinish}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isLastQuestion ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      סיים
                    </>
                  ) : (
                    <>
                      הבאה
                      <ChevronRight className="h-5 w-5 ml-2" />
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
