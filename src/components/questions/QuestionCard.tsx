
import { useState, useEffect } from "react";
import { Question } from "@/data/questionsData";
import { useAuth } from "@/context/AuthContext";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import UnifiedQuestionCard from "@/components/common/UnifiedQuestionCard";

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
  const { isPremium } = useAuth();
  const { isQuestionSaved, saveQuestion, removeQuestionById } = useSavedQuestions();
  const [localIsSaved, setLocalIsSaved] = useState(false);
  const [remainingTime, setRemainingTime] = useState(examMode ? 60 : 0);

  useEffect(() => {
    if (currentQuestion) {
      setLocalIsSaved(isQuestionSaved(currentQuestion.id));
    }
  }, [currentQuestion, isQuestionSaved]);

  useEffect(() => {
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
    return null;
  }

  return (
    <UnifiedQuestionCard
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={totalQuestions}
      selectedAnswerIndex={selectedAnswerIndex}
      isAnswerSubmitted={isAnswerSubmitted}
      showExplanation={showExplanation}
      isFlagged={isFlagged}
      examMode={examMode}
      showAnswersImmediately={showAnswersImmediately}
      remainingTime={examMode ? remainingTime : undefined}
      onAnswerSelect={onAnswerSelect}
      onSubmitAnswer={onSubmitAnswer}
      onNextQuestion={onNextQuestion}
      onPreviousQuestion={onPreviousQuestion}
      onToggleExplanation={onToggleExplanation}
      onToggleQuestionFlag={onToggleQuestionFlag}
      onEditQuestion={onEditQuestion}
      variant="practice"
    />
  );
};

export default QuestionCard;
