import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import AnimatedBackground from "./components/AnimatedBackground";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ModuleLanding from "./pages/ModuleLanding";
import Assessment from "./pages/Assessment";
import Evaluation from "./pages/Evaluation";
import Learning from "./pages/Learning";
import LearningResource from "./components/LearningResource";
import ProtectedRoute from "./components/ProtectedRoute";
import CongratulationsModal from "./components/CongratulationsModal";
import React from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isLearningPage = location.pathname.startsWith("/learning");
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative w-full">
      {!isLearningPage && <AnimatedBackground />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/module" element={
          <ProtectedRoute>
            <ModuleLanding />
          </ProtectedRoute>
        } />
        <Route path="/assessment" element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        } />
        <Route path="/assessment/:concept" element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        } />
        <Route path="/evaluation" element={
          <ProtectedRoute>
            <Evaluation />
          </ProtectedRoute>
        } />
        <Route path="/learning/:concept" element={
          <ProtectedRoute>
            <Learning />
          </ProtectedRoute>
        } />
        <Route path="/learning/:concept/resource/:resourceId" element={
          <ProtectedRoute>
            <LearningResource />
          </ProtectedRoute>
        } />
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
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
