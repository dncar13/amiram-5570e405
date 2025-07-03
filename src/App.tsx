
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Premium from "@/pages/Premium";
import PasswordReset from "@/pages/PasswordReset";

// Account pages
import Account from "@/pages/Account";

// Questions pages
import QuestionsMenu from "@/pages/QuestionsMenu";
import Questions from "@/pages/Questions";
import QuestionsSets from "@/pages/QuestionsSets";
import QuestionSetIntro from "@/pages/QuestionSetIntro";
import SavedQuestions from "@/pages/SavedQuestions";

// Study pages
import StudyModes from "@/pages/StudyModes";
import ReadingComprehension from "@/pages/ReadingComprehension";
import StorySimulation from "@/pages/StorySimulation";

// Simulation pages
import SimulationsEntry from "@/pages/SimulationsEntry";
import Simulation from "@/pages/Simulation";
import PracticeOptions from "@/pages/PracticeOptions";
import SimulationHistory from "@/pages/SimulationHistory";

// Practice pages
import PracticeDifficulty from "@/pages/PracticeDifficulty";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/password-reset" element={<PasswordReset />} />

              {/* Account routes - protected */}
              <Route path="/account/*" element={
                <ProtectedRoute requireAuth={true}>
                  <Account />
                </ProtectedRoute>
              } />

              {/* Questions routes */}
              <Route path="/questions-menu" element={<QuestionsMenu />} />
              <Route path="/questions/:topicId" element={<Questions />} />
              <Route path="/questions-sets" element={<QuestionsSets />} />
              <Route path="/questions-set/:setId/intro" element={<QuestionSetIntro />} />
              <Route path="/saved-questions" element={<SavedQuestions />} />

              {/* Study routes */}
              <Route path="/study-modes" element={<StudyModes />} />
              <Route path="/reading-comprehension" element={<ReadingComprehension />} />
              <Route path="/reading-comprehension/:storyId" element={<StorySimulation />} />

              {/* Simulation routes */}
              <Route path="/simulations-entry/*" element={<SimulationsEntry />} />
              <Route path="/practice-options" element={<PracticeOptions />} />
              <Route path="/simulation/:topicId" element={<Simulation />} />
              <Route path="/simulation/set/:setId" element={<Simulation />} />
              <Route path="/simulation/difficulty/:difficulty/:type" element={<Simulation />} />
              <Route path="/simulation/type/:type" element={<Simulation />} />
              <Route path="/simulation/full" element={<Simulation />} />
              <Route path="/simulation/story/:storyId" element={<Simulation />} />
              <Route path="/simulation-history" element={
                <ProtectedRoute requireAuth={true}>
                  <SimulationHistory />
                </ProtectedRoute>
              } />

              {/* Practice routes */}
              <Route path="/practice/:difficulty" element={<PracticeDifficulty />} />
            </Routes>
          </div>
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
