
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Login from "./pages/Login";
import ModuleLanding from "./pages/ModuleLanding";
import Assessment from "./pages/Assessment";
import Evaluation from "./pages/Evaluation";
import Learning from "./pages/Learning";
import LearningResource from "./components/LearningResource";
import ProtectedRoute from "./components/ProtectedRoute";
import CongratulationsModal from "./components/CongratulationsModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
