
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptySimulationProps {
  isQuestionSet: boolean;
  questionType?: string;
}

export const EmptySimulation = ({ isQuestionSet, questionType }: EmptySimulationProps) => {
  const navigate = useNavigate();
  
  const getEmptyMessage = () => {
    if (questionType) {
      return `No questions found for type "${questionType}"`;
    }
    return isQuestionSet ? "No questions in this set" : "No questions for this topic";
  };

  const getDescription = () => {
    if (questionType) {
      return `There are no questions of type "${questionType}" available at the moment. Please try another question type.`;
    }
    return isQuestionSet 
      ? "This question set does not contain any questions at the moment. Please select another set."
      : "This topic does not contain any questions at the moment. Please select another topic.";
  };

  const getBackPath = () => {
    if (questionType) {
      return "/simulation-by-type";
    }
    return isQuestionSet ? "/questions-sets" : "/simulations-entry";
  };

  const getBackText = () => {
    if (questionType) {
      return "Back to Question Types";
    }
    return isQuestionSet ? "Back to Question Sets" : "Back to Topics";
  };
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-5xl" dir="ltr" style={{direction: 'ltr'}}>
          <div className="text-left py-12">
            <h2 className="text-2xl font-bold text-electric-navy mb-4">
              {getEmptyMessage()}
            </h2>
            <p className="text-electric-slate mb-6">
              {getDescription()}
            </p>
            <Button 
              onClick={() => navigate(getBackPath())}
              className="bg-electric-blue hover:bg-blue-600"
            >
              {getBackText()}
            </Button>
          </div>
        </div>
      </main>
    </RTLWrapper>
  );
};
