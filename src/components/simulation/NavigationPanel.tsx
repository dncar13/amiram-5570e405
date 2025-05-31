import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/data/questionsData";
import { CheckCircle, XCircle, Flag, Trash, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";

interface NavigationPanelProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswers: (number | null)[];
  questionsData: Question[];
  questionFlags: boolean[];
  progressPercentage: number;
  currentScorePercentage: number;
  onNavigateToQuestion: (index: number) => void;
  onToggleQuestionFlag: (index: number) => void;
  onResetProgress: () => void;
  simulationType?: "topic" | "question-set"; // Added this prop
  setNumber?: number; // Added this prop
}

const NavigationPanel = ({
  currentQuestionIndex,
  totalQuestions,
  userAnswers,
  questionsData,
  questionFlags,
  progressPercentage,
  currentScorePercentage,
  onNavigateToQuestion,
  onToggleQuestionFlag,
  onResetProgress,
  simulationType,
  setNumber
}: NavigationPanelProps) => {
  const { isQuestionSaved } = useSavedQuestions();

  // פונקציה לקביעת סטטוס השאלה
  const getQuestionStatus = (index: number) => {
    if (index >= userAnswers.length || index >= questionsData.length) {
      return "unanswered";
    }
    
    const userAnswer = userAnswers[index];
    const correctAnswer = questionsData[index].correctAnswer;
    
    if (userAnswer === null) return "unanswered";
    if (userAnswer === correctAnswer) return "correct";
    return "incorrect";
  };

  // פילטור שאלות לפי סטטוס - make sure we don't exceed array bounds
  const validIndices = questionsData
    .map((_, index) => index)
    .filter(index => index < userAnswers.length);
  
  const unansweredQuestions = validIndices
    .filter((index) => userAnswers[index] === null);
  
  const incorrectQuestions = validIndices
    .filter((index) => {
      const userAnswer = userAnswers[index];
      return userAnswer !== null && userAnswer !== questionsData[index].correctAnswer;
    });
  
  // עדכון הדגלים לבדוק גם את השאלות השמורות
  const flaggedQuestions = questionsData
    .map((question, index) => ({ question, index }))
    .filter(item => 
      item.index < questionFlags.length && 
      (questionFlags[item.index] || isQuestionSaved(item.question.id))
    )
    .map(item => item.index);

  // חישוב מספר תשובות נכונות - ensure we don't go beyond array bounds
  const correctAnswersCount = validIndices.reduce((count, index) => {
    if (userAnswers[index] !== null && userAnswers[index] === questionsData[index].correctAnswer) {
      return count + 1;
    }
    return count;
  }, 0);

  // חישוב מספר שאלות שנענו
  const answeredCount = userAnswers.filter((answer, index) => 
    index < questionsData.length && answer !== null
  ).length;

  // רנדור כפתור לשאלה בודדת
  const renderQuestionButton = (index: number) => {
    const status = getQuestionStatus(index);
    const isFlagged = questionFlags[index] || (questionsData[index] && isQuestionSaved(questionsData[index].id));
    const isCurrent = index === currentQuestionIndex;
    
    return (
      <Button
        key={index}
        variant={isCurrent ? "default" : "outline"}
        size="sm"
        className={cn(
          "relative h-10 w-10 rounded-lg transition-all duration-200 hover:scale-105 border-2",
          isCurrent && "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 border-blue-400",
          !isCurrent && status === 'correct' && "bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:border-green-400",
          !isCurrent && status === 'incorrect' && "bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:border-red-400",
          !isCurrent && status === 'unanswered' && isFlagged && "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 hover:border-amber-400",
          !isCurrent && status === 'unanswered' && !isFlagged && "bg-white border-gray-200 hover:border-gray-300"
        )}
        onClick={() => onNavigateToQuestion(index)}
      >
        {status === 'correct' && (
          <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full" />
        )}
        {status === 'incorrect' && (
          <XCircle className="absolute -top-1 -right-1 h-4 w-4 text-red-600 bg-white rounded-full" />
        )}
        {isFlagged && (
          <Flag className="absolute -top-1 -left-1 h-4 w-4 text-amber-600 bg-white rounded-full p-0.5 fill-amber-600" />
        )}
        <span className={cn(
          "font-semibold text-sm",
          isCurrent && "text-white",
          !isCurrent && status === 'correct' && "text-green-700",
          !isCurrent && status === 'incorrect' && "text-red-700",
          !isCurrent && status === 'unanswered' && "text-gray-700"
        )}>
          {index + 1}
        </span>
      </Button>
    );
  };

  // רנדור רשימת כפתורים
  const renderQuestionList = (indices: number[]) => {
    if (indices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <p className="text-sm">אין שאלות להצגה</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 justify-start" style={{ direction: 'rtl' }}>
        {indices.map(index => renderQuestionButton(index))}
      </div>
    );
  };

  return (
    <Card className="relative bg-gradient-to-br from-white to-gray-50 shadow-xl border-0 h-full">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="text-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <span>
              {simulationType === "question-set" 
                ? `קבוצה ${setNumber || ''}` 
                : "ניווט מהיר"}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/20" 
            onClick={onResetProgress}
            title="אפס התקדמות"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* סטטיסטיקות התקדמות */}
        <div className="space-y-3 mb-4">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-600">התקדמות</span>
              <span className="text-lg font-bold text-blue-600">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-600">ציון נוכחי</span>
              <span className={cn(
                "text-lg font-bold",
                currentScorePercentage >= 60 ? "text-green-600" : "text-red-600"
              )}>
                {currentScorePercentage}%
              </span>
            </div>
            <Progress 
              value={currentScorePercentage} 
              className="h-2" 
              indicatorClassName={currentScorePercentage >= 60 ? "bg-green-600" : "bg-red-600"}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2.5 text-center border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-green-800 font-medium">נכונות</div>
              <div className="text-lg font-bold text-green-700">{correctAnswersCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-2.5 text-center border border-red-200">
              <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <div className="text-xs text-red-800 font-medium">שגויות</div>
              <div className="text-lg font-bold text-red-700">{incorrectQuestions.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-2.5 text-center border border-amber-200">
              <Flag className="h-5 w-5 text-amber-600 mx-auto mb-1 fill-amber-500" />
              <div className="text-xs text-amber-800 font-medium">שמורות</div>
              <div className="text-lg font-bold text-amber-700">{flaggedQuestions.length}</div>
            </div>
          </div>
        </div>
        
        {/* טאבים לרשימות שאלות */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-3 bg-gray-100/80 backdrop-blur-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium">
              הכל ({totalQuestions})
            </TabsTrigger>
            <TabsTrigger value="unanswered" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium">
              לא נענו ({unansweredQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="incorrect" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium">
              שגויות ({incorrectQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="flagged" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium">
              שמורות ({flaggedQuestions.length})
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
            <TabsContent value="all" className="mt-0">
              {renderQuestionList(Array.from({ length: totalQuestions }, (_, i) => i))}
            </TabsContent>
            
            <TabsContent value="unanswered" className="mt-0">
              {renderQuestionList(unansweredQuestions)}
            </TabsContent>
            
            <TabsContent value="incorrect" className="mt-0">
              {renderQuestionList(incorrectQuestions)}
            </TabsContent>
            
            <TabsContent value="flagged" className="mt-0">
              {renderQuestionList(flaggedQuestions)}
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="mt-3 flex justify-center items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>נכונה</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>שגויה</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span>שמורה</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationPanel;
