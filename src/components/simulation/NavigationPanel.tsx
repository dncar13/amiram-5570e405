
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
  
  const flaggedQuestions = questionsData
    .map((question, index) => ({ question, index }))
    .filter(item => 
      item.index < questionFlags.length && 
      (questionFlags[item.index] || isQuestionSaved(item.question.id))
    )
    .map(item => item.index);

  const correctAnswersCount = validIndices.reduce((count, index) => {
    if (userAnswers[index] !== null && userAnswers[index] === questionsData[index].correctAnswer) {
      return count + 1;
    }
    return count;
  }, 0);

  const answeredCount = userAnswers.filter((answer, index) => 
    index < questionsData.length && answer !== null
  ).length;

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
          "relative h-12 w-12 rounded-xl transition-all duration-200 hover:scale-105 border-2 text-lg font-semibold shadow-lg",
          isCurrent && "bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 border-blue-400 text-white",
          !isCurrent && status === 'correct' && "bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/50 hover:border-green-400 text-green-400 hover:bg-green-600/30",
          !isCurrent && status === 'incorrect' && "bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/50 hover:border-red-400 text-red-400 hover:bg-red-600/30",
          !isCurrent && status === 'unanswered' && isFlagged && "bg-gradient-to-br from-amber-600/20 to-amber-700/20 border-amber-500/50 hover:border-amber-400 text-amber-400 hover:bg-amber-600/30",
          !isCurrent && status === 'unanswered' && !isFlagged && "bg-slate-800/60 border-slate-600/50 hover:border-slate-500 text-slate-300 hover:bg-slate-700/60"
        )}
        onClick={() => onNavigateToQuestion(index)}
      >
        {status === 'correct' && (
          <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-green-400 bg-slate-900 rounded-full p-0.5" />
        )}
        {status === 'incorrect' && (
          <XCircle className="absolute -top-1 -right-1 h-5 w-5 text-red-400 bg-slate-900 rounded-full p-0.5" />
        )}
        {isFlagged && (
          <Flag className="absolute -top-1 -left-1 h-5 w-5 text-amber-400 bg-slate-900 rounded-full p-0.5 fill-amber-400" />
        )}
        <span>
          {index + 1}
        </span>
      </Button>
    );
  };

  const renderQuestionList = (indices: number[]) => {
    if (indices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400" dir="ltr" style={{direction: 'ltr'}}>
          <p className="text-lg">No questions to display</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-3" style={{ direction: 'ltr', textAlign: 'left' }}>
        {indices.map(index => renderQuestionButton(index))}
      </div>
    );
  };

  return (
    <Card className="relative bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 h-full rounded-2xl">
      <CardHeader className="pb-4 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
        <CardTitle className="text-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
              <Target className="h-6 w-6 text-slate-300" />
            </div>
            <span className="font-bold text-slate-100">
              {simulationType === "question-set" 
                ? `Set ${setNumber || ''}` 
                : "Quick Navigation"}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 rounded-lg border border-slate-600/50" 
            onClick={onResetProgress}
            title="Reset Progress"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 p-6">
        {/* Statistics */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl p-4 text-center border border-green-500/30 shadow-lg">
              <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-green-300 font-semibold">Correct</div>
              <div className="text-2xl font-bold text-green-400">{correctAnswersCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-xl p-4 text-center border border-red-500/30 shadow-lg">
              <XCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <div className="text-sm text-red-300 font-semibold">Wrong</div>
              <div className="text-2xl font-bold text-red-400">{incorrectQuestions.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 rounded-xl p-4 text-center border border-amber-500/30 shadow-lg">
              <Flag className="h-6 w-6 text-amber-400 mx-auto mb-2 fill-amber-400" />
              <div className="text-sm text-amber-300 font-semibold">Saved</div>
              <div className="text-2xl font-bold text-amber-400">{flaggedQuestions.length}</div>
            </div>
          </div>
        </div>

        {/* Question List Tabs - Mobile Optimized */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600/50 h-auto p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 min-h-[36px] text-xs sm:text-sm font-medium"
            >
              <span className="hidden sm:inline">All ({totalQuestions})</span>
              <span className="sm:hidden">All</span>
              <span className="sm:hidden block text-xs">({totalQuestions})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="unanswered" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 min-h-[36px] text-xs sm:text-sm font-medium"
            >
              <span className="hidden sm:inline">Unanswered ({unansweredQuestions.length})</span>
              <span className="sm:hidden">Unans</span>
              <span className="sm:hidden block text-xs">({unansweredQuestions.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="incorrect" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 min-h-[36px] text-xs sm:text-sm font-medium"
            >
              <span className="hidden sm:inline">Wrong ({incorrectQuestions.length})</span>
              <span className="sm:hidden">Wrong</span>
              <span className="sm:hidden block text-xs">({incorrectQuestions.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="flagged" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 min-h-[36px] text-xs sm:text-sm font-medium"
            >
              <span className="hidden sm:inline">Saved ({flaggedQuestions.length})</span>
              <span className="sm:hidden">Saved</span>
              <span className="sm:hidden block text-xs">({flaggedQuestions.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50 shadow-lg">
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

        <div className="mt-4 flex justify-center items-center gap-4 text-sm text-slate-400" dir="ltr" style={{direction: 'ltr'}}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500 border border-green-400"></div>
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500 border border-red-400"></div>
            <span>Wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-amber-500 border border-amber-400"></div>
            <span>Saved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationPanel;
