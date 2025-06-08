import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Target, Lightbulb, Code, FileText } from "lucide-react";
import { useState, useEffect } from "react";

const LearningResource = () => {
  const { concept, resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { resourceTitle } = location.state || {};
  const decodedConcept = decodeURIComponent(concept || "");

  // Simulate progress as user scrolls or time passes
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsCompleted(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resourceContent = {
    "bayesian-viz": {
      type: "Interactive Visualization",
      duration: "15 min",
      difficulty: "Intermediate",
      content: {
        introduction: "Explore Bayesian inference through interactive visualizations that demonstrate how prior beliefs are updated with new evidence.",
        sections: [
          {
            title: "Prior Probability",
            content: "Understanding how we start with initial beliefs before seeing any evidence.",
            interactive: "Adjust the prior distribution and observe how it affects the final result."
          },
          {
            title: "Likelihood Function",
            content: "How we model the probability of observing our data given different hypotheses.",
            interactive: "Experiment with different likelihood functions and see their impact."
          },
          {
            title: "Posterior Distribution",
            content: "The updated probability after combining prior knowledge with observed evidence.",
            interactive: "Watch how the posterior changes as more data points are added."
          }
        ]
      }
    },
    "pca-tutorial": {
      type: "Step-by-Step Tutorial",
      duration: "20 min",
      difficulty: "Beginner",
      content: {
        introduction: "Learn Principal Component Analysis from the ground up with practical examples and visualizations.",
        sections: [
          {
            title: "Understanding Dimensionality",
            content: "Why do we need to reduce dimensions in machine learning?",
            interactive: "Visualize high-dimensional data projected onto 2D space."
          },
          {
            title: "Covariance Matrix",
            content: "How PCA uses covariance to find the most important directions in data.",
            interactive: "Calculate and visualize covariance matrices for sample datasets."
          },
          {
            title: "Principal Components",
            content: "Finding the directions of maximum variance in your data.",
            interactive: "Interactive slider to see how many components to keep."
          }
        ]
      }
    }
  };

  const getDefaultContent = () => ({
    type: "Learning Material",
    duration: "20 min",
    difficulty: "Intermediate",
    content: {
      introduction: `Comprehensive learning material for ${resourceTitle || 'this concept'}.`,
      sections: [
        {
          title: "Core Concepts",
          content: "Understanding the fundamental principles and theory.",
          interactive: "Interactive examples and demonstrations."
        },
        {
          title: "Practical Applications",
          content: "Real-world applications and use cases.",
          interactive: "Hands-on exercises and practice problems."
        },
        {
          title: "Advanced Topics",
          content: "Deep dive into advanced concepts and techniques.",
          interactive: "Complex scenarios and case studies."
        }
      ]
    }
  });

  const resource = resourceContent[resourceId as keyof typeof resourceContent] || getDefaultContent();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/learning/${encodeURIComponent(decodedConcept)}`)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Learning
          </Button>
          <div className="flex items-center gap-2">
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
            <Badge variant="secondary">
              {isCompleted ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </div>

        {/* Resource Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-0 shadow-xl animate-scale-in">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {resourceTitle || "Learning Resource"}
                  </CardTitle>
                  <p className="text-muted-foreground">Part of {decodedConcept}</p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <Badge className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{resource.duration}</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Resource Content */}
        <div className="space-y-6 mb-8">
          {/* Introduction */}
          <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {resource.content.introduction}
              </p>
            </CardContent>
          </Card>

          {/* Learning Sections */}
          {resource.content.sections.map((section, index) => (
            <Card 
              key={index} 
              className="hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
                
                {/* Interactive Component Placeholder */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Play className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800">Interactive Component</h4>
                      <p className="text-sm text-blue-600">{section.interactive}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Interactive visualization would appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Completion Card */}
          {isCompleted && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl animate-scale-in">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Great Job! 🎉
                </h3>
                <p className="text-green-700 mb-4">
                  You've completed this learning resource. Ready to test your knowledge?
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/learning/${encodeURIComponent(decodedConcept)}`)}
                    className="border-green-600 text-green-600 hover:bg-green-50 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Learning
                  </Button>
                  <Button 
                    onClick={() => navigate(`/assessment/${encodeURIComponent(decodedConcept)}`)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Take Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningResource;
