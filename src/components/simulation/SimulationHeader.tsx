
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
  className?: string;
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
  className = ""
}: SimulationHeaderProps) => {
  return (
    <div className={`w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-start mb-8 w-full">
        <div className="flex items-center space-x-4" dir="ltr">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg border border-blue-500/50">
            <BarChart2 className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-slate-100 text-left tracking-tight" dir="ltr">
              {topicTitle}
            </h1>
            <div className="text-lg text-slate-300 mt-2 font-medium" dir="ltr">
              Interactive Simulation • {simulationType === "practice" ? "Practice Mode" : "Exam Mode"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Section */}
      {progressPercentage !== undefined && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-lg font-medium text-slate-300" dir="ltr">
            <span>Overall Progress</span>
            <span className="text-slate-200">{progressPercentage}% Complete</span>
          </div>
          <div className="relative bg-slate-700/50 rounded-full p-1 border border-slate-600/50">
            <Progress 
              value={progressPercentage} 
              className="h-4 bg-transparent rounded-full overflow-hidden" 
              indicatorClassName={`transition-all duration-700 ease-out rounded-full shadow-lg ${
                progressPercentage >= 70 ? "bg-gradient-to-r from-green-500 to-green-600" : 
                progressPercentage >= 30 ? "bg-gradient-to-r from-blue-500 to-blue-600" : 
                "bg-gradient-to-r from-amber-500 to-amber-600"
              }`}
            />
            {progressPercentage > 8 && (
              <div 
                className="absolute top-0 left-0 h-full flex items-center justify-center text-sm font-bold text-white"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 20 && `${progressPercentage}%`}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Question Counter */}
      {answeredQuestionsCount !== undefined && totalQuestions && (
        <div className="mt-6 flex items-center justify-between bg-slate-800/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-slate-600/50 shadow-lg">
          <div className="text-lg text-slate-300 font-medium" dir="ltr">
            Questions Answered
          </div>
          <div className="text-2xl font-bold text-slate-100" dir="ltr">
            {answeredQuestionsCount} / {totalQuestions}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationHeader;
