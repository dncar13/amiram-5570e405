
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { questionsData } from "@/data/questionsData";

function createSimulationsList(totalQuestions: number) {
  const questionsPerSimulation = 50;
  const numSimulations = Math.ceil(totalQuestions / questionsPerSimulation);
  const availableSimulations = Math.min(20, numSimulations);
  
  return Array.from({ length: availableSimulations }, (_, i) => {
    const startIdx = i * questionsPerSimulation;
    const remainingQuestions = totalQuestions - startIdx;
    const simulationQuestionCount = Math.min(remainingQuestions, questionsPerSimulation);
    
    return {
      id: i + 1,
      name: `סימולציה ${i + 1}`,
      questionCount: simulationQuestionCount
    };
  }).filter(sim => sim.questionCount > 0);
}

const Simulations = () => {
  const navigate = useNavigate();
  const currentQuestionCount = questionsData.length; // Use actual questions count from data
  const simulations = createSimulationsList(currentQuestionCount);
  
  console.log(`Total questions in database: ${currentQuestionCount}`);
  console.log(`Number of simulations created: ${simulations.length}`);
  simulations.forEach(sim => {
    console.log(`Simulation ${sim.id} has ${sim.questionCount} questions`);
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <RTLWrapper>
          <section className="electric-gradient text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">סימולציות מבחן מקיף</h1>
              <p className="text-lg max-w-2xl mx-auto mb-6">
                בחר אחת מ-{simulations.length} הסימולציות לתרגול מקיף
              </p>
              
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate("/topics")}
              >
                <ArrowRight className="ml-2 h-4 w-4" /> חזרה למסך הנושאים
              </Button>
            </div>
          </section>
          
          <section className="py-8 bg-gradient-to-b from-electric-gray/30 to-white/80">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulations.map((simulation) => (
                  <Card 
                    key={simulation.id} 
                    className="flex flex-col p-6 border-t-4 border-t-blue-500"
                  >
                    <h3 className="text-lg font-semibold mb-3 text-right">{simulation.name}</h3>
                    <p className="text-sm text-electric-slate mb-4 text-right">
                      סימולציה מקיפה עם שאלות מכל הנושאים
                    </p>
                    
                    <div className="flex justify-between text-xs text-electric-slate mb-4">
                      <span>{simulation.questionCount} שאלות</span>
                      <span>קושי: משתנה</span>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/simulation/${simulation.id}`)}
                      >
                        התחל סימולציה
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 bg-electric-gray/10 rounded-lg p-6 text-center">
                <p className="text-electric-slate mb-4">
                  ככל שנוסיף יותר שאלות למערכת, מספר השאלות בכל סימולציה יגדל.
                  המטרה הסופית היא להגיע ל-1000 שאלות מחולקות ל-20 סימולציות.
                </p>
                <div className="font-semibold">
                  נוספו עד כה: {currentQuestionCount} מתוך 1000 שאלות
                </div>
              </div>
            </div>
          </section>
        </RTLWrapper>
      </main>
      
      <Footer />
    </div>
  );
};

export default Simulations;
