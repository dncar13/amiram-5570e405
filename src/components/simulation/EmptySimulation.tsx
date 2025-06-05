
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptySimulationProps {
  isQuestionSet: boolean;
}

export const EmptySimulation = ({ isQuestionSet }: EmptySimulationProps) => {
  const navigate = useNavigate();
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden">      <Header />      <main className="flex-grow py-4 md:py-6">        <div className="container mx-auto px-4 max-w-5xl" dir="ltr" style={{direction: 'ltr'}}>
          <div className="text-left py-12">
            <h2 className="text-2xl font-bold text-electric-navy mb-4">
              {isQuestionSet ? "No questions in this set" : "No questions for this topic"}
            </h2>            <p className="text-electric-slate mb-6">
              {isQuestionSet 
                ? "This question set does not contain any questions at the moment. Please select another set."
                : "This topic does not contain any questions at the moment. Please select another topic."
              }
            </p>
            <Button 
              onClick={() => navigate(isQuestionSet ? "/questions-sets" : "/simulations-entry")}
              className="bg-electric-blue hover:bg-blue-600"
            >
              {isQuestionSet ? "Back to Question Sets" : "Back to Topics"}
            </Button>
          </div>
        </div>
      </main>
    </RTLWrapper>
  );
};
