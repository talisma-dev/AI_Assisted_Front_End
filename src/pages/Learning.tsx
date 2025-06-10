import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Target, Lightbulb, FileText, Clock, Users, Award } from "lucide-react";
import clsx from "clsx";

const Learning = () => {
  const { concept } = useParams();
  const { state } = useApp();
  const navigate = useNavigate();

  console.log('Learning component - Raw concept from params:', concept);
  const decodedConcept = decodeURIComponent(concept || "");
  console.log('Learning component - Decoded concept:', decodedConcept);
  const conceptData = state.conceptScores.find(cs => cs.concept === decodedConcept);
  console.log('Learning component - Found concept data:', conceptData);

  const handleReadyToTest = () => {
    navigate(`/assessment/${encodeURIComponent(decodedConcept)}`);
  };

  const handleResourceClick = (resourceId: string, resourceTitle: string) => {
    console.log('Navigating to resource:', { resourceId, resourceTitle, concept: decodedConcept });
    const path = `/learning/${encodeURIComponent(decodedConcept)}/resource/${resourceId}`;
    console.log('Navigation path:', path);
    navigate(path, {
      state: { 
        resourceTitle,
        concept: decodedConcept
      }
    });
  };

  const learningContent = {
    "Bayesian Inference": {
      description: "Bayesian inference is a method of statistical inference in which Bayes' theorem is used to update the probability for a hypothesis as more evidence or information becomes available.",
      keyPoints: [
        "Understanding prior and posterior probabilities",
        "Applying Bayes' theorem in real-world scenarios",
        "Distinguishing between frequentist and Bayesian approaches",
        "Working with conjugate priors"
      ],
      resources: [
        { id: "bayesian-viz", title: "Interactive Bayesian Visualization", duration: "15 min", type: "Interactive" },
        { id: "prob-theory", title: "Probability Theory Fundamentals", duration: "25 min", type: "Video" },
        { id: "medical-case", title: "Case Studies in Medical Diagnosis", duration: "20 min", type: "Case Study" },
        { id: "computational", title: "Computational Bayesian Methods", duration: "30 min", type: "Tutorial" }
      ]
    },
    "Feature Selection & Dimensionality Reduction": {
      description: "Learn techniques to identify the most relevant features in your dataset and reduce dimensionality while preserving important information for machine learning models.",
      keyPoints: [
        "Understanding curse of dimensionality",
        "Filter, wrapper, and embedded methods",
        "Principal Component Analysis (PCA)",
        "Feature importance and selection strategies"
      ],
      resources: [
        { id: "pca-tutorial", title: "PCA Step-by-Step Tutorial", duration: "20 min", type: "Tutorial" },
        { id: "feature-algorithms", title: "Feature Selection Algorithms", duration: "18 min", type: "Interactive" },
        { id: "dim-reduction", title: "Dimensionality Reduction Techniques", duration: "22 min", type: "Video" },
        { id: "feature-engineering", title: "Real-world Feature Engineering", duration: "35 min", type: "Case Study" }
      ]
    },
    "Linear & Non-Linear Models": {
      description: "Explore the fundamental differences between linear and non-linear models, when to use each approach, and how to implement them effectively.",
      keyPoints: [
        "Linear regression and its assumptions",
        "Polynomial and non-linear transformations",
        "Model complexity and overfitting",
        "Regularization techniques"
      ],
      resources: [
        { id: "linear-algebra", title: "Linear Algebra Foundations", duration: "25 min", type: "Video" },
        { id: "nonlinear-examples", title: "Non-linear Model Examples", duration: "30 min", type: "Interactive" },
        { id: "regularization", title: "Regularization Techniques", duration: "20 min", type: "Tutorial" },
        { id: "model-selection", title: "Model Selection Strategies", duration: "15 min", type: "Guide" }
      ]
    },
    "Gaussian distributions and decision boundaries": {
      description: "Master Gaussian distributions and learn how they form decision boundaries in classification problems, essential for many machine learning algorithms.",
      keyPoints: [
        "Properties of Gaussian distributions",
        "Multivariate Gaussian distributions",
        "Decision boundaries in classification",
        "Gaussian Mixture Models"
      ],
      resources: [
        { id: "normal-dist", title: "Statistics Review: Normal Distributions", duration: "18 min", type: "Video" },
        { id: "decision-boundaries", title: "Classification Decision Boundaries", duration: "22 min", type: "Interactive" },
        { id: "gmm-tutorial", title: "Gaussian Mixture Model Tutorial", duration: "28 min", type: "Tutorial" },
        { id: "pdf-functions", title: "Probability Density Functions", duration: "16 min", type: "Guide" }
      ]
    }
  };

  const content = learningContent[decodedConcept as keyof typeof learningContent] || learningContent["Bayesian Inference"];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Interactive": return <Play className="h-4 w-4 text-blue-600" />;
      case "Video": return <Play className="h-4 w-4 text-red-600" />;
      case "Tutorial": return <BookOpen className="h-4 w-4 text-green-600" />;
      case "Case Study": return <Users className="h-4 w-4 text-purple-600" />;
      case "Guide": return <FileText className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/evaluation")}
            className={clsx(
              "flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-blue-700 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 shadow-sm",
              "hover:from-blue-200 hover:to-purple-200 hover:shadow-md hover:scale-105 transition-all duration-200"
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-1">Back to Results</span>
          </Button>
          <span
            className={clsx(
              "px-4 py-1.5 rounded-full font-bold text-sm",
              "bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 text-purple-700 border border-purple-200 shadow-sm",
              "tracking-wide"
            )}
          >
            Learning Material
          </span>
        </div>

        {/* Enhanced Concept Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-scale-in">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 animate-pulse"></div>
            <div className="relative flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg animate-bounce">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {decodedConcept}
                </CardTitle>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>Current Score: {conceptData?.score || 0}%</span>
                  <span>•</span>
                  <span>Attempts: {conceptData?.attempts || 0}</span>
                  <Award className="h-4 w-4 ml-2 text-yellow-500" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Learning Content with staggered animations */}
        <div className="space-y-6 mb-8">
          {/* Overview */}
          <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content.description}
              </p>
            </CardContent>
          </Card>

          {/* Key Learning Points with enhanced styling */}
          <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                </div>
                Key Learning Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:scale-[1.02]">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {index + 1}
                    </div>
                    <span className="text-muted-foreground font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Enhanced Learning Resources */}
          <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                Interactive Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {content.resources.map((resource, index) => (
                  <div 
                    key={index}
                    onClick={() => handleResourceClick(resource.id, resource.title)}
                    className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getResourceIcon(resource.type)}
                        <div>
                          <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{resource.duration}</span>
                            <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transform rotate-180 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 rounded-full group-hover:animate-pulse" style={{width: '0%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Action Section */}
        <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4 animate-bounce">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Once you've reviewed the material above, take the focused assessment to demonstrate your mastery of {decodedConcept}.
            </p>
            <Button 
              onClick={handleReadyToTest}
              size="lg"
              className="h-14 px-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Play className="mr-3 h-6 w-6" />
              START ASSESSMENT
            </Button>
            <p className="text-sm text-muted-foreground mt-4 opacity-80">
              This assessment will focus specifically on {decodedConcept} concepts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learning;