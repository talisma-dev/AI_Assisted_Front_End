
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LogOut, Play, Target, Users, Brain, Sparkles, Zap, ArrowRight } from "lucide-react";

const ModuleLanding = () => {
  const { state, logout } = useApp();
  const navigate = useNavigate();

  const handleTakeAssessment = () => {
    navigate("/assessment");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-400/10 to-cyan-400/10 rounded-full animate-pulse delay-1000"></div>
        
        {/* Neural Network Nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/40 rounded-full animate-neural-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/40 rounded-full animate-neural-pulse delay-500"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-cyan-400/40 rounded-full animate-neural-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400/40 rounded-full animate-neural-pulse delay-700"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg animate-glow">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 animate-spin" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome back, {state.currentUser?.username}!
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <p className="text-muted-foreground text-lg">Your AI-powered learning continues</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:from-red-600 hover:via-pink-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-3"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Enhanced Module Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                <CardTitle className="flex items-center gap-3 relative">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Current Module
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  {state.currentUser?.module_name}
                </h2>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Module ID: {state.currentUser?.module_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                    <span>Course ID: {state.currentUser?.course_id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10"></div>
                <CardTitle className="flex items-center gap-3 relative">
                  <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Learning Objectives
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Bayesian Inference principles</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse delay-200"></div>
                    <span className="text-sm font-medium">Feature Selection techniques</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-400"></div>
                    <span className="text-sm font-medium">Linear & Non-Linear Models</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse delay-600"></div>
                    <span className="text-sm font-medium">Gaussian distributions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Assessment Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-lg hover:shadow-3xl transition-all duration-500 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-shimmer"></div>
              <div className="relative">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl animate-glow">
                      <Brain className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 animate-bounce">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Assessment Ready
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Unleash the power of artificial intelligence to evaluate your mastery across all learning objectives
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">16</div>
                  <div className="text-sm text-muted-foreground font-medium">AI Questions</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">4</div>
                  <div className="text-sm text-muted-foreground font-medium">Core Concepts</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">~30</div>
                  <div className="text-sm text-muted-foreground font-medium">Minutes</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">MCQ</div>
                  <div className="text-sm text-muted-foreground font-medium">Format</div>
                </div>
              </div>
              
              <Button 
                onClick={handleTakeAssessment}
                size="lg"
                className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <Play className="h-7 w-7 animate-pulse" />
                  <span>Begin AI Assessment</span>
                  <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform duration-200" />
                </div>
              </Button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                <span>Powered by Advanced Machine Learning</span>
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleLanding;
