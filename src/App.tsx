
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Premium from "@/pages/Premium";

// Questions pages
import QuestionsSets from "@/pages/QuestionsSets";

// Study pages
import ReadingComprehensionTopics from "@/pages/ReadingComprehensionTopics";

// Simulation pages
import SimulationsEntry from "@/pages/SimulationsEntry";
import Simulation from "@/pages/Simulation";
import PracticeOptions from "@/pages/PracticeOptions";
import SimulationHistory from "@/pages/SimulationHistory";

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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/premium" element={<Premium />} />

              {/* Questions routes */}
              <Route path="/questions-sets" element={<QuestionsSets />} />

              {/* Study routes */}
              <Route path="/reading-comprehension" element={<ReadingComprehensionTopics />} />

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
