
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { SimulationSettingsProvider } from "@/context/SimulationSettingsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import all pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Topics from "@/pages/Topics";
import Simulations from "@/pages/Simulations";
import SimulationsEntry from "@/pages/SimulationsEntry";
import Simulation from "@/pages/Simulation";
import FullSimulation from "@/pages/FullSimulation";
import FullExamPreparation from "@/pages/FullExamPreparation";
import SimulationSetup from "@/pages/SimulationSetup";
import IntermediateScreen from "@/pages/IntermediateScreen";
import SimulationByType from "@/pages/SimulationByType";
import SimulationByDifficulty from "@/pages/SimulationByDifficulty";
import TopicQuestions from "@/pages/TopicQuestions";
import Categories from "@/pages/Categories";
import ReadingComprehensionTopics from "@/pages/ReadingComprehensionTopics";
import QuestionsSetPreparation from "@/pages/QuestionsSetPreparation";
import QuestionsSets from "@/pages/QuestionsSets";
import PracticeSets from "@/pages/PracticeSets";
import PracticeOptions from "@/pages/PracticeOptions";
import UserAccount from "@/pages/UserAccount";
import SavedQuestionViewer from "@/pages/SavedQuestionViewer";
import Premium from "@/pages/Premium";
import ThankYou from "@/pages/ThankYou";
import AdminPanel from "@/pages/AdminPanel";
import SimulationHistory from "@/pages/SimulationHistory";
import ProgressStats from "@/pages/ProgressStats";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SimulationSettingsProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/topics" element={<Topics />} />
                <Route path="/simulations" element={<Simulations />} />
                <Route path="/simulations-entry" element={<SimulationsEntry />} />
                <Route path="/simulation/:topicId" element={<Simulation />} />
                <Route path="/simulation/full/preparation" element={<FullExamPreparation />} />
                <Route path="/simulation/full" element={<FullSimulation />} />
                <Route path="/simulation-setup/:topicId" element={<SimulationSetup />} />
                <Route path="/intermediate/:id" element={<IntermediateScreen />} />
                <Route path="/simulation-by-type/:type" element={<SimulationByType />} />
                <Route path="/simulation-by-difficulty/:difficulty" element={<SimulationByDifficulty />} />
                <Route path="/topic/:topicId/questions" element={<TopicQuestions />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/reading-comprehension" element={<ReadingComprehensionTopics />} />
                <Route path="/questions-set/:setId/preparation" element={<QuestionsSetPreparation />} />
                <Route path="/questions-set/:setId" element={<Simulation />} />
                <Route path="/questions-sets" element={<QuestionsSets />} />
                <Route path="/practice-sets" element={<PracticeSets />} />
                <Route path="/practice-options" element={<PracticeOptions />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/saved-questions" element={<SavedQuestionViewer />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/simulation-history" element={<SimulationHistory />} />
                <Route path="/progress-stats" element={<ProgressStats />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </SimulationSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
