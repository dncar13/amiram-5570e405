
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TopicSelection from "./pages/TopicSelection";
import Simulation from "./pages/Simulation";
import SimulationPage from "./pages/SimulationPage";
import PremiumPage from "./pages/PremiumPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/topics" element={<TopicSelection />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Unified simulation routes - handles both free and premium */}
          <Route path="/simulation/:topicId" element={<Simulation />} />
          <Route path="/simulation/set/:setId" element={<Simulation />} />
          <Route path="/simulation/type/:type" element={<SimulationPage />} />
          <Route path="/simulation/type/:type/:difficulty" element={<SimulationPage />} />
          <Route path="/simulation/type/:type/:difficulty/:mode" element={<SimulationPage />} />
          <Route path="/simulation/full" element={<SimulationPage />} />
          
          {/* Premium set routes - now handled by the main simulation system */}
          <Route path="/simulation/premium/:setId" element={<SimulationPage />} />
          
          {/* Story simulation routes */}
          <Route path="/simulation/story/:storyId" element={<SimulationPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
