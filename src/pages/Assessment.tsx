import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Brain, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Question {
  question_id: string;
  question_type: string;
  concept: string;
  question: string;
  options: string[];
  answer: string;
}

// Your provided questions data
export const questionsData: Question[] = [
  {
    question_id: "Q1",
    question_type: "MCQ",
    concept: "Bayesian Inference",
    question: "Which of the following machine learning categories uses labeled data for training?",
    options: [
      "Unsupervised Learning",
      "Supervised Learning", 
      "Reinforcement Learning",
      "All of the above"
    ],
    answer: "Supervised Learning"
  },
  {
    question_id: "Q2",
    question_type: "MCQ",
    concept: "Bayesian Inference",
    question: "In the context of unsupervised learning, how does an algorithm handle data?",
    options: [
      "It assigns data points to pre-defined categories.",
      "It requires human intervention to label data before analysis.",
      "It analyzes and clusters unlabeled data based on similarities.",
      "It predicts numerical values based on labeled data."
    ],
    answer: "It analyzes and clusters unlabeled data based on similarities."
  },
  {
    question_id: "Q3",
    question_type: "MCQ",
    concept: "Bayesian Inference",
    question: "Which of the following is NOT an example of a supervised learning algorithm mentioned in the text?",
    options: [
      "Linear classifiers",
      "K-means clustering",
      "Decision trees",
      "Support vector machines"
    ],
    answer: "K-means clustering"
  },
  {
    question_id: "Q4",
    question_type: "MCQ",
    concept: "Bayesian Inference",
    question: "What is a key characteristic that distinguishes supervised learning from unsupervised learning?",
    options: [
      "The use of algorithms",
      "The type of data used (labeled vs. unlabeled)",
      "The need for human intervention",
      "The prediction of numerical values"
    ],
    answer: "The type of data used (labeled vs. unlabeled)"
  },
  {
    question_id: "Q5",
    question_type: "MCQ",
    concept: "Feature Selection & Dimensionality Reduction",
    question: "Why is dimensionality reduction used in machine learning?",
    options: [
      "To increase the complexity of the model",
      "To reduce the number of features while preserving data integrity",
      "To add more noise to the data",
      "To make the data more difficult to interpret"
    ],
    answer: "To reduce the number of features while preserving data integrity"
  },
  {
    question_id: "Q6",
    question_type: "MCQ",
    concept: "Feature Selection & Dimensionality Reduction",
    question: "Which of the following is NOT mentioned in the context as an example of a dimensionality reduction technique or algorithm?",
    options: [
      "Autoencoders",
      "K-Means clustering",
      "Apriori algorithm",
      "Linear Regression"
    ],
    answer: "Linear Regression"
  },
  {
    question_id: "Q7",
    question_type: "MCQ",
    concept: "Feature Selection & Dimensionality Reduction",
    question: "In the context of dimensionality reduction, what is often a preprocessing step?",
    options: [
      "Model training",
      "Data visualization",
      "Removing noise from visual data (as mentioned with autoencoders)",
      "Feature engineering"
    ],
    answer: "Removing noise from visual data (as mentioned with autoencoders)"
  },
  {
    question_id: "Q8",
    question_type: "MCQ",
    concept: "Feature Selection & Dimensionality Reduction",
    question: "According to the provided text, what is a common application of dimensionality reduction?",
    options: [
      "Improving model interpretability by adding more features",
      "Increasing computational cost",
      "Improving picture quality by removing noise from visual data",
      "Decreasing the efficiency of machine learning algorithms"
    ],
    answer: "Improving picture quality by removing noise from visual data"
  },
  {
    question_id: "Q9",
    question_type: "MCQ",
    concept: "Linear & Non-Linear Models",
    question: "Which of the following is an example of a linear regression algorithm?",
    options: [
      "Logistic Regression",
      "Polynomial Regression",
      "Linear Regression",
      "K-Means Clustering"
    ],
    answer: "Linear Regression"
  },
  {
    question_id: "Q10",
    question_type: "MCQ",
    concept: "Linear & Non-Linear Models",
    question: "Which algorithm is NOT typically used for classification problems as mentioned in the text?",
    options: [
      "Linear classifiers",
      "Support Vector Machines",
      "K-Means Clustering",
      "Decision Trees"
    ],
    answer: "K-Means Clustering"
  },
  {
    question_id: "Q11",
    question_type: "MCQ",
    concept: "Linear & Non-Linear Models",
    question: "Polynomial regression is an example of which type of model?",
    options: [
      "Linear Model",
      "Non-Linear Model",
      "Supervised Learning Model",
      "Unsupervised Learning Model"
    ],
    answer: "Non-Linear Model"
  },
  {
    question_id: "Q12",
    question_type: "MCQ",
    concept: "Linear & Non-Linear Models",
    question: "The Apriori algorithm is most closely associated with which unsupervised learning technique?",
    options: [
      "Clustering",
      "Dimensionality Reduction",
      "Association",
      "Regression"
    ],
    answer: "Association"
  },
  {
    question_id: "Q13",
    question_type: "MCQ",
    concept: "Gaussian distributions and decision boundaries",
    question: "Which of the following machine learning categories would be MOST suitable for classifying emails as spam or not spam?",
    options: [
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Supervised Learning",
      "Semi-supervised Learning"
    ],
    answer: "Supervised Learning"
  },
  {
    question_id: "Q14",
    question_type: "MCQ",
    concept: "Gaussian distributions and decision boundaries",
    question: "In the context of the provided text, which algorithm is an example of supervised learning?",
    options: [
      "K-means clustering",
      "Logistic Regression",
      "None of the above",
      "All of the above"
    ],
    answer: "Logistic Regression"
  },
  {
    question_id: "Q15",
    question_type: "MCQ",
    concept: "Gaussian distributions and decision boundaries",
    question: "Which of the following is NOT a characteristic of unsupervised learning?",
    options: [
      "Works with unlabeled data",
      "Discovers hidden patterns",
      "Requires human intervention for labeling data",
      "Assigns data into predefined categories"
    ],
    answer: "Assigns data into predefined categories"
  },
  {
    question_id: "Q16",
    question_type: "MCQ",
    concept: "Gaussian distributions and decision boundaries",
    question: "According to the text, what is a key difference between supervised and unsupervised learning?",
    options: [
      "The type of data used",
      "Whether the training data is labeled",
      "The complexity of the algorithms",
      "Both A and B"
    ],
    answer: "Both A and B"
  }
];

const Assessment = () => {
  const { concept } = useParams();
  const { state, submitAssessment, updateConceptAttempts } = useApp();
  const navigate = useNavigate();
  
  // Filter questions based on concept or use all questions
  const [questions] = useState<Question[]>(() => {
    if (concept) {
      const decodedConcept = decodeURIComponent(concept);
      return questionsData.filter(q => q.concept === decodedConcept);
    }
    return questionsData;
  });

  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ [questionId: string]: boolean }>({});
  const [isScanning, setIsScanning] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setIsScanning(true);

    // AI scanning animation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate results
    const newResults: { [questionId: string]: boolean } = {};
    const conceptScores: { [concept: string]: { correct: number; total: number } } = {};
    
    questions.forEach(q => {
      const isCorrect = answers[q.question_id] === q.answer;
      newResults[q.question_id] = isCorrect;
      
      // Calculate scores per concept
      if (!conceptScores[q.concept]) {
        conceptScores[q.concept] = { correct: 0, total: 0 };
      }
      conceptScores[q.concept].total++;
      if (isCorrect) {
        conceptScores[q.concept].correct++;
      }
    });
    
    setResults(newResults);
    setSubmitted(true);
    setIsScanning(false);
    
    // Convert string answers to number indices for the app context
    const numericAnswers: { [questionId: string]: number } = {};
    questions.forEach(q => {
      const answerIndex = q.options.findIndex(option => option === answers[q.question_id]);
      numericAnswers[q.question_id] = answerIndex;
    });
    
    submitAssessment(numericAnswers, concept);
    
    if (concept) {
      updateConceptAttempts(concept);
    }
    
    // Display concept scores
    Object.entries(conceptScores).forEach(([concept, { correct, total }]) => {
      const score = Math.round((correct / total) * 100);
      toast.success(`${concept}: ${correct}/${total} correct (${score}%)`);
    });
    
    toast.success("Assessment submitted successfully!");
  };

  const handleFinish = () => {
    navigate("/evaluation");
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const correctAnswers = Object.values(results).filter(Boolean).length;
  const totalQuestions = questions.length;

  if (isScanning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* AI Scanning Animation Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-pink-400/30 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-yellow-400/30 rounded-full animate-ping delay-500"></div>
        </div>
        
        <Card className="relative z-10 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="relative inline-flex">
                <Brain className="h-16 w-16 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              AI Analysis in Progress
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Scanning your responses with advanced algorithms...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-400/10 to-cyan-400/10 rounded-full animate-pulse delay-1000"></div>
        
        {/* Neural Network Nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/40 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-cyan-400/40 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400/40 rounded-full animate-ping delay-700"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200 bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                No time limit
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <BookOpen className="h-4 w-4" />
                {concept || "Full Assessment"}
              </div>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="mb-6 animate-scale-in">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {concept ? `${concept} Assessment` : "AI Learning Assessment"}
              </h1>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-3 bg-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out animate-pulse" 
                   style={{ width: `${progress}%` }} />
            </Progress>
          </div>

          {/* Enhanced Question Card */}
          <Card className="mb-6 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-3xl transition-all duration-500 animate-fade-in">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between">
                <Badge variant="secondary" className="mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                  <Brain className="h-3 w-3 mr-1" />
                  {currentQ.concept}
                </Badge>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">#{currentQ.question_id}</span>
                </div>
              </div>
              <CardTitle className="text-xl leading-relaxed text-gray-800 relative">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ.question_id] || ""}
                onValueChange={(value) => handleAnswerChange(currentQ.question_id, value)}
                className="space-y-4"
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <RadioGroupItem 
                      value={option} 
                      id={`${currentQ.question_id}_${index}`}
                      className="border-2 border-indigo-300 text-indigo-600 hover:border-indigo-500 transition-all duration-200"
                    />
                    <Label 
                      htmlFor={`${currentQ.question_id}_${index}`} 
                      className="flex-1 cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group-hover:scale-[1.02] border border-transparent hover:border-indigo-200 hover:shadow-lg"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Enhanced Navigation */}
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 ${
                    index === currentQuestion 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-110' 
                      : answers[questions[index].question_id]
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md hover:shadow-lg'
                      : 'bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
            >
              Next
            </Button>
          </div>

          {/* Enhanced Submit/Results Section */}
          {!submitted ? (
            <Card className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm border border-white/30 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Brain className="h-12 w-12 mx-auto text-indigo-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Ready for AI Analysis?
                </h3>
                <p className="text-muted-foreground mb-4 text-lg">
                  You've answered {Object.keys(answers).length} of {questions.length} questions.
                </p>
                <Button 
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Submit for AI Analysis
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-green-50/50 via-blue-50/50 to-purple-50/50 backdrop-blur-sm border border-white/30 shadow-xl animate-scale-in">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="relative inline-flex">
                    <Brain className="h-16 w-16 text-green-600 animate-pulse" />
                    <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-500 animate-spin" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Analysis Complete! 🎉
                </h3>
                <p className="text-muted-foreground mb-2 text-lg">
                  You scored {correctAnswers} out of {totalQuestions} questions correctly.
                </p>
                <p className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Score: {Math.round((correctAnswers / totalQuestions) * 100)}%
                </p>
                <Button 
                  onClick={handleFinish} 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  View Detailed Results
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
