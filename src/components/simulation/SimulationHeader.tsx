import { BookOpen, CheckCircle2, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SimulationHeaderProps {
  topicTitle: string;
  isCompleted: boolean;
  currentScore?: number;
  progressPercentage?: number;
  answeredQuestionsCount?: number;
  totalQuestions?: number;
  simulationType?: "practice" | "exam";
  isQuestionSet?: boolean; // Added this prop
}

const SimulationHeader = ({ 
  topicTitle, 
  isCompleted, 
  currentScore, 
  progressPercentage,
  answeredQuestionsCount,
  totalQuestions,
  simulationType = "practice",
  isQuestionSet = false
}: SimulationHeaderProps) => {
  return (
    <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-3 rounded-xl">
            <BookOpen className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {isQuestionSet ? "קבוצת שאלות: " : "סימולציה: "}{topicTitle}
            </h1>
            <div className="text-sm text-gray-600 mt-1">
              {simulationType === "practice" ? "מצב תרגול" : "מצב מבחן"}
            </div>
          </div>
        </div>
        
        {answeredQuestionsCount !== undefined && totalQuestions !== undefined && (
          <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="h-4 w-4 text-slate-600" />
              <span className="font-medium">התקדמות כללית</span>
            </div>
            <div className="font-semibold text-gray-700">
              {answeredQuestionsCount} / {totalQuestions} שאלות
            </div>
          </div>
        )}
      </div>
      
      <div className="flex mt-4 items-center text-gray-600">
        {isCompleted ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>הסימולציה הושלמה</span>
            {currentScore !== undefined && (
              <span className="mr-2 font-medium">
                ציון: {currentScore}%
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>סימולציה בתהליך</span>
            {progressPercentage !== undefined && (
              <span className="mr-2 text-slate-600 font-medium">
                התקדמות: {progressPercentage}%
              </span>
            )}
          </div>
        )}
      </div>
      
      {progressPercentage !== undefined && (
        <div className="mt-3">
          <Progress 
            value={progressPercentage} 
            className="h-2" 
            indicatorClassName={
              progressPercentage >= 70 ? "bg-green-500" : 
              progressPercentage >= 30 ? "bg-slate-600" : 
              "bg-amber-500"
            }
          />
        </div>
      )}
      
      <p className="mt-4 text-gray-600 max-w-2xl">
        ענה על כל השאלות כדי לסיים את הסימולציה. 
        ניתן לעבור בין השאלות בחופשיות ולסמן שאלות ל��דיקה מאוחרת.
      </p>
    </div>
  );
};

export default SimulationHeader;
