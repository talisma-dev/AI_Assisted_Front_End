
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LogOut, Play, Target, Users } from "lucide-react";

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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {state.currentUser?.username}!</h1>
              <p className="text-muted-foreground">Ready to continue your learning journey?</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Module Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Current Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-3xl font-bold text-primary mb-2">{state.currentUser?.module_name}</h2>
              <p className="text-muted-foreground">Module ID: {state.currentUser?.module_id}</p>
              <p className="text-muted-foreground">Course ID: {state.currentUser?.course_id}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Understand Bayesian Inference principles
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Master Feature Selection techniques
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Apply Linear & Non-Linear Models
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Analyze Gaussian distributions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Test Your Knowledge?</CardTitle>
            <CardDescription className="text-lg">
              Take the comprehensive assessment to evaluate your understanding across all learning objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">16</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-muted-foreground">Concepts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">~30</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">MCQ</div>
                <div className="text-sm text-muted-foreground">Format</div>
              </div>
            </div>
            
            <Button 
              onClick={handleTakeAssessment}
              size="lg"
              className="h-12 px-8 text-lg font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleLanding;
