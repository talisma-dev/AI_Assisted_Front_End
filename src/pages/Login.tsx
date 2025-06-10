
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap, Lock, User, Brain, Sparkles, Zap } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, state } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (state.currentUser) {
    navigate("/module");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (login(username, password)) {
      toast.success("Login successful! Welcome to your learning journey.");
      navigate("/module");
    } else {
      toast.error("Invalid credentials. Please check your username and password.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Neural Network Animation */}
        <div className="absolute top-20 left-20 w-64 h-64 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-neural-pulse"></div>
          <div className="absolute top-8 left-8 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-neural-pulse delay-500"></div>
          <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-neural-pulse delay-1000"></div>
        </div>
        
        <div className="absolute bottom-20 right-20 w-48 h-48 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-l from-green-400 to-teal-400 rounded-full animate-neural-pulse delay-700"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-cyan-400/60 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-400/60 rounded-full animate-float delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-5 h-5 bg-yellow-400/60 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-purple-400/60 rounded-full animate-float delay-300"></div>
        
        {/* Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Enhanced Header */}
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl shadow-2xl animate-glow">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-spin" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Learning Platform
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
              <p className="text-gray-300 text-lg">The Future of Education</p>
              <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Enhanced Login Card */}
          <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-lg animate-scale-in">
            <CardHeader className="space-y-1 pb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
              <div className="relative">
                <CardTitle className="text-2xl font-semibold text-center text-white">
                  Student Portal
                </CardTitle>
                <CardDescription className="text-center text-gray-300 text-base">
                  Access your personalized AI-powered learning journey
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-white">Username</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-200" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 hover:border-cyan-400/50 focus:border-cyan-400 transition-all duration-200 h-12"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 hover:border-purple-400/50 focus:border-purple-400 transition-all duration-200 h-12"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-8 h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Connecting to AI...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-5 w-5" />
                        Enter Learning Portal
                      </>
                    )}
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Demo Credentials */}
          <div className="text-center text-sm text-gray-300 animate-fade-in bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <p className="mb-2 text-cyan-400 font-medium">🚀 Demo Credentials:</p>
            <div className="space-y-1 font-mono text-xs">
              <p className="text-green-400">Ankul / Ankul123</p>
              <p className="text-blue-400">Riya / Riya123</p>
              <p className="text-purple-400">Donson / Donson123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
