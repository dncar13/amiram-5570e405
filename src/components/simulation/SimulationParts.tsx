
import React from "react";
import { Button } from "@/components/ui/button";
import { Rocket, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SimulationButtonsProps {
  onStartNew: () => void;
  onContinue?: () => void;
  hasSavedProgress: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  className?: string;
}

export const SimulationButtons: React.FC<SimulationButtonsProps> = ({
  onStartNew,
  onContinue,
  hasSavedProgress,
  currentQuestion,
  totalQuestions,
  className = ""
}) => {
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <Button
        className="bg-electric-blue hover:bg-blue-600 text-white py-6 text-lg font-medium"
        onClick={onStartNew}
      >
        <span className="flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6" />
          התחל סימולציה חדשה
        </span>
      </Button>
      
      {hasSavedProgress && onContinue && (
        <Button
          className="bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium"
          onClick={onContinue}
        >
          <span className="flex items-center justify-center gap-2">
            <PlayCircle className="h-6 w-6" />
            המשך סימולציה
            {currentQuestion !== undefined && totalQuestions !== undefined && (
              <span> (שאלה {currentQuestion} מתוך {totalQuestions})</span>
            )}
          </span>
        </Button>
      )}
    </div>
  );
};
