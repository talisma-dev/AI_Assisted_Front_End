
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, LogOut, BookOpen, Target, Zap, TrendingUp } from "lucide-react";

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

  const getEngagementBadge = (level: string) => (
    <Badge 
      variant={level === 'High' ? 'default' : 'secondary'}
      className={`text-sm font-semibold px-4 py-2 ${
        level === 'High' 
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl' 
          : 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg hover:shadow-xl'
      } transition-all duration-300`}
    >
      {level === 'High' ? '🔥 High Engagement' : '⚡ Needs Boost'}
    </Badge>
  );

  const getPerformanceBadge = (level: string) => (
    <Badge 
      variant={level === 'High' ? 'default' : 'secondary'}
      className={`text-sm font-semibold px-4 py-2 ${
        level === 'High' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl' 
          : 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg hover:shadow-xl'
      } transition-all duration-300`}
    >
      {level === 'High' ? '🏆 Excellent Performance' : '📈 Growing Strong'}
    </Badge>
  );

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

        {/* Student Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Engagement Level */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Learning Engagement</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                {getEngagementBadge(state.currentUser.engagement)}
              </div>
              <p className="text-sm text-gray-600 text-center">
                {state.currentUser.engagement === 'High' 
                  ? 'You\'re actively participating and staying engaged! Keep up the excellent work!' 
                  : 'Consider increasing your participation in discussions and activities to boost engagement.'}
              </p>
            </CardContent>
          </Card>

          {/* Performance Level */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Academic Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                {getPerformanceBadge(state.currentUser.performance)}
              </div>
              <p className="text-sm text-gray-600 text-center">
                {state.currentUser.performance === 'High' 
                  ? 'Outstanding academic progress! You\'re mastering the concepts brilliantly!' 
                  : 'You\'re making steady progress. Keep practicing and you\'ll see great improvements!'}
              </p>
            </CardContent>
          </Card>
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
