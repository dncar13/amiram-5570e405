
import { Question } from "@/data/questionsData";
import QuestionCard from "./QuestionCard";
import QuestionCardWithStory from "./QuestionCardWithStory";
import SimulationResults from "./SimulationResults";
import NavigationPanel from "./NavigationPanel";
import { ReadingPassage } from "./ReadingPassage";

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
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onToggleExplanation,
  onToggleQuestionFlag,
  onNavigateToQuestion,
  onRestart,
  onBackToTopics,
  onResetProgress
}: SimulationContentProps) => {

  // הוספת לוגים לדיבוג שאלות הבנת הנקרא
  console.log('[SimulationContent] Current question details:', {
    id: currentQuestion?.id,
    type: currentQuestion?.type,
    hasPassageText: !!currentQuestion?.passageText,
    hasPassageWithLines: !!(currentQuestion?.passageWithLines && currentQuestion.passageWithLines.length > 0),
    hasPassageTitle: !!currentQuestion?.passageTitle,
    questionText: currentQuestion?.text?.substring(0, 50) + '...'
  });

  // Convert Record objects to arrays for child components that expect arrays
  const userAnswersArray: (number | null)[] = Array.from({ length: totalQuestions }, (_, i) => userAnswers[i] ?? null);
  const questionFlagsArray: boolean[] = Array.from({ length: totalQuestions }, (_, i) => questionFlags[i] ?? false);

  if (simulationComplete) {
    return (
      <SimulationResults
        score={score}
        totalQuestions={totalQuestions}
        questionsData={questionsData}
        userAnswers={userAnswersArray}
        questionFlags={questionFlagsArray}
        currentScorePercentage={currentScorePercentage}
        examMode={examMode}
        showAnswersImmediately={showAnswersImmediately}
        isQuestionSet={isQuestionSet}
        setNumber={setNumber}
        onRestart={onRestart}
        onBackToTopics={onBackToTopics}
        onResetProgress={onResetProgress}
        onNavigateToQuestion={onNavigateToQuestion}
      />
    );
  }

  // בדיקה אם השאלה הנוכחית היא מסוג reading comprehension עם קטע
  const isReadingComprehensionWithPassage = currentQuestion?.type === 'reading-comprehension' && 
    (currentQuestion.passageText || (currentQuestion.passageWithLines && currentQuestion.passageWithLines.length > 0));

  console.log('[SimulationContent] Using question card type:', {
    isReadingComprehensionWithPassage,
    questionType: currentQuestion?.type,
    willUseStoryCard: isReadingComprehensionWithPassage
  });

  return (
    <div className="space-y-6">
      {/* Navigation Panel */}
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
        onResetProgress={onResetProgress}
        simulationType={isQuestionSet ? "question-set" : "topic"}
        setNumber={setNumber}
      />

      {/* Question Display */}
      {isReadingComprehensionWithPassage ? (
        <QuestionCardWithStory
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
        />
      ) : (
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
          onAnswerSelect={onAnswerSelect}
          onSubmitAnswer={onSubmitAnswer}
          onNextQuestion={onNextQuestion}
          onPreviousQuestion={onPreviousQuestion}
          onToggleExplanation={onToggleExplanation}
          onToggleQuestionFlag={onToggleQuestionFlag}
        />
      )}
    </div>
  );
};

export default SimulationContent;
