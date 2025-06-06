
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Target, Lightbulb, FileText } from "lucide-react";

const Learning = () => {
  const { concept } = useParams();
  const { state } = useApp();
  const navigate = useNavigate();

  const decodedConcept = decodeURIComponent(concept || "");
  const conceptData = state.conceptScores.find(cs => cs.concept === decodedConcept);

  const handleReadyToTest = () => {
    navigate(`/assessment/${encodeURIComponent(decodedConcept)}`);
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
        "Interactive Bayesian Visualization",
        "Probability Theory Fundamentals",
        "Case Studies in Medical Diagnosis",
        "Computational Bayesian Methods"
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
        "PCA Step-by-Step Tutorial",
        "Feature Selection Algorithms",
        "Dimensionality Reduction Techniques",
        "Real-world Feature Engineering"
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
        "Linear Algebra Foundations",
        "Non-linear Model Examples",
        "Regularization Techniques",
        "Model Selection Strategies"
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
        "Statistics Review: Normal Distributions",
        "Classification Decision Boundaries",
        "Gaussian Mixture Model Tutorial",
        "Probability Density Functions"
      ]
    }
  };

  const content = learningContent[decodedConcept as keyof typeof learningContent] || learningContent["Bayesian Inference"];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/evaluation")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Button>
          <Badge variant="secondary" className="text-sm">
            Learning Material
          </Badge>
        </div>

        {/* Concept Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{decodedConcept}</CardTitle>
                <p className="text-muted-foreground">
                  Current Score: {conceptData?.score || 0}% • Attempts: {conceptData?.attempts || 0}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Learning Content */}
        <div className="space-y-6 mb-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {content.description}
              </p>
            </CardContent>
          </Card>

          {/* Key Learning Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Key Learning Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {content.resources.map((resource, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-primary" />
                      <span className="font-medium">{resource}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Ready to Test Your Knowledge?</h3>
            <p className="text-muted-foreground mb-4">
              Once you've reviewed the material above, take the focused assessment to demonstrate your mastery of {decodedConcept}.
            </p>
            <Button 
              onClick={handleReadyToTest}
              size="lg"
              className="h-12 px-8"
            >
              <Play className="mr-2 h-5 w-5" />
              READY TO TEST YOUR KNOWLEDGE
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              This assessment will focus specifically on {decodedConcept} concepts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learning;
