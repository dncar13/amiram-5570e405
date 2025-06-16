
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/data/questionsData";
import { CheckCircle, XCircle, Flag, Trash, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { useIsMobile } from "@/hooks/use-mobile";

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
  simulationType?: "topic" | "question-set";
  setNumber?: number;
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
  const isMobile = useIsMobile();

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
    
    // Mobile-specific button size
    const buttonSize = isMobile ? "h-10 w-10" : "h-12 w-12";
    const textSize = isMobile ? "text-sm" : "text-lg";
    
    return (
      <Button
        key={index}
        variant={isCurrent ? "default" : "outline"}
        size="sm"
        className={cn(
          "relative rounded-xl transition-all duration-200 hover:scale-105 border-2 font-semibold shadow-lg",
          buttonSize,
          textSize,
          isCurrent && "bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 border-blue-400 text-white",
          !isCurrent && status === 'correct' && "bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/50 hover:border-green-400 text-green-400 hover:bg-green-600/30",
          !isCurrent && status === 'incorrect' && "bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/50 hover:border-red-400 text-red-400 hover:bg-red-600/30",
          !isCurrent && status === 'unanswered' && isFlagged && "bg-gradient-to-br from-amber-600/20 to-amber-700/20 border-amber-500/50 hover:border-amber-400 text-amber-400 hover:bg-amber-600/30",
          !isCurrent && status === 'unanswered' && !isFlagged && "bg-slate-800/60 border-slate-600/50 hover:border-slate-500 text-slate-300 hover:bg-slate-700/60"
        )}
        onClick={() => onNavigateToQuestion(index)}
      >
        {status === 'correct' && (
          <CheckCircle className={cn("absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 text-green-400", isMobile ? "h-4 w-4" : "h-5 w-5")} />
        )}
        {status === 'incorrect' && (
          <XCircle className={cn("absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 text-red-400", isMobile ? "h-4 w-4" : "h-5 w-5")} />
        )}
        {isFlagged && (
          <Flag className={cn("absolute -top-1 -left-1 bg-slate-900 rounded-full p-0.5 text-amber-400 fill-amber-400", isMobile ? "h-4 w-4" : "h-5 w-5")} />
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
          <p className={cn("text-center", isMobile ? "text-base" : "text-lg")}>No questions to display</p>
        </div>
      );
    }
    
    // Fixed columns on mobile, auto-fit on desktop (edge to edge)
    return (
      <div
        className={cn(
          "grid gap-2 justify-center w-full mx-auto",
          "grid-cols-5 sm:grid-cols-6 md:grid-cols-7",
          "lg:grid-cols-[repeat(auto-fit,minmax(48px,1fr))]"
        )}
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        {indices.map(index => renderQuestionButton(index))}
      </div>
    );
  };

  return (
    <Card className="relative bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-0 h-full rounded-2xl">
      <CardHeader className="pb-4 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-t-2xl">
        <CardTitle className={cn("flex justify-between items-center", isMobile ? "text-lg" : "text-xl")}>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-600/50">
              <Target className={cn("text-slate-300", isMobile ? "h-5 w-5" : "h-6 w-6")} />
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
            className={cn("text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 rounded-lg border border-slate-600/50", isMobile ? "h-8 w-8" : "h-10 w-10")}
            onClick={onResetProgress}
            title="Reset Progress"
          >
            <Trash className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className={cn(isMobile ? "pt-4 p-4" : "pt-6 p-6")}>
        {/* Statistics */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl p-4 text-center border border-green-500/30 shadow-lg">
              <CheckCircle className={cn("text-green-400 mx-auto mb-2", isMobile ? "h-5 w-5" : "h-6 w-6")} />
              <div className={cn("text-green-300 font-semibold", isMobile ? "text-xs" : "text-sm")}>Correct</div>
              <div className={cn("font-bold text-green-400", isMobile ? "text-xl" : "text-2xl")}>{correctAnswersCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-xl p-4 text-center border border-red-500/30 shadow-lg">
              <XCircle className={cn("text-red-400 mx-auto mb-2", isMobile ? "h-5 w-5" : "h-6 w-6")} />
              <div className={cn("text-red-300 font-semibold", isMobile ? "text-xs" : "text-sm")}>Wrong</div>
              <div className={cn("font-bold text-red-400", isMobile ? "text-xl" : "text-2xl")}>{incorrectQuestions.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 rounded-xl p-4 text-center border border-amber-500/30 shadow-lg">
              <Flag className={cn("text-amber-400 mx-auto mb-2 fill-amber-400", isMobile ? "h-5 w-5" : "h-6 w-6")} />
              <div className={cn("text-amber-300 font-semibold", isMobile ? "text-xs" : "text-sm")}>Saved</div>
              <div className={cn("font-bold text-amber-400", isMobile ? "text-xl" : "text-2xl")}>{flaggedQuestions.length}</div>
            </div>
          </div>
        </div>

        {/* Question List Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600/50 h-auto p-1">
            <TabsTrigger 
              value="all" 
              className={cn(
                "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 font-medium",
                isMobile ? "min-h-[32px] text-[10px]" : "min-h-[36px] text-xs sm:text-sm"
              )}
            >
              <div className="flex flex-col items-center">
                <span className={cn(isMobile ? "text-[10px]" : "text-xs sm:text-sm")}>All</span>
                <span className={cn("text-[10px]", isMobile ? "block" : "hidden sm:inline")}>({totalQuestions})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="unanswered" 
              className={cn(
                "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 font-medium",
                isMobile ? "min-h-[32px] text-[10px]" : "min-h-[36px] text-xs sm:text-sm"
              )}
            >
              <div className="flex flex-col items-center">
                <span className={cn(isMobile ? "text-[10px]" : "text-xs sm:text-sm")}>Unans</span>
                <span className={cn("text-[10px]", isMobile ? "block" : "hidden sm:inline")}>({unansweredQuestions.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="incorrect" 
              className={cn(
                "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 font-medium",
                isMobile ? "min-h-[32px] text-[10px]" : "min-h-[36px] text-xs sm:text-sm"
              )}
            >
              <div className="flex flex-col items-center">
                <span className={cn(isMobile ? "text-[10px]" : "text-xs sm:text-sm")}>Wrong</span>
                <span className={cn("text-[10px]", isMobile ? "block" : "hidden sm:inline")}>({incorrectQuestions.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="flagged" 
              className={cn(
                "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-300 rounded-lg py-2 px-1 font-medium",
                isMobile ? "min-h-[32px] text-[10px]" : "min-h-[36px] text-xs sm:text-sm"
              )}
            >
              <div className="flex flex-col items-center">
                <span className={cn(isMobile ? "text-[10px]" : "text-xs sm:text-sm")}>Saved</span>
                <span className={cn("text-[10px]", isMobile ? "block" : "hidden sm:inline")}>({flaggedQuestions.length})</span>
              </div>
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

        <div className={cn("mt-4 flex justify-center items-center gap-4 text-slate-400", isMobile ? "text-xs" : "text-sm")} dir="ltr" style={{direction: 'ltr'}}>
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full bg-green-500 border border-green-400", isMobile ? "h-3 w-3" : "h-4 w-4")}></div>
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full bg-red-500 border border-red-400", isMobile ? "h-3 w-3" : "h-4 w-4")}></div>
            <span>Wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full bg-amber-500 border border-amber-400", isMobile ? "h-3 w-3" : "h-4 w-4")}></div>
            <span>Saved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationPanel;
