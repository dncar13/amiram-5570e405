import { CheckCircle2, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SimulationHeaderProps {
  topicTitle: string;
  isCompleted: boolean;
  currentScore?: number;
  progressPercentage?: number;
  answeredQuestionsCount?: number;
  totalQuestions?: number;
  simulationType?: "practice" | "exam";
  isQuestionSet?: boolean;
  className?: string; // Add custom className support
}

const SimulationHeader = ({ 
  topicTitle, 
  isCompleted, 
  currentScore, 
  progressPercentage,
  answeredQuestionsCount,
  totalQuestions,
  simulationType = "practice",
  isQuestionSet = false,
  className = "" // Default empty string
}: SimulationHeaderProps) => {
  return (
    // Remove any centering and force left alignment
    <div className={`w-full bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl shadow-lg border border-slate-200/50 backdrop-blur-sm ${className}`}>
      {/* Header Section - Force Left Alignment */}
      <div className="flex items-center justify-start mb-6 w-full">
        <div className="flex items-center space-x-4" dir="ltr">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-md">
            <BarChart2 className="h-7 w-7 text-white" />
          </div>
          <div className="text-left">
            {/* Use dynamic title instead of hardcoded */}
            <h1 className="text-3xl font-bold text-slate-800 text-left tracking-tight" dir="ltr">
              {topicTitle}
            </h1>
            <div className="text-base text-slate-600 mt-1 font-medium" dir="ltr">
              Interactive Simulation • {simulationType === "practice" ? "Practice Mode" : "Exam Mode"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Section */}
      {progressPercentage !== undefined && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-slate-600" dir="ltr">
            <span>Overall Progress</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <div className="relative">
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-slate-200/50 rounded-full overflow-hidden" 
              indicatorClassName={`transition-all duration-500 ease-out rounded-full ${
                progressPercentage >= 70 ? "bg-gradient-to-r from-green-400 to-green-500" : 
                progressPercentage >= 30 ? "bg-gradient-to-r from-blue-400 to-blue-500" : 
                "bg-gradient-to-r from-amber-400 to-amber-500"
              }`}
            />
            {progressPercentage > 5 && (
              <div 
                className="absolute top-0 left-0 h-full flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 15 && `${progressPercentage}%`}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Question Counter */}
      {answeredQuestionsCount !== undefined && totalQuestions && (
        <div className="mt-4 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/40">
          <div className="text-sm text-slate-600 font-medium" dir="ltr">
            Questions Answered
          </div>
          <div className="text-lg font-bold text-slate-800" dir="ltr">
            {answeredQuestionsCount} / {totalQuestions}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationHeader;