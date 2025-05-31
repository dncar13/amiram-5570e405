
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
    <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-electric-navy mb-4">
              {isQuestionSet ? "אין שאלות בקבוצה זו" : "אין שאלות לנושא זה"}
            </h2>
            <p className="text-electric-slate mb-6">
              {isQuestionSet 
                ? "קבוצת שאלות זו אינה מכילה שאלות כרגע. אנא בחר קבוצה אחרת."
                : "נושא זה אינו מכיל שאלות כרגע. אנא בחר נושא אחר."
              }
            </p>
            <Button 
              onClick={() => navigate(isQuestionSet ? "/questions-sets" : "/topics")}
              className="bg-electric-blue hover:bg-blue-600"
            >
              {isQuestionSet ? "חזרה לרשימת הקבוצות" : "חזרה לרשימת הנושאים"}
            </Button>
          </div>
        </div>
      </main>
    </RTLWrapper>
  );
};
