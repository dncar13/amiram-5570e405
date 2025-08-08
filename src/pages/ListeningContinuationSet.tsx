import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { FileText, ArrowRight, Headphones } from "lucide-react";
import ListeningContinuationSimulation from "./ListeningContinuationSimulation";

const ListeningContinuationSimulationPage = () => {
  const { setId = "1" } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="py-6 border-b border-slate-700/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
                  <Headphones className="w-4 h-4" />
                  <span className="text-sm">Listening</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">השלמת קטע שמע — סט {setId}</h1>
                <p className="text-slate-300">4 קטעים ~20 שניות. בחירה של המשך מתאים מתוך 4 אפשרויות.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Simulation Content */}
        <section className="py-4">
          <div className="container mx-auto px-4 max-w-5xl">
            <ListeningContinuationSimulation setId={setId} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ListeningContinuationSimulationPage;
