import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface SimulationProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  remainingTime: number;
  isTimerActive: boolean;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  simulationType?: "topic" | "question-set"; // Added this prop
}

const SimulationProgress = ({
  currentQuestionIndex,
  totalQuestions,
  remainingTime,
  isTimerActive,
  answeredQuestionsCount,
  correctQuestionsCount,
  simulationType = "topic"
}: SimulationProgressProps) => {
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            זמן נותר: {formatTime(remainingTime)}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-700">
          שאלה {currentQuestionIndex + 1} / {totalQuestions}
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>{correctQuestionsCount} נכונות</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>{answeredQuestionsCount} ענו</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationProgress;
