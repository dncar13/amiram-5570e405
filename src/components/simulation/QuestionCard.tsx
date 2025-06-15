
import UnifiedQuestionCard from "@/components/common/UnifiedQuestionCard";
import { Question } from "@/data/questionsData";

interface QuestionCardProps {
  currentQuestion: Question | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  isFlagged: boolean;
  examMode: boolean;
  showAnswersImmediately: boolean;
  answeredQuestionsCount?: number;
  correctQuestionsCount?: number;
  progressPercentage?: number;
  onAnswerSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onToggleExplanation: () => void;
  onToggleQuestionFlag: () => void;
}

const QuestionCard = (props: QuestionCardProps) => {
  return (
    <UnifiedQuestionCard
      {...props}
      variant="simulation"
    />
  );
};

export default QuestionCard;
