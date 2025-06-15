
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/data/questionsData";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, Flag } from "lucide-react";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { saveQuickPracticeProgress } from "@/hooks/simulation/progressUtils";
import { useParams, useSearchParams } from "react-router-dom";

interface SimulationResultsProps {
  score: number;
  questionsData: Question[];
  userAnswers: (number | null)[];
  questionFlags: boolean[];
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  onRestart: () => void;
  onBackToTopics: () => void;
  onNavigateToQuestion: (index: number) => void;
  isQuestionSet?: boolean; // Added this prop
}

const SimulationResults = ({
  score,
  questionsData,
  userAnswers,
  questionFlags,
  answeredQuestionsCount,
  correctQuestionsCount,
  onRestart,
  onBackToTopics,
  onNavigateToQuestion,
  isQuestionSet = false
}: SimulationResultsProps) => {
  const { isQuestionSaved, saveQuestion, removeQuestionById } = useSavedQuestions();
  const [savedQuestionIds, setSavedQuestionIds] = useState<Set<string>>(() => new Set());
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const questionLimit = searchParams.get('limit');
  
  // Check if this is a quick practice simulation
  const isQuickPractice = Boolean(type && questionLimit && !searchParams.get('difficulty'));

  useEffect(() => {
    // Fix the type error by explicitly casting the map result to string[]
    const parsedQuestions = JSON.parse(localStorage.getItem('savedQuestions') || '[]');
    const savedIds = new Set(
      parsedQuestions.map((q: any) => String(q.id))
    ) as Set<string>;
    
    setSavedQuestionIds(savedIds);

    // Save quick practice progress when simulation is completed
    if (isQuickPractice && type) {
      saveQuickPracticeProgress(type, score, questionsData.length);
      console.log(`Quick practice progress saved for ${type}: ${score}% score`);
    }
  }, [isQuickPractice, type, score, questionsData.length]);

  const percentage = score;

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6 md:p-8">        <div className="text-center mb-6" dir="ltr" style={{direction: 'ltr'}}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {isQuestionSet ? "Question Set Completed!" : isQuickPractice ? "Quick Practice Completed!" : "Simulation Completed!"}
          </h2>
          <p className="text-gray-600">
            You answered {answeredQuestionsCount} out of {questionsData.length} questions.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div style={{ width: 180 }}>
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                textColor: percentage >= 60 ? "#4BB543" : "#FF4F4F",
                trailColor: "#E2E8F0",
                pathColor: percentage >= 60 ? "#4BB543" : "#FF4F4F",
                rotation: 0,
                strokeLinecap: "round",
                textSize: "24px",
                // Remove fontFamily property as it's not supported in buildStyles
              })}
            />
          </div>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center justify-start gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200" dir="ltr" style={{direction: 'ltr'}}>
            <CheckCircle className="text-green-600 h-5 w-5" />
            <div>
              <div className="text-sm font-medium text-green-700">Correct Answers</div>
              <div className="text-lg font-bold text-gray-800">{correctQuestionsCount}</div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200" dir="ltr" style={{direction: 'ltr'}}>
            <XCircle className="text-red-600 h-5 w-5" />
            <div>
              <div className="text-sm font-medium text-red-700">Wrong Answers</div>
              <div className="text-lg font-bold text-gray-800">{answeredQuestionsCount - correctQuestionsCount}</div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200" dir="ltr" style={{direction: 'ltr'}}>
            <Flag className="text-blue-600 h-5 w-5" />
            <div>
              <div className="text-sm font-medium text-blue-700">Flagged Questions</div>
              <div className="text-lg font-bold text-gray-800">{questionFlags.filter(flag => flag).length}</div>
            </div>
          </div>
        </div>
          <div className="flex flex-col gap-4 mt-8">
          <Button 
            onClick={onRestart}
            className="bg-electric-blue hover:bg-blue-600 text-white py-2"
            dir="ltr"
            style={{direction: 'ltr'}}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {isQuickPractice ? "Start New Quick Practice" : "Start New Simulation"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onBackToTopics}
            className="py-2"
            dir="ltr"
            style={{direction: 'ltr'}}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isQuestionSet ? "Back to Question Sets" : isQuickPractice ? "Back to Practice Options" : "Back to Topics"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationResults;
