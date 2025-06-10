
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, LogOut, BookOpen, Target } from "lucide-react";

const StudentDashboard = () => {
  const { state, logout } = useApp();
  const navigate = useNavigate();

  if (!state.currentUser) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getEngagementIcon = (level: string) => {
    return level === 'High' ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-orange-500" />;
  };

  const getPerformanceIcon = (level: string) => {
    return level === 'High' ? <TrendingUp className="h-6 w-6 text-blue-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Learning Platform</h1>
                <p className="text-sm text-gray-600">Student Dashboard</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {state.currentUser.name}! 👋
          </h2>
          <p className="text-lg text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Module Information */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Current Module</CardTitle>
                <p className="text-indigo-100">Your active learning module</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold mb-2">Artificial Learning and Machine Learning</h3>
            <p className="text-indigo-100">Explore the fundamentals of AI and ML algorithms</p>
          </CardContent>
        </Card>

        {/* Student Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Engagement Level */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                {getEngagementIcon(state.currentUser.engagement)}
                <CardTitle className="text-xl">Engagement Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{state.currentUser.engagement}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {state.currentUser.engagement === 'High' 
                      ? 'Great job staying active!' 
                      : 'Consider increasing participation'}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  state.currentUser.engagement === 'High' 
                    ? 'bg-green-100' 
                    : 'bg-orange-100'
                }`}>
                  {getEngagementIcon(state.currentUser.engagement)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Level */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                {getPerformanceIcon(state.currentUser.performance)}
                <CardTitle className="text-xl">Performance Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{state.currentUser.performance}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {state.currentUser.performance === 'High' 
                      ? 'Excellent academic progress!' 
                      : 'Room for improvement in assessments'}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  state.currentUser.performance === 'High' 
                    ? 'bg-blue-100' 
                    : 'bg-red-100'
                }`}>
                  {getPerformanceIcon(state.currentUser.performance)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-indigo-500" />
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate("/module")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-16"
              >
                <div className="text-center">
                  <BookOpen className="h-6 w-6 mx-auto mb-1" />
                  <span className="block text-sm">Module Overview</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => navigate("/assessment")}
                variant="outline"
                className="border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105 h-16"
              >
                <div className="text-center">
                  <Target className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
                  <span className="block text-sm text-indigo-600">Start Assessment</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => navigate("/evaluation")}
                variant="outline"
                className="border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-105 h-16"
              >
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                  <span className="block text-sm text-purple-600">View Results</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
