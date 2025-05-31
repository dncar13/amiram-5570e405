
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SimulationSettingsProvider } from "@/context/SimulationSettingsContext";
import { useEffect } from 'react';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Topics from "./pages/Topics";
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

// ScrollToTop component that uses the location to scroll on every navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const queryClient = new QueryClient();

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
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/topics" element={<Topics />} />
                <Route path="/topics/list" element={<Topics />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </SimulationSettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
