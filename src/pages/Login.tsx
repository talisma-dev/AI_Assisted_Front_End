import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Brain, Cpu, CircuitBoard, BookOpen, Sparkles, Zap } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  engagement: 'Low' | 'High';
  performance: 'Low' | 'High';
  username: string;
  password: string;
}

const students: StudentData[] = [
  { id: "S001", name: "Robert Garcia", engagement: "Low", performance: "Low", username: "Ankul", password: "Ankul123" },
  { id: "S002", name: "Priya Sharma", engagement: "High", performance: "Low", username: "Riya", password: "Riya123" },
  { id: "S003", name: "Leo Mark", engagement: "Low", performance: "High", username: "Donson", password: "Donson123" },
];

const FloatingIcon = ({ Icon, delay = 0, size = 24, className = "" }: { 
  Icon: any; 
  delay?: number; 
  size?: number; 
  className?: string;
}) => (
  <div 
    className={`absolute opacity-20 text-white animate-float ${className}`}
    style={{ 
      animationDelay: `${delay}s`,
      animationDuration: '6s'
    }}
  >
    <Icon size={size} />
  </div>
);

const NeuralNode = ({ delay = 0, className = "" }: { delay?: number; className?: string }) => (
  <div 
    className={`absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse ${className}`}
    style={{ animationDelay: `${delay}s` }}
  />
);

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { loginWithStudent, state } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (state.currentUser) {
    navigate("/module");
    return null;
  }

  const handleStudentSelect = async (student: StudentData) => {
    setSelectedStudent(student.id);
    setIsLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (loginWithStudent(student)) {
      toast.success(`🎉 Welcome ${student.name}! Loading your personalized module...`);
      setTimeout(() => navigate("/module"), 500);
    } else {
      toast.error("⚠️ Unable to access module. Please try again.");
    }
    
    setIsLoading(false);
    setSelectedStudent(null);
  };

  const getEngagementBadge = (level: string) => (
    <Badge 
      variant={level === 'High' ? 'default' : 'secondary'}
      className={`text-xs font-semibold px-3 py-1 ${
        level === 'High' 
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg animate-pulse' 
          : 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg'
      }`}
    >
      {level === 'High' ? '🔥 High' : '⚡ Needs Boost'}
    </Badge>
  );

  const getPerformanceBadge = (level: string) => (
    <Badge 
      variant={level === 'High' ? 'default' : 'secondary'}
      className={`text-xs font-semibold px-3 py-1 ${
        level === 'High' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg animate-pulse' 
          : 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
      }`}
    >
      {level === 'High' ? '🏆 Excellent' : '📈 Growing'}
    </Badge>
  );

  return (
    <div className="h-screen overflow-hidden relative bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-violet-500/30 to-fuchsia-500/20"></div>
      
      {/* Neural Network Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
      </div>

      {/* Floating AI Elements */}
      <FloatingIcon Icon={Brain} delay={0} size={32} className="top-10 left-10" />
      <FloatingIcon Icon={Cpu} delay={1} size={28} className="top-20 right-20" />
      <FloatingIcon Icon={CircuitBoard} delay={2} size={24} className="bottom-32 left-16" />
      <FloatingIcon Icon={BookOpen} delay={0.5} size={30} className="bottom-20 right-32" />
      <FloatingIcon Icon={Cpu} delay={1.5} size={26} className="top-40 right-10" />
      <FloatingIcon Icon={Zap} delay={2.5} size={22} className="bottom-40 left-32" />

      {/* Neural Nodes */}
      <NeuralNode delay={0} className="top-16 left-1/4" />
      <NeuralNode delay={0.5} className="top-32 right-1/3" />
      <NeuralNode delay={1} className="bottom-24 left-1/3" />
      <NeuralNode delay={1.5} className="bottom-16 right-1/4" />
      <NeuralNode delay={2} className="top-1/2 left-12" />
      <NeuralNode delay={2.5} className="top-1/2 right-12" />

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center py-6 px-6">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
                <Brain className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-spin" />
              <Zap className="absolute -bottom-1 -left-1 h-4 w-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 drop-shadow-2xl">
            AI Learning Hub
          </h1>
          <p className="text-lg text-white/90 mb-2 font-medium">Next-Gen Learning Management</p>
          <div className="flex items-center justify-center gap-3 text-sm text-white/70">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Choose Your Student Profile</span>
            </div>
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
        </div>

        {/* Footer */}
        <div className="text-center pb-4 text-white/60">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Brain className="h-4 w-4 text-cyan-400" />
            <p className="text-xs font-medium">AI-Powered Learning Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
