import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SimulationSettingsProvider } from "@/context/SimulationSettingsContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import SkipNavigation from "@/components/accessibility/SkipNavigation";
import AccessibilityToolbar from "@/components/accessibility/AccessibilityToolbar";
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
import SimulationResults from "./pages/SimulationResults";
import WhatIsAmirant from "./pages/WhatIsAmirant";
import Terms from "./pages/Terms";
import AccessibilityStatement from "./pages/AccessibilityStatement";
import Articles from "./pages/Articles";
import ArticleTemplate from "./pages/ArticleTemplate";
import PresentSimple from "./pages/PresentSimple";
import PastSimple from "./pages/PastSimple";
import Future from "./pages/Future";
import PresentProgressive from "./pages/PresentProgressive";
import ArticlesAAnThe from "./pages/ArticlesAAnThe";
import QuestionForms from "./pages/QuestionForms";
import Negatives from "./pages/Negatives";
import PresentPerfect from "./pages/PresentPerfect";
import PastPerfect from "./pages/PastPerfect";
import PassiveVoice from "./pages/PassiveVoice";
import RelativeClauses from "./pages/RelativeClauses";
import ModalVerbs from "./pages/ModalVerbs";
import ComparativesSuperlatives from "./pages/ComparativesSuperlatives";
import Prepositions from "./pages/Prepositions";
import AdjectivesAdverbs from "./pages/AdjectivesAdverbs";
import CountableUncountable from "./pages/CountableUncountable";
import SubjectVerbAgreement from "./pages/SubjectVerbAgreement";
import WordOrder from "./pages/WordOrder";
import Conditionals from "./pages/Conditionals";
import GerundsInfinitives from "./pages/GerundsInfinitives";
import ReportedSpeech from "./pages/ReportedSpeech";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Migration from "./pages/Migration";
import ProgressTrackingTest from "./components/test/ProgressTrackingTest";
import SetProgressDebug from "./components/SetProgressDebug";
import CookieConsent from "./components/CookieConsent";
import AnalyticsDashboard from "./components/dev/AnalyticsDashboard";
import RouteTracker from "./components/RouteTracker";
import { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import CouponManagement from "./pages/CouponManagement";
import CouponUsageManagement from "./pages/CouponUsageManagement";
import analyticsService from "./services/analytics";
import ListeningQuestions from "./pages/ListeningQuestions";
import ListeningPractice from "./pages/ListeningPractice";
import ListeningContinuationSets from "./pages/ListeningContinuationSets";
import ListeningContinuationSet from "./pages/ListeningContinuationSet";
import ListeningContinuationSimulation from "./pages/ListeningContinuationSimulation";

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

// PRODUCTION SAFETY: Analytics Dashboard completely disabled in production
const ConditionalAnalyticsDashboard = () => {
  // STRICT development environment check only
  const isStrictDevelopment = import.meta.env.DEV && 
    (typeof window !== 'undefined' && 
     (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('lovableproject.com')));

  // Analytics dashboard ONLY in strict development environments
  if (isStrictDevelopment) {
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
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/present-simple" element={<PresentSimple />} />
          <Route path="/articles/past-simple" element={<PastSimple />} />
          <Route path="/articles/future" element={<Future />} />
          <Route path="/articles/present-progressive" element={<PresentProgressive />} />
          <Route path="/articles/articles" element={<ArticlesAAnThe />} />
          <Route path="/articles/question-forms" element={<QuestionForms />} />
          <Route path="/articles/negatives" element={<Negatives />} />
          <Route path="/articles/present-perfect" element={<PresentPerfect />} />
          <Route path="/articles/past-perfect" element={<PastPerfect />} />
          <Route path="/articles/passive-voice" element={<PassiveVoice />} />
          <Route path="/articles/relative-clauses" element={<RelativeClauses />} />
          <Route path="/articles/modal-verbs" element={<ModalVerbs />} />
          <Route path="/articles/comparatives-superlatives" element={<ComparativesSuperlatives />} />
          <Route path="/articles/prepositions" element={<Prepositions />} />
          <Route path="/articles/adjectives-adverbs" element={<AdjectivesAdverbs />} />
          <Route path="/articles/countable-uncountable" element={<CountableUncountable />} />
          <Route path="/articles/subject-verb-agreement" element={<SubjectVerbAgreement />} />
          <Route path="/articles/word-order" element={<WordOrder />} />
          <Route path="/articles/conditionals" element={<Conditionals />} />
          <Route path="/articles/gerunds-infinitives" element={<GerundsInfinitives />} />
          <Route path="/articles/reported-speech" element={<ReportedSpeech />} />
          <Route path="/articles/:articleId" element={<ArticleTemplate />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
          <Route path="/what-is-amirant" element={<WhatIsAmirant />} />
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
          <Route path="/admin/coupons" element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <CouponManagement />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/coupons/usage" element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <CouponUsageManagement />
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

          {/* New Listening Routes */}
          <Route path="/listening" element={<ListeningQuestions />} />
          <Route path="/listening/practice" element={<ListeningPractice />} />
          <Route path="/listening/comprehension" element={<ListeningPractice />} />
          <Route path="/listening/word-formation" element={<ListeningPractice />} />
          <Route path="/listening/grammar-context" element={<ListeningPractice />} />
          <Route path="/listening/continuation" element={<ListeningContinuationSets />} />
          <Route path="/listening/continuation/:setId" element={<ListeningContinuationSet />} />
          
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
          <Route path="/simulation/results/:type/:difficulty" element={
            <ProtectedRoute requireAuth={true}>
              <SimulationResults />
            </ProtectedRoute>
          } />
          
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

// Initialize Analytics Service
const initializeAnalytics = () => {
  try {
    console.log('🔧 Initializing Analytics Service...');
    analyticsService.initialize();
    console.log('✅ Analytics Service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Analytics Service:', error);
  }
};

// Initialize analytics when app loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
  } else {
    initializeAnalytics();
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <SimulationSettingsProvider>
            <div dir="rtl" className="rtl">
              <SkipNavigation />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <RouteTracker />
                <AnimatedRoutes />
                <CookieConsent />
                <AccessibilityToolbar />
                <ConditionalAnalyticsDashboard />
              </BrowserRouter>
            </div>
          </SimulationSettingsProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
