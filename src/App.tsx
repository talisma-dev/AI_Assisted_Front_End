import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import AnimatedBackground from "./components/AnimatedBackground";
import Assessment from "./pages/Assessment";
import Evaluation from "./pages/Evaluation";
import Learning from "./pages/Learning";
import LearningResource from "./components/LearningResource";
import CongratulationsModal from "./components/CelebrationEffect";
import React from "react";
import ScrollToTop from "@/components/ScrollToTop";
import Microconcept from './pages/Microconcept';
import BlackboardLoading from './pages/BlackboardLoading';
import DirectLinkLoading from './pages/DirectLinkLoading';

const queryClient = new QueryClient();
const base = import.meta.env.BASE_URL; // 🧠 reads "/AiAssistedLearning/" from vite.config.js

const AppContent = () => {
  return (
    <div className="min-h-screen " style={{ backgroundColor: "transparent" }}>
      <Routes>
        <Route path="/lms" element={<BlackboardLoading />} />
        <Route path="/direct" element={<DirectLinkLoading />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/assessment/:concept" element={<Assessment />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/learning/:concept" element={<Learning />} />
        <Route path="/learning/:concept/microconcept/:microconcept" element={<Microconcept />} />
        <Route path="/learning/:concept/resource/:resourceId" element={<LearningResource />} />
      </Routes>
      <CongratulationsModal />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={base}>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
