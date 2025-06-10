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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/learning/${encodeURIComponent(decodedConcept)}`)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
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

        {/* Resource Content */}
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {resourceTitle || "Learning Resource"}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className={getDifficultyColor(resource.difficulty)}>
                {resource.difficulty}
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{resource.duration}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue max-w-none">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                <p>{resource.content.introduction}</p>
              </div>
              {resource.content.sections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                  <p>{section.content}</p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{section.interactive}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Card */}
        {isCompleted && (
          <Card className="mt-6 bg-white shadow">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Great Job! 🎉
              </h3>
              <p className="text-gray-700 mb-4">
                You've completed this learning resource. Ready to test your knowledge?
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/learning/${encodeURIComponent(decodedConcept)}`)}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Learning
                </Button>
                <Button 
                  onClick={() => navigate(`/assessment/${encodeURIComponent(decodedConcept)}`)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
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
  );
};

export default LearningResource;
