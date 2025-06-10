
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap, Brain, TrendingUp, TrendingDown, Users, Sparkles } from "lucide-react";

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
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (loginWithStudent(student)) {
      toast.success(`Welcome back, ${student.name}! Redirecting to your dashboard.`);
      navigate("/dashboard");
    } else {
      toast.error("Unable to access student dashboard. Please try again.");
    }
    
    setIsLoading(false);
    setSelectedStudent(null);
  };

  const getEngagementIcon = (level: string) => {
    return level === 'High' ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-orange-500" />;
  };

  const getPerformanceIcon = (level: string) => {
    return level === 'High' ? <TrendingUp className="h-5 w-5 text-blue-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-20 left-20 w-48 h-48 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-spin" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI Learning Platform
          </h1>
          <p className="text-xl text-gray-600 mb-2">Learning Management System</p>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-500">
            <Users className="h-5 w-5" />
            <span>Select Your Student Profile</span>
          </div>
        </div>

        {/* Student Selection Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card 
                key={student.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-white/70 backdrop-blur-sm ${
                  selectedStudent === student.id ? 'ring-4 ring-indigo-500 shadow-2xl' : 'hover:bg-white/90'
                }`}
                onClick={() => !isLoading && handleStudentSelect(student)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          {student.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">Student ID: {student.id}</p>
                      </div>
                    </div>
                    {selectedStudent === student.id && isLoading && (
                      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Engagement Level */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2">
                      {getEngagementIcon(student.engagement)}
                      <span className="text-sm font-medium text-gray-700">Engagement</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.engagement === 'High' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {student.engagement}
                    </span>
                  </div>

                  {/* Performance Level */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      {getPerformanceIcon(student.performance)}
                      <span className="text-sm font-medium text-gray-700">Performance</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.performance === 'High' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.performance}
                    </span>
                  </div>

                  {/* Click indicator */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-400">Click to access dashboard</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">AI-Powered Learning Management System</p>
          <p className="text-xs mt-1">Personalized education for every student</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
