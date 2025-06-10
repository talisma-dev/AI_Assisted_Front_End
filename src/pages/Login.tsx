
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

        {/* Student Selection Grid - Flex-1 to take remaining space */}
        <div className="flex-1 flex items-center justify-center px-6 pb-6">
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {students.map((student, index) => (
                <Card 
                  key={student.id}
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 border-0 shadow-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 ${
                    selectedStudent === student.id ? 'ring-4 ring-cyan-400 shadow-cyan-400/50 scale-105' : ''
                  }`}
                  onClick={() => !isLoading && handleStudentSelect(student)}
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    animation: 'fade-in 0.8s ease-out forwards'
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <span className="text-white font-bold text-sm">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {student.name}
                          </CardTitle>
                        </div>
                      </div>
                      {selectedStudent === student.id && isLoading && (
                        <div className="relative">
                          <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 w-6 h-6 border-2 border-purple-400/30 border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.2s' }}></div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 pb-4">
                    {/* Engagement Level */}
                    <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-400/30 backdrop-blur-sm group-hover:border-emerald-400/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/90 flex items-center gap-2">
                          <Zap className="h-3 w-3 text-emerald-400" />
                          Engagement
                        </span>
                      </div>
                      <div className="flex justify-center">
                        {getEngagementBadge(student.engagement)}
                      </div>
                    </div>

                    {/* Performance Level */}
                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30 backdrop-blur-sm group-hover:border-blue-400/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/90 flex items-center gap-2">
                          <Brain className="h-3 w-3 text-blue-400" />
                          Performance
                        </span>
                      </div>
                      <div className="flex justify-center">
                        {getPerformanceBadge(student.performance)}
                      </div>
                    </div>

                    {/* Click indicator */}
                    <div className="text-center pt-1">
                      <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                        ✨ Click to access module
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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
