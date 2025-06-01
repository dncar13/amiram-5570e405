
import { toast } from "@/hooks/use-toast";
import QuestionCard from "./QuestionCard";
import QuestionCardWithStory from "./QuestionCardWithStory";
import SimulationResults from "./SimulationResults";
import SimulationProgress from "./SimulationProgress";
import NavigationPanel from "./NavigationPanel";
import { Question } from "@/data/questionsData";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import QuestionEditor from "@/components/admin/QuestionEditor";
import { updateQuestion } from "@/services/questionsService";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimulationContentProps {
  simulationComplete: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  remainingTime: number;
  isTimerActive: boolean;
  currentQuestion?: Question; // Make this optional
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  score: number;
  questionsData: Question[];
  userAnswers: (number | null)[];
  questionFlags: boolean[];
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  currentScorePercentage: number;
  examMode: boolean;
  showAnswersImmediately?: boolean;
  isQuestionSet?: boolean;
  setNumber?: number;
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: (index?: number) => void;
  onNavigateToQuestion: (index: number) => void;
  onRestart: () => void;
  onBackToTopics: () => void;
  onResetProgress: () => void;
}

const SimulationContent = ({
  simulationComplete,
  currentQuestionIndex,
  totalQuestions,
  remainingTime,
  isTimerActive,
  currentQuestion,
  selectedAnswerIndex,
  isAnswerSubmitted,
  showExplanation,
  score,
  questionsData,
  userAnswers,
  questionFlags,
  answeredQuestionsCount,
  correctQuestionsCount,
  progressPercentage,
  currentScorePercentage,
  examMode,
  showAnswersImmediately = true,
  isQuestionSet = false,
  setNumber,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleQuestionFlag,
  onNavigateToQuestion,
  onRestart,
  onBackToTopics,
  onResetProgress,
}: SimulationContentProps) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [showNavigationPanel, setShowNavigationPanel] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Log the current question data to help debug
  useEffect(() => {
    if (!currentQuestion) {
      console.warn("Current question is undefined at index", currentQuestionIndex);
      console.log("Questions array length:", questionsData.length);
    }
  }, [currentQuestion, currentQuestionIndex, questionsData]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [currentQuestionIndex]);

  const handleEditQuestion = (question: Question) => {
    setQuestionToEdit(question);
    setIsEditing(true);
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    updateQuestion(updatedQuestion);
    setIsEditing(false);
    setQuestionToEdit(null);
    toast({
      title: "השאלה עודכנה בהצלחה",
      description: "השינויים נשמרו במערכת",
      duration: 3000,
    });
  };

  // Check if current question has a reading passage
  const hasReadingPassage = (question: Question) => {
    return (question.passageWithLines && question.passageWithLines.length > 0) ||
           (question.passageTitle || question.passageText);
  };

  // If no questions are available, redirect to empty state
  if (questionsData.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md mx-auto text-center">
          <h3 className="font-semibold text-lg text-amber-700 mb-3">אין שאלות זמינות</h3>
          <p className="text-amber-600 mb-6">
            לא נמצאו שאלות לסימולציה זו. ייתכן שקבוצת השאלות עדיין לא הושלמה או שאירעה שגיאה בטעינת השאלות.
          </p>
          <Button onClick={onBackToTopics} className="bg-amber-600 hover:bg-amber-700 text-white">
            חזרה לרשימת הנושאים
          </Button>
        </div>
      </div>
    );
  }

  if (simulationComplete) {
    return (
      <div className="max-w-3xl mx-auto">
        <SimulationResults 
          score={score}
          questionsData={questionsData}
          userAnswers={userAnswers}
          onRestart={onRestart}
          onBackToTopics={onBackToTopics}
          questionFlags={questionFlags}
          answeredQuestionsCount={answeredQuestionsCount}
          correctQuestionsCount={correctQuestionsCount}
          onNavigateToQuestion={onNavigateToQuestion}
          isQuestionSet={isQuestionSet}
        />
      </div>
    );
  }

  // Determine if we should show the progress bar (only for non-story questions)
  const shouldShowProgressBar = !currentQuestion || !hasReadingPassage(currentQuestion);

  return (
    <div className="w-full" ref={contentRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-4 mb-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold">סימולציה - {isQuestionSet ? `קבוצה ${setNumber}` : "נושא"}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowNavigationPanel(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation Panel - Desktop (only for non-story questions) */}
          {shouldShowProgressBar && (
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-4">
                <NavigationPanel 
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={totalQuestions}
                  userAnswers={userAnswers}
                  questionsData={questionsData}
                  questionFlags={questionFlags}
                  onNavigateToQuestion={onNavigateToQuestion}
                  onToggleQuestionFlag={onToggleQuestionFlag}
                  progressPercentage={progressPercentage}
                  currentScorePercentage={currentScorePercentage}
                  onResetProgress={onResetProgress}
                  simulationType={isQuestionSet ? "question-set" : "topic"}
                  setNumber={setNumber}
                />
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className={cn("flex-1", shouldShowProgressBar ? "max-w-4xl" : "max-w-7xl mx-auto")}>
            {/* Progress Bar (only for non-story questions) */}
            {shouldShowProgressBar && (
              <SimulationProgress 
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                remainingTime={remainingTime}
                isTimerActive={isTimerActive}
                answeredQuestionsCount={answeredQuestionsCount}
                correctQuestionsCount={correctQuestionsCount}
                simulationType={isQuestionSet ? "question-set" : "topic"}
              />
            )}
            
            {/* Question Card - Choose the right component */}
            {currentQuestion && hasReadingPassage(currentQuestion) ? (
              <QuestionCardWithStory 
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                selectedAnswerIndex={selectedAnswerIndex}
                isAnswerSubmitted={isAnswerSubmitted}
                showExplanation={showExplanation}
                isFlagged={questionFlags[currentQuestionIndex] ?? false}
                examMode={examMode}
                showAnswersImmediately={showAnswersImmediately}
                answeredQuestionsCount={answeredQuestionsCount}
                correctQuestionsCount={correctQuestionsCount}
                onAnswerSelect={onAnswerSelect}
                onSubmitAnswer={onSubmitAnswer}
                onNextQuestion={onNextQuestion}
                onPreviousQuestion={onPreviousQuestion}
                onToggleExplanation={onToggleExplanation}
                onToggleQuestionFlag={() => onToggleQuestionFlag()}
                onEditQuestion={isAdmin && currentQuestion ? handleEditQuestion : undefined}
              />
            ) : (
              <QuestionCard 
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                selectedAnswerIndex={selectedAnswerIndex}
                isAnswerSubmitted={isAnswerSubmitted}
                showExplanation={showExplanation}
                isFlagged={questionFlags[currentQuestionIndex] ?? false}
                examMode={examMode}
                showAnswersImmediately={showAnswersImmediately}
                onAnswerSelect={onAnswerSelect}
                onSubmitAnswer={onSubmitAnswer}
                onNextQuestion={onNextQuestion}
                onPreviousQuestion={onPreviousQuestion}
                onToggleExplanation={onToggleExplanation}
                onToggleQuestionFlag={() => onToggleQuestionFlag()}
                onEditQuestion={isAdmin && currentQuestion ? handleEditQuestion : undefined}
              />
            )}
          </div>
        </div>

        {/* Mobile Navigation Panel (only for non-story questions) */}
        {shouldShowProgressBar && (
          <Sheet open={showNavigationPanel} onOpenChange={setShowNavigationPanel}>
            <SheetContent side="right" className="w-full max-w-md p-0">
              <div className="h-full overflow-auto">
                <NavigationPanel 
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={totalQuestions}
                  userAnswers={userAnswers}
                  questionsData={questionsData}
                  questionFlags={questionFlags}
                  onNavigateToQuestion={(index) => {
                    onNavigateToQuestion(index);
                    setShowNavigationPanel(false);
                  }}
                  onToggleQuestionFlag={onToggleQuestionFlag}
                  progressPercentage={progressPercentage}
                  currentScorePercentage={currentScorePercentage}
                  onResetProgress={onResetProgress}
                  simulationType={isQuestionSet ? "question-set" : "topic"}
                  setNumber={setNumber}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Admin Question Editor */}
        {isAdmin && (
          <Sheet open={isEditing} onOpenChange={setIsEditing}>
            <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-right">עריכת שאלה</SheetTitle>
              </SheetHeader>
              
              {questionToEdit && (
                <QuestionEditor
                  question={questionToEdit}
                  onSave={handleSaveQuestion}
                  onCancel={() => {
                    setIsEditing(false);
                    setQuestionToEdit(null);
                  }}
                />
              )}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default SimulationContent;
