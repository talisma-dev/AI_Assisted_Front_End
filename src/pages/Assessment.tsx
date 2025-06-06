
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  concept: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const outcomes = [
  "Bayesian Inference",
  "Feature Selection & Dimensionality Reduction", 
  "Linear & Non-Linear Models",
  "Gaussian distributions and decision boundaries"
];

// Sample questions for each concept
const generateQuestions = (conceptFilter?: string): Question[] => {
  const concepts = conceptFilter ? [conceptFilter] : outcomes;
  const questionsPerConcept = conceptFilter ? 4 : 4; // 4 questions per concept
  
  const allQuestions: Question[] = [];
  
  concepts.forEach((concept, conceptIndex) => {
    for (let i = 0; i < questionsPerConcept; i++) {
      allQuestions.push({
        id: `${concept.replace(/\s+/g, '').substring(0, 3)}_${i + 1}`,
        concept,
        question: `Sample question ${i + 1} related to ${concept}. What is the best approach to solve this problem?`,
        options: [
          `Option A for ${concept}`,
          `Option B for ${concept}`,
          `Option C for ${concept}`,
          `Option D for ${concept}`
        ],
        correctAnswer: Math.floor(Math.random() * 4) // Random correct answer for demo
      });
    }
  });
  
  return allQuestions;
};

const Assessment = () => {
  const { concept } = useParams();
  const { state, submitAssessment, updateConceptAttempts } = useApp();
  const navigate = useNavigate();
  const [questions] = useState<Question[]>(() => generateQuestions(concept));
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ [questionId: string]: boolean }>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    // Calculate results
    const newResults: { [questionId: string]: boolean } = {};
    questions.forEach(q => {
      newResults[q.id] = answers[q.id] === q.correctAnswer;
    });
    
    setResults(newResults);
    setSubmitted(true);
    submitAssessment(answers, concept);
    
    if (concept) {
      updateConceptAttempts(concept);
    }
    
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              No time limit
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              {concept || "Full Assessment"}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">
              {concept ? `${concept} Assessment` : "Module Assessment"}
            </h1>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="mb-2">
                {currentQ.concept}
              </Badge>
              <span className="text-sm text-muted-foreground">#{currentQ.id}</span>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
              className="space-y-4"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`${currentQ.id}_${index}`} />
                  <Label 
                    htmlFor={`${currentQ.id}_${index}`} 
                    className="flex-1 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion 
                    ? 'bg-primary text-primary-foreground' 
                    : answers[questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
          >
            Next
          </Button>
        </div>

        {/* Submit Section */}
        {!submitted ? (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Ready to submit?</h3>
              <p className="text-muted-foreground mb-4">
                You've answered {Object.keys(answers).length} of {questions.length} questions.
              </p>
              <Button 
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                size="lg"
              >
                Submit Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Assessment Complete!</h3>
              <p className="text-muted-foreground mb-2">
                You scored {correctAnswers} out of {totalQuestions} questions correctly.
              </p>
              <p className="text-lg font-medium text-green-600 mb-4">
                Score: {Math.round((correctAnswers / totalQuestions) * 100)}%
              </p>
              <Button onClick={handleFinish} size="lg">
                View Detailed Results
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assessment;
