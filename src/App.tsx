
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Topics from "./pages/Topics";
import TopicQuestions from "./pages/TopicQuestions";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UserAccount from "./pages/UserAccount";
import Premium from "./pages/Premium";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import Simulation from "./pages/Simulation";
import SimulationHistory from "./pages/SimulationHistory";
import Categories from "./pages/Categories";
import ProgressStats from "./pages/ProgressStats";
import Simulations from "./pages/Simulations";
import SavedQuestionViewer from "./pages/SavedQuestionViewer";
import ReadingComprehensionTopics from "./pages/ReadingComprehensionTopics";
import FullSimulation from "./pages/FullSimulation";
import SimulationsEntry from "./pages/SimulationsEntry";
import SimulationByType from "./pages/SimulationByType";
import SimulationByDifficulty from "./pages/SimulationByDifficulty";
import PracticeOptions from "./pages/PracticeOptions";
import PracticeSets from "./pages/PracticeSets";
import QuestionsSets from "./pages/QuestionsSets";
import QuestionsSetPreparation from "./pages/QuestionsSetPreparation";
import SimulationSetup from "./pages/SimulationSetup";
import IntermediateScreen from "./pages/IntermediateScreen";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/topics/:topicId" element={<TopicQuestions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account" element={<UserAccount />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/simulation/:simulationId" element={<Simulation />} />
              <Route path="/simulation/full" element={<FullSimulation />} />
              <Route path="/simulation/story/:storyTitle" element={<Simulation />} />
              <Route path="/simulation/type/:type" element={<SimulationByType />} />
              <Route path="/simulation/type/:type/:difficulty" element={<PracticeOptions />} />
              <Route path="/simulation/type/:type/:difficulty/sets" element={<PracticeSets />} />
              <Route path="/simulation/:type/:difficulty" element={<SimulationByDifficulty />} />
              <Route path="/simulation-history" element={<SimulationHistory />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/progress" element={<ProgressStats />} />
              <Route path="/simulations" element={<Simulations />} />
              <Route path="/simulations-entry" element={<SimulationsEntry />} />
              <Route path="/saved-questions" element={<SavedQuestionViewer />} />
              <Route path="/reading-comprehension" element={<ReadingComprehensionTopics />} />
              <Route path="/questions-sets" element={<QuestionsSets />} />
              <Route path="/questions-set-preparation/:setId" element={<QuestionsSetPreparation />} />
              <Route path="/simulation-setup" element={<SimulationSetup />} />
              <Route path="/intermediate/:topicId" element={<IntermediateScreen />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
