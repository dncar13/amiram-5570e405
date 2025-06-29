
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SimulationSettingsProvider } from "@/context/SimulationSettingsContext";
import Index from "./pages/Index";
import Topics from "./pages/Topics";
import TopicQuestions from "./pages/TopicQuestions";
import Simulation from "./pages/Simulation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Premium from "./pages/Premium";
import UserAccount from "./pages/UserAccount";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import PracticeOptions from "./pages/PracticeOptions";
import QuestionsSetPreparation from "./pages/QuestionsSetPreparation";
import QuestionsSets from "./pages/QuestionsSets";
import PracticeSets from "./pages/PracticeSets";
import Simulations from "./pages/Simulations";
import SimulationsEntry from "./pages/SimulationsEntry";
import SimulationSetup from "./pages/SimulationSetup";
import FullSimulation from "./pages/FullSimulation";
import SimulationByType from "./pages/SimulationByType";
import SimulationByDifficulty from "./pages/SimulationByDifficulty";
import SimulationHistory from "./pages/SimulationHistory";
import IntermediateScreen from "./pages/IntermediateScreen";
import ReadingComprehensionTopics from "./pages/ReadingComprehensionTopics";
import SavedQuestionViewer from "./pages/SavedQuestionViewer";
import ProgressStats from "./pages/ProgressStats";
import ThankYou from "./pages/ThankYou";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SimulationSettingsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/topics" element={<Topics />} />
                <Route path="/topics/:topicId/intro" element={<TopicQuestions />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/practice-options" element={<PracticeOptions />} />
                <Route path="/questions-set-preparation" element={<QuestionsSetPreparation />} />
                <Route path="/questions-sets" element={<QuestionsSets />} />
                <Route path="/practice-sets" element={<PracticeSets />} />
                <Route path="/simulations" element={<Simulations />} />
                <Route path="/simulations-entry" element={<SimulationsEntry />} />
                <Route path="/simulation-setup" element={<SimulationSetup />} />
                <Route path="/full-simulation" element={<FullSimulation />} />
                <Route path="/simulation-by-type" element={<SimulationByType />} />
                <Route path="/simulation-by-difficulty" element={<SimulationByDifficulty />} />
                <Route path="/simulation-history" element={<SimulationHistory />} />
                <Route path="/intermediate" element={<IntermediateScreen />} />
                <Route path="/reading-comprehension-topics" element={<ReadingComprehensionTopics />} />
                <Route path="/saved-questions" element={<SavedQuestionViewer />} />
                <Route path="/progress-stats" element={<ProgressStats />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SimulationSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
