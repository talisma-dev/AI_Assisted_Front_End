import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Brain, Zap, Sparkles, Loader2, CheckCircle, Check, Timer, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getQuestionsData } from "@/api/getQuestionsData";
import AnimatedBackground from "@/components/AnimatedBackground";
import { evaluateAssessment } from "@/api/evaluateAssessment";
import { getConfiguredEvaluatedAssessmentScores } from "@/api/getConfiguredEvaluatedAssessmentScores";

interface Question {
  question_id: string;
  question_type: string;
  concept: string;
  question: string;
  options: string[];
  answer: string;
}

const Assessment = () => {
  const { concept } = useParams();
  const location = useLocation();
  const conceptFromState = (location.state as any)?.conceptName as string | undefined;
  const { state, submitAssessment, updateConceptAttempts, setAssessmentQuestions, setConceptScores } = useApp();
  const navigate = useNavigate();
  const [courseNameFromApi, setCourseNameFromApi] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ [questionId: string]: boolean }>(() => ({}));
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetchedQuestions, setHasFetchedQuestions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(conceptFromState ? false : true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [assessmentConfig, setAssessmentConfig] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Timer functionality
  const startTimer = () => {
    if (assessmentConfig?.isTimed && !timerStarted) {
      setTimerStarted(true);
      setTimeRemaining(assessmentConfig.durationInMinutes * 60);
    }
  };

  // Calculate if 70% of time has passed
  const isSeventyPercentPassed = assessmentConfig?.isTimed && 
    timerStarted && 
    timeRemaining > 0 && 
    timeRemaining <= (assessmentConfig.durationInMinutes * 60 * 0.3);

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (timerStarted && timeRemaining >= 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            setTimeExpired(true);
            stopTimer();
            toast.success("Maximum time reached! Your assessment has been submitted successfully.", {
              duration: 2000,
              position: 'top-center'
            });
            handleSubmit(true); 
            return 0;
          }
          if (prev === 300) {
            toast.warning("Only 5 minutes remaining!");
          }
          if (prev === 60) {
            toast.error("Only 1 minute remaining!");
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [timerStarted, timeRemaining]);

  const handleSubmit = async (isTimeExpired = false) => {
    stopTimer();
    if (Object.keys(answers).length !== questions.length && !isTimeExpired) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setIsScanning(true);

    // Brief animation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Build payload: { Q1: "selected answer", Q2: "..." }
      const payload: Record<string, string> = {};
      questions.forEach(q => {
        payload[q.question_id] = answers[q.question_id];
      });

      const remediationConceptName = conceptFromState
        ? conceptFromState
        : concept
          ? decodeURIComponent(concept)
          : (questions.length > 0 ? questions[0].concept : null);
      const { evaluationData } = await evaluateAssessment(payload, remediationConceptName);

      // Map backend evaluation into conceptScores in context
      const mappedScores = evaluationData.map(item => {
        const rawLevel = (item.level ?? '').toString().trim();
        const normalizedLevel = rawLevel.replace(/^["']|["']$/g, '').replace(/_/g, ' ');
        const levelLower = normalizedLevel.toLowerCase();
        let status: 'mastery' | 'remediation' | 'intervention';
        let label: 'Mastered' | 'Needs Review' | 'Contact Advisor';
        if (levelLower === 'mastered') {
          status = 'mastery';
          label = 'Mastered';
        } else if (levelLower === 'intermediate') {
          status = 'remediation';
          label = 'Needs Review';
        } else if (levelLower === 'novice' || levelLower === 'contact advisor') {
          status = 'intervention';
          label = 'Contact Advisor';
        } else {
          // Default fallback
          status = 'intervention';
          label = 'Contact Advisor';
        }
        const numericScore = typeof item.score === 'string' ? Number(item.score) : item.score;
        return {
          concept: item.concept,
          score: Number.isFinite(numericScore) ? (numericScore as number) : 0,
          attempts: item.attemptCount ?? 0,
          status,
          label,
          isRemediationCompleted : item.isRemediationCompleted ?? false
        };
      });

      setConceptScores(mappedScores);
      setSubmitted(true);
      toast.success("Assessment evaluated successfully");
      navigate("/evaluation");
    } catch (err) {
      console.error('Error evaluating assessment:', err);
      toast.error("Failed to evaluate assessment. Please try again.");
    } finally {
      setIsScanning(false);
    }
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

  // After submission, use the context score for the concept
  const conceptScoreObj = state.conceptScores.find(cs => cs.concept === concept);
  const contextScore = conceptScoreObj
    ? conceptScoreObj.score
    : Number((correctAnswers / totalQuestions) * 100).toFixed(1);

  useEffect(() => {
    let isMounted = true;
    if (conceptFromState && !showConfirmation) {
      startTimer();
    }

    async function fetchQuestions() {
      // If questions are already set in context, use them regardless of source
      if ((state.assessmentQuestions && state.assessmentQuestions.length > 0) || hasFetchedQuestions) {
        setQuestions(state.assessmentQuestions || []);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        let params;
        const studentId = localStorage.getItem('studentId') || 'S001';
        if (concept) {
          params = {
            module_id: "M101",
            course_id: "ATHENA 1-A",
            student_id: studentId,
            module_name: "Safe Medication Practice",
            outcomes: [decodeURIComponent(concept)],
            remedition: true,
            num_questions: 4,
          };
        } else {
          params = {
            module_id: "M101",
            course_id: "ATHENA 1-A",
            student_id: studentId,
            module_name: "Safe Medication Practice",
            outcomes: [
              "Storage Practices",
              "Medication Ordering and Transcription",
              "Dispensing and High-Alert Medications",
              "Dosage and IV Infusion Calculations",
            ],
            remedition: false,
            num_questions: 16,
          };
        }
        console.log('Fetching questions with params:', params);
        const fetchedQuestionsResponse = await getQuestionsData(params);
        console.log('Received questions:', fetchedQuestionsResponse);

        if (!isMounted) return;

        if (!fetchedQuestionsResponse) {
          throw new Error("No response from the API");
        }

        // Handle both old format (direct array) and new format (object with questions and config)
        let fetchedQuestions, config, courseName;
        if (Array.isArray(fetchedQuestionsResponse)) {
          fetchedQuestions = fetchedQuestionsResponse;
          config = null;
          courseName = null;
        } else if (fetchedQuestionsResponse.questions && Array.isArray(fetchedQuestionsResponse.questions)) {
          fetchedQuestions = fetchedQuestionsResponse.questions;
          config = fetchedQuestionsResponse.configuration;
          courseName = fetchedQuestionsResponse.courseName;
        } else {
          throw new Error("Invalid response format from API");
        }

        if (fetchedQuestions.length === 0) {
          throw new Error("No questions received from the API");
        }
        // Set assessment configuration from API
        if (config) {
          setAssessmentConfig(config);
        }
        if (courseName) {
          setCourseNameFromApi(courseName);
        }

        // Validate question format
        const isValidQuestion = (q: any) => {
          return q &&
            typeof q.question_id === 'string' &&
            typeof q.question === 'string' &&
            Array.isArray(q.options) &&
            typeof q.answer === 'string' &&
            typeof q.concept === 'string';
        };

        const invalidQuestions = fetchedQuestions.filter(q => !isValidQuestion(q));
        if (invalidQuestions.length > 0) {
          console.error('Invalid questions found:', invalidQuestions);
          throw new Error("Some questions have invalid format");
        }

        setQuestions(fetchedQuestions);
        setAssessmentQuestions(fetchedQuestions);
        setHasFetchedQuestions(true);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching questions:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load questions. Please try again later.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [state.assessmentSource, concept, setAssessmentQuestions, hasFetchedQuestions, state.assessmentQuestions]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const evalScores = await getConfiguredEvaluatedAssessmentScores();
        if (evalScores?.courseName) {
          setCourseNameFromApi(evalScores.courseName);
        }
      } catch (error) {
        console.error('Error fetching course name:', error);
      }
    };

    fetchCourseName();
  }, []);

  useEffect(() => {
    if (courseNameFromApi) {
      document.title = `${courseNameFromApi} - AI Assisted Learning Programme`;
    }
  }, [courseNameFromApi]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
        <AnimatedBackground />
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Loading Questions...</h2>
            <p className="text-white/80 mt-2">Please wait while we prepare your assessment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Assessment</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Questions Available</h2>
            <p className="text-white/80 mb-6">There are no questions available for this assessment.</p>
            <Button
              onClick={() => {
                if (state.assessmentSource === 'learning' && concept) {
                  navigate(`/learning/${encodeURIComponent(concept)}`);
                  return;
                }
                const sid = localStorage.getItem('studentId');
                navigate(sid ? `/lms` : "/lms");
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Return
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <AnimatedBackground />
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 relative z-10 border border-gray-200">
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                Before You Begin
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    This Assessment evaluates your understanding of all <strong>Learning Objectives</strong> in this Unit.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Complete the assessment within <strong>{assessmentConfig?.durationInMinutes || 0} minutes</strong>
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    A score of <strong>{assessmentConfig?.masteryThreshold || 0}%</strong> or higher is required to achieve Mastery
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    If mastery is not achieved, <strong>Remediation</strong> content will be assigned
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You may Retake the assessment up to <strong>{assessmentConfig?.maxRemediation || 0} times</strong>
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="confirmation"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="w-5 h-5 border-gray-300 rounded cursor-pointer"
                  />
                  <Label 
                    htmlFor="confirmation" 
                    className="text-gray-700 text-sm leading-relaxed cursor-pointer select-none"
                  >
                    I have read and understood the assessment information above
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setShowConfirmation(false);
                    startTimer();
                  }}
                  disabled={!isConfirmed}
                  className={`font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${
                    isConfirmed 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Agree & Start Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => {
                if (state.assessmentSource === 'learning' && concept) {
                  navigate(`/learning/${encodeURIComponent(concept)}`);
                  return;
                }
                const sid = localStorage.getItem('studentId');
                navigate(sid ? `/lms` : "/lms");
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {/* <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                No time limit
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <BookOpen className="h-4 w-4" />
                {concept || "Full Assessment"}
              </div>
            </div> */}
            
            {/* Timer Component */}
            {assessmentConfig?.isTimed && (
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${
                timeExpired 
                  ? 'bg-red-100 border-red-500 animate-pulse' 
                  : isSeventyPercentPassed
                  ? 'bg-red-100 border-red-500 animate-pulse'
                  : 'bg-blue-100 border-blue-500'
              }`}>
                <Timer className={`h-5 w-5 ${
                  timeExpired ? 'text-red-600 animate-pulse' : 
                  isSeventyPercentPassed
                  ? 'text-red-600 animate-pulse'
                  : 'text-blue-600'
                }`} />
                <span className={`font-mono font-bold text-lg ${
                  timeExpired ? 'text-red-600 animate-pulse' : 
                  isSeventyPercentPassed
                  ? 'text-red-600 animate-pulse'
                  : 'text-blue-600'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
                {timeExpired && <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />}
              </div>
            )}
          </div>

          {/* Enhanced Progress Section */}
          <div className="mb-6 animate-scale-in">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {courseNameFromApi || concept ? `${courseNameFromApi || concept} Assessment` : "Assessment"}
              </h1>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2 bg-white/50 overflow-hidden">
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
                  {currentQ?.concept || "Loading..."}
                </Badge>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">#{currentQ?.question_id || "..."}</span>
                </div>
              </div>
              <CardTitle className="text-xl leading-relaxed text-gray-800 relative">
                {currentQ?.question || "Loading question..."}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ?.question_id] || ""}
                onValueChange={(value) => handleAnswerChange(currentQ?.question_id, value)}
                className="space-y-1"
              >
                {currentQ?.options?.map((option, index) => (
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
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 ${index === currentQuestion
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
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Analysis Complete! 🎉
                </h3>
                <p className="text-muted-foreground mb-2 text-lg">
                  You scored {correctAnswers} out of {totalQuestions} questions correctly.
                </p>
                <p className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Score: {contextScore}%
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
