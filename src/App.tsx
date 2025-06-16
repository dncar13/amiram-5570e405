
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SimulationSettingsProvider } from "@/context/SimulationSettingsContext";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SimulationSetup from "./pages/SimulationSetup";
import Simulation from "./pages/Simulation";
import TopicQuestions from "./pages/TopicQuestions"; 
import SavedQuestionViewer from "./pages/SavedQuestionViewer";
import NotFound from "./pages/NotFound";
import Premium from "./pages/Premium";
import ThankYou from "./pages/ThankYou";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminPanel from "./pages/AdminPanel";
import UserAccount from "./pages/UserAccount";
import QuestionsSets from "./pages/QuestionsSets";
import QuestionsSetPreparation from "./pages/QuestionsSetPreparation";
import Categories from "./pages/Categories";
import SimulationsEntry from "./pages/SimulationsEntry";
import SimulationByType from "./pages/SimulationByType";
import SimulationByDifficulty from "./pages/SimulationByDifficulty";
import FullSimulation from "./pages/FullSimulation";
import SimulationHistory from "./pages/SimulationHistory";
import ProgressStats from "./pages/ProgressStats";
import ReadingComprehensionTopics from "./pages/ReadingComprehensionTopics";
import PracticeOptions from "./pages/PracticeOptions";
import PracticeSets from "./pages/PracticeSets";

// Enhanced ScrollToTop component with smooth behavior
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Smooth scroll with a slight delay for better UX
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return null;
};

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94], // Apple's easing curve
  duration: 0.4
};

// Enhanced AnimatedRoutes component with better transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/topics" element={<SimulationsEntry />} />
          <Route path="/topics/list" element={<SimulationsEntry />} />
          <Route path="/simulations-entry/list" element={<SimulationsEntry />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/topics/:topicId/intro" element={<SimulationSetup />} />
          <Route path="/simulation/:topicId" element={<Simulation />} />
          <Route path="/questions" element={<TopicQuestions />} />
          <Route path="/saved-questions" element={<SavedQuestionViewer />} />
          <Route path="/questions/category/:categoryId" element={<TopicQuestions />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/questions" element={<AdminPanel />} />
          <Route path="/admin/topics" element={<AdminPanel />} />
          <Route path="/questions-sets" element={<QuestionsSets />} />
          <Route path="/questions-set/:setId/intro" element={<QuestionsSetPreparation />} />
          <Route path="/questions-set/:setId" element={<Simulation />} />
          
          {/* New Reading Comprehension Routes */}
          <Route path="/reading-comprehension" element={<ReadingComprehensionTopics />} />
          <Route path="/simulation/story/:storyId" element={<Simulation />} />
          
          {/* Existing Simulations Entry Routes */}
          <Route path="/simulations-entry" element={<SimulationsEntry />} />
          <Route path="/simulation/full" element={<FullSimulation />} />
          <Route path="/simulation/full/start" element={<Simulation />} />
          <Route path="/simulation/by-type" element={<SimulationsEntry />} />
          <Route path="/simulation/by-difficulty" element={<SimulationsEntry />} />
          <Route path="/simulation-history" element={<SimulationHistory />} />
          <Route path="/progress-stats" element={<ProgressStats />} />
          <Route path="/simulation/type/:type" element={<SimulationByType />} />
          <Route path="/simulation/difficulty/:level" element={<SimulationByDifficulty />} />
          
          {/* Practice options and sets routes */}
          <Route path="/simulation/type/:type/:difficulty" element={<PracticeOptions />} />
          <Route path="/simulation/type/:type/:difficulty/sets" element={<PracticeSets />} />
          
          {/* Individual simulation routes */}
          <Route path="/simulation/:type/:difficulty" element={<Simulation />} />
          <Route path="/simulation/:type/timed" element={<Simulation />} />
          <Route path="/simulation/:type/practice" element={<Simulation />} />
          <Route path="/simulation/:type/adaptive" element={<Simulation />} />
          <Route path="/simulation/difficulty/:level/:type" element={<Simulation />} />
          <Route path="/simulation/difficulty/:level/timed" element={<Simulation />} />
          <Route path="/simulation/difficulty/:level/adaptive" element={<Simulation />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SimulationSettingsProvider>
          <div dir="rtl" className="rtl">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedRoutes />
            </BrowserRouter>
          </div>
        </SimulationSettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
