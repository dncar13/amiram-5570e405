import React, { useState } from 'react';
import { Question } from "@/data/types/questionTypes";
import QuestionCard from "./QuestionCard";
import SimulationResults from "./SimulationResults";
import NavigationPanel from "./NavigationPanel";
import RestartConfirmationDialog from "@/components/dialogs/RestartConfirmationDialog";

interface SimulationContentProps {
  simulationComplete: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  remainingTime: number | null;
  isTimerActive: boolean;
  currentQuestion: Question | undefined;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  score: number;
  questionsData: Question[];
  userAnswers: Record<number, number>;
  questionFlags: Record<number, boolean>;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  currentScorePercentage: number;
  examMode: boolean;
  showAnswersImmediately: boolean;
  isQuestionSet?: boolean;
  setNumber?: number;
  questionContainerRef?: React.RefObject<HTMLDivElement>;
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
  onNavigateToQuestion: (index: number) => void;
  onRestart: () => void;
  onBackToTopics: () => string;
  onResetProgress: () => void;
  onFinishSimulation?: () => void;
  // New: whether this simulation is a reading-comprehension story flow
  isStorySimulation?: boolean;
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
  showAnswersImmediately,
  isQuestionSet,
  setNumber,
  questionContainerRef,
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
  onFinishSimulation,
  isStorySimulation
}: SimulationContentProps) => {
  const [showRestartDialog, setShowRestartDialog] = useState(false);

  // Convert Record objects to arrays for child components that expect arrays
  const userAnswersArray: (number | null)[] = Array.from({ length: totalQuestions }, (_, i) => userAnswers[i] ?? null);
  const questionFlagsArray: boolean[] = Array.from({ length: totalQuestions }, (_, i) => questionFlags[i] ?? false);

  const handleRestartClick = () => {
    setShowRestartDialog(true);
  };

  const handleConfirmRestart = async () => {
    onRestart();
  };

  if (simulationComplete) {
    return (
      <>
        <SimulationResults
          score={score}
          questionsData={questionsData}
          userAnswers={userAnswersArray}
          questionFlags={questionFlagsArray}
          answeredQuestionsCount={answeredQuestionsCount}
          correctQuestionsCount={correctQuestionsCount}
          onRestart={handleRestartClick}
          onBackToTopics={onBackToTopics}
          onNavigateToQuestion={onNavigateToQuestion}
          isQuestionSet={isQuestionSet}
        />
        
        <RestartConfirmationDialog
          isOpen={showRestartDialog}
          onClose={() => setShowRestartDialog(false)}
          onConfirm={handleConfirmRestart}
          setName="הסימולציה"
        />
      </>
    );
  }

  // Show loading if we don't have questions or current question
  if (totalQuestions === 0 || !currentQuestion) {
    return (
      <div className="w-full max-w-none min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-600 border-r-blue-600/50 border-b-blue-600/30 border-l-blue-600/10 rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-slate-300">טוען שאלות...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <>
      <div className="w-full max-w-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen px-2 sm:px-4">
        {/* Navigation Panel */}
        <div className="mb-4 sm:mb-8">
          <NavigationPanel
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            userAnswers={userAnswersArray}
            questionsData={questionsData}
            questionFlags={questionFlagsArray}
            progressPercentage={progressPercentage}
            currentScorePercentage={currentScorePercentage}
            onNavigateToQuestion={onNavigateToQuestion}
            onToggleQuestionFlag={onToggleQuestionFlag}
            onResetProgress={handleRestartClick}
            simulationType={isQuestionSet ? "question-set" : "topic"}
            setNumber={setNumber}
          />
        </div>

        {/* Two-column layout for reading comprehension story simulations */}
        {isStorySimulation && currentQuestion.passageText ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" ref={questionContainerRef} dir="ltr">
            {/* Left: Passage */}
            <div className="order-1 lg:order-none">
              <div 
                className="bg-slate-700/50 rounded-xl p-3 sm:p-6 border border-slate-600/30 backdrop-blur-sm h-full"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left' }}
              >
                <h4 className="font-bold text-slate-200 mb-2 sm:mb-4 text-sm sm:text-lg">
                  {currentQuestion.passageTitle || 'קטע לקריאה'}
                </h4>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {currentQuestion.passageText}
                </div>
              </div>
            </div>

            {/* Right: Question */}
            <div className="order-2 lg:order-none" dir="rtl">
              <QuestionCard
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                selectedAnswerIndex={selectedAnswerIndex}
                isAnswerSubmitted={isAnswerSubmitted}
                showExplanation={showExplanation}
                isFlagged={questionFlags[currentQuestionIndex] || false}
                examMode={examMode}
                showAnswersImmediately={showAnswersImmediately}
                answeredQuestionsCount={answeredQuestionsCount}
                correctQuestionsCount={correctQuestionsCount}
                progressPercentage={progressPercentage}
                onAnswerSelect={onAnswerSelect}
                onSubmitAnswer={onSubmitAnswer}
                onNextQuestion={onNextQuestion}
                onPreviousQuestion={onPreviousQuestion}
                onToggleExplanation={onToggleExplanation}
                onToggleQuestionFlag={onToggleQuestionFlag}
                onFinishSimulation={onFinishSimulation}
                // Hide passage inside the card since it's shown on the left
                showPassage={false}
              />
            </div>
          </div>
        ) : (
          // Default unified layout
          <div ref={questionContainerRef} className="max-w-none">
            <QuestionCard
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              selectedAnswerIndex={selectedAnswerIndex}
              isAnswerSubmitted={isAnswerSubmitted}
              showExplanation={showExplanation}
              isFlagged={questionFlags[currentQuestionIndex] || false}
              examMode={examMode}
              showAnswersImmediately={showAnswersImmediately}
              answeredQuestionsCount={answeredQuestionsCount}
              correctQuestionsCount={correctQuestionsCount}
              progressPercentage={progressPercentage}
              onAnswerSelect={onAnswerSelect}
              onSubmitAnswer={onSubmitAnswer}
              onNextQuestion={onNextQuestion}
              onPreviousQuestion={onPreviousQuestion}
              onToggleExplanation={onToggleExplanation}
              onToggleQuestionFlag={onToggleQuestionFlag}
              onFinishSimulation={onFinishSimulation}
            />
          </div>
        )}
      </div>
      
      <RestartConfirmationDialog
        isOpen={showRestartDialog}
        onClose={() => setShowRestartDialog(false)}
        onConfirm={handleConfirmRestart}
        setName="הסימולציה"
      />
    </>
  );
};

export default SimulationContent;
