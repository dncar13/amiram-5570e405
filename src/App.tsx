import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SimulationSettingsProvider } from "@/context/SimulationSettingsContext";
import { AnimatePresence, motion, Variants, Transition } from 'framer-motion';
import { useEffect } from 'react';

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
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
import AdminUsers from "./pages/admin/AdminUsers";
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
import SimulationSets from "./pages/SimulationSets";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Migration from "./pages/Migration";
import ProgressTrackingTest from "./components/test/ProgressTrackingTest";
import SetProgressDebug from "./components/SetProgressDebug";
import CookieConsent from "./components/CookieConsent";
import AnalyticsDashboard from "./components/dev/AnalyticsDashboard";
import { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

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

const pageTransition: Transition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1], // Smooth easing curve (cubic-bezier)
  duration: 0.4
};

// Conditional AnalyticsDashboard wrapper to prevent unnecessary hook execution
const ConditionalAnalyticsDashboard = () => {
  const { isAdmin } = useAuth();
  const isDevEnvironment = import.meta.env.DEV || 
    (typeof window !== 'undefined' && 
     (window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovableproject.com')));
  const debugModeEnabled = typeof window !== 'undefined' && 
    localStorage.getItem('amiram_analytics_debug') === 'true';

  // Only render AnalyticsDashboard if user should have access
  if (isDevEnvironment || isAdmin || debugModeEnabled) {
    return <AnalyticsDashboard />;
  }
  
  return null;
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
          
          {/* Homepage redirects */}
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/index/" element={<Navigate to="/" replace />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/topics" element={<SimulationsEntry />} />
          <Route path="/topics/list" element={<SimulationsEntry />} />
          <Route path="/simulations-entry/list" element={<SimulationsEntry />} />
          <Route path="/categories" element={<Categories />} />
          
          <Route path="/simulation/:topicId" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/questions" element={<TopicQuestions />} />
          <Route path="/saved-questions" element={<SavedQuestionViewer />} />
          <Route path="/questions/category/:categoryId" element={<TopicQuestions />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/migration" element={<Migration />} />
          <Route path="/account" element={
            <ProtectedRoute requireAuth={true}>
              <UserAccount />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <AdminPanel />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <AdminUsers />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/questions" element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <AdminPanel />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/topics" element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <AdminPanel />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/questions-sets" element={<QuestionsSets />} />
          <Route path="/questions-set/:setId/intro" element={<QuestionsSetPreparation />} />
          <Route path="/questions-set/:setId" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          
          {/* New Reading Comprehension Routes */}
          <Route path="/reading-comprehension" element={<ReadingComprehensionTopics />} />
          <Route path="/simulation/story/:storyId" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          
          {/* Existing Simulations Entry Routes */}
          <Route path="/simulations-entry" element={<SimulationsEntry />} />
          <Route path="/simulation/full" element={
            <ErrorBoundary>
              <FullSimulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/by-type" element={<SimulationsEntry />} />
          <Route path="/simulation/by-difficulty" element={<SimulationsEntry />} />
          <Route path="/simulation-history" element={
            <ProtectedRoute requireAuth={true}>
              <SimulationHistory />
            </ProtectedRoute>
          } />
          <Route path="/progress-stats" element={
            <ProtectedRoute requireAuth={true}>
              <ProgressStats />
            </ProtectedRoute>
          } />
          <Route path="/test/progress-tracking" element={
            <ProtectedRoute requireAuth={true}>
              <ProgressTrackingTest />
            </ProtectedRoute>
          } />
          
          {/* Debug route - only in development */}
          {process.env.NODE_ENV === 'development' && (
            <Route path="/debug/set-progress" element={
              <ProtectedRoute requireAuth={true}>
                <SetProgressDebug />
              </ProtectedRoute>
            } />
          )}
          <Route path="/simulation/type/:type" element={
            <ErrorBoundary>
              <SimulationByType />
            </ErrorBoundary>
          } />
          <Route path="/simulation/difficulty/:level" element={
            <ErrorBoundary>
              <SimulationByDifficulty />
            </ErrorBoundary>
          } />
          
          {/* Practice options and sets routes */}
          <Route path="/simulation/type/:type/:difficulty" element={<PracticeOptions />} />
          <Route path="/simulation/type/:type/:difficulty/sets" element={<SimulationSets />} />
          
          {/* Individual simulation routes */}
          <Route path="/simulation/:type/:difficulty" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/:type/timed" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/:type/practice" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/:type/adaptive" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/difficulty/:level/:type" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/difficulty/:level/timed" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/difficulty/:level/adaptive" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          <Route path="/simulation/full/start" element={
            <ErrorBoundary>
              <Simulation />
            </ErrorBoundary>
          } />
          
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
              <CookieConsent />
              <ConditionalAnalyticsDashboard />
            </BrowserRouter>
          </div>
        </SimulationSettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
