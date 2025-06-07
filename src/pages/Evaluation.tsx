import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EnhancedLogout from "@/components/EnhancedLogout";
import AnimatedScore from "@/components/AnimatedScore";
import RubricFilterTabs from "@/components/RubricFilterTabs";
import FloatingElements from "@/components/FloatingElements";
import MCQResultsView from "@/components/MCQResultsView";
import { ArrowLeft, BookOpen, CheckCircle, AlertTriangle, XCircle, Trophy, Target, TrendingUp, Award, Brain, Sparkles, Clock, BarChart, Eye, EyeOff } from "lucide-react";

const Evaluation = () => {
  const { state, setShowCongratulations } = useApp();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'mastery' | 'remediation' | 'intervention'>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showMotivation, setShowMotivation] = useState(true);
  const [showMCQResults, setShowMCQResults] = useState<string | null>(null);

  // Mock MCQ results data - in a real app, this would come from your state/API
  const mockMCQResults = {
    "Machine Learning Fundamentals": [
      {
        questionId: "ml-1",
        question: "What is the primary goal of supervised learning?",
        userAnswer: "To learn from labeled data to make predictions",
        correctAnswer: "To learn from labeled data to make predictions",
        options: [
          "To learn from labeled data to make predictions",
          "To find hidden patterns in unlabeled data",
          "To maximize rewards through trial and error",
          "To reduce dimensionality of data"
        ],
        isCorrect: true,
        explanation: "Supervised learning uses labeled training data to learn a mapping function that can make predictions on new, unseen data."
      },
      {
        questionId: "ml-2",
        question: "Which algorithm is best for classification tasks?",
        userAnswer: "Linear Regression",
        correctAnswer: "Random Forest",
        options: [
          "Linear Regression",
          "Random Forest",
          "K-Means Clustering",
          "Principal Component Analysis"
        ],
        isCorrect: false,
        explanation: "Random Forest is a powerful ensemble method for classification, while Linear Regression is used for regression tasks."
      }
    ]
  };

  const masteryAchieved = state.conceptScores.filter(cs => cs.status === 'mastery');
  const remediationRequired = state.conceptScores.filter(cs => cs.status === 'remediation');
  const needsIntervention = state.conceptScores.filter(cs => cs.status === 'intervention');

  const allMastered = masteryAchieved.length === state.conceptScores.length;

  const filteredConcepts = state.conceptScores.filter(concept => {
    if (activeFilter === 'all') return true;
    return concept.status === activeFilter;
  });

  const filterCounts = {
    all: state.conceptScores.length,
    mastery: masteryAchieved.length,
    remediation: remediationRequired.length,
    intervention: needsIntervention.length
  };

  const handleNextModule = () => {
    setShowCongratulations(true);
  };

  const handleLearnMore = (concept: string) => {
    navigate(`/learning/${encodeURIComponent(concept)}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'mastery':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'remediation':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'intervention':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastery':
        return 'from-green-50 via-emerald-50 to-green-50 border-green-200 shadow-green-100';
      case 'remediation':
        return 'from-orange-50 via-yellow-50 to-orange-50 border-orange-200 shadow-orange-100';
      case 'intervention':
        return 'from-red-50 via-pink-50 to-red-50 border-red-200 shadow-red-100';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'mastery':
        return 'Mastered';
      case 'remediation':
        return 'Needs Review';
      case 'intervention':
        return 'Contact Advisor';
      default:
        return 'Unknown';
    }
  };

  const ConceptCard = ({ concept, index }: { concept: any; index: number }) => {
    const isExpanded = expandedCard === concept.concept;
    const showingMCQ = showMCQResults === concept.concept;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          scale: 1.02,
          rotateY: 2,
          transition: { duration: 0.2 }
        }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-xl blur-xl"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        />
        
        <Card 
          className={`relative bg-gradient-to-r ${getStatusColor(concept.status)} border shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm`}
          onClick={() => setExpandedCard(isExpanded ? null : concept.concept)}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0"
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <CardHeader className="pb-3 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-2 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ 
                    rotate: [0, 2, -2, 0],
                    boxShadow: [
                      "0 4px 6px rgba(0, 0, 0, 0.1)",
                      "0 8px 15px rgba(59, 130, 246, 0.3)",
                      "0 4px 6px rgba(0, 0, 0, 0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {getStatusIcon(concept.status)}
                </motion.div>
                <div>
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    {concept.concept}
                  </CardTitle>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge 
                      variant={concept.status === 'mastery' ? 'default' : 'secondary'} 
                      className="mt-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    >
                      {concept.label}
                    </Badge>
                  </motion.div>
                </div>
              </div>
              <motion.div
                animate={{
                  rotateY: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AnimatedScore 
                  score={concept.score} 
                  status={concept.status} 
                  size={60}
                  showCelebration={concept.score > 80}
                />
              </motion.div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${
                      concept.status === 'mastery' ? 'bg-green-500' :
                      concept.status === 'remediation' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    animate={{
                      scale: concept.status === 'mastery' ? [1, 1.2, 1] : 1,
                      boxShadow: concept.status === 'mastery' ? [
                        "0 0 0 rgba(34, 197, 94, 0.4)",
                        "0 0 20px rgba(34, 197, 94, 0.6)",
                        "0 0 0 rgba(34, 197, 94, 0.4)"
                      ] : "none"
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="font-medium">{getStatusText(concept.status)}</span>
                </div>
                {concept.attempts > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {concept.attempts} attempts
                  </div>
                )}
              </div>

              {/* MCQ Results Toggle */}
              {mockMCQResults[concept.concept as keyof typeof mockMCQResults] && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMCQResults(showingMCQ ? null : concept.concept);
                    }}
                  >
                    {showingMCQ ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showingMCQ ? 'Hide' : 'View'} MCQ Results
                  </Button>
                </motion.div>
              )}

              {/* MCQ Results Display */}
              <AnimatePresence>
                {showingMCQ && mockMCQResults[concept.concept as keyof typeof mockMCQResults] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <MCQResultsView
                      results={mockMCQResults[concept.concept as keyof typeof mockMCQResults]}
                      conceptName={concept.concept}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ... keep existing code for expanded card content and learn more button */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Concept Overview
                        </h4>
                        <p className="text-xs text-gray-600">
                          This concept focuses on understanding and applying key principles in machine learning and data analysis.
                        </p>
                      </div>
                      
                      {concept.attempts > 0 && (
                        <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Learning Journey
                          </h4>
                          <div className="space-y-1">
                            {Array.from({ length: concept.attempts }, (_, i) => (
                              <div key={i} className="text-xs flex items-center gap-2">
                                <motion.div 
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                />
                                Attempt {i + 1} - {i === concept.attempts - 1 ? 'Latest' : 'Previous'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {concept.status === 'remediation' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 hover:from-orange-100 hover:to-yellow-100 transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore(concept.concept);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative z-10">
      <FloatingElements />
      <EnhancedLogout />
      
      {/* Motivational AI Tutor Tip */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0, y: -100, rotateX: -90 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotateX: 0,
              scale: [1, 1.02, 1]
            }}
            exit={{ opacity: 0, y: -100, rotateX: -90 }}
            transition={{ 
              duration: 0.8,
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
          >
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-xl shadow-2xl">
              <div className="bg-white rounded-lg p-4 relative backdrop-blur-sm">
                <button
                  onClick={() => setShowMotivation(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 4px 6px rgba(0, 0, 0, 0.1)",
                        "0 8px 25px rgba(59, 130, 246, 0.4)",
                        "0 4px 6px rgba(0, 0, 0, 0.1)"
                      ]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-800">AI Learning Assistant</h3>
                    <p className="text-xs text-gray-600">Your personalized guide</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  🎉 Great job completing your assessment! Your personalized learning pathway is ready. Focus on areas that need improvement and celebrate your victories!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div whileHover={{ x: -5 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/module")}
                className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Module
              </Button>
            </motion.div>
            <motion.div 
              className="text-right"
              animate={{
                y: [0, -2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Assessment Results
              </h1>
              <p className="text-muted-foreground text-lg">Your Personalized Learning Pathway</p>
            </motion.div>
          </motion.div>

          {/* Enhanced Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div 
                    className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      boxShadow: [
                        "0 10px 20px rgba(0, 0, 0, 0.1)",
                        "0 20px 40px rgba(59, 130, 246, 0.3)",
                        "0 10px 20px rgba(0, 0, 0, 0.1)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Target className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Thank you for completing the assessment!
                    </CardTitle>
                    <p className="text-muted-foreground text-lg">
                      Based on your engagement and performance, we've crafted your Personalized Learning Pathway to support your continued growth and success.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <motion.div 
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    animate={{
                      boxShadow: [
                        "0 4px 6px rgba(0, 0, 0, 0.1)",
                        "0 8px 25px rgba(34, 197, 94, 0.2)",
                        "0 4px 6px rgba(0, 0, 0, 0.1)"
                      ]
                    }}
                    transition={{
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <motion.div 
                      className="text-3xl font-bold text-green-600 mb-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {masteryAchieved.length}
                    </motion.div>
                    <div className="text-sm text-green-700 font-medium">Mastery Achieved</div>
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-2" />
                  </motion.div>
                  <motion.div 
                    className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <motion.div 
                      className="text-3xl font-bold text-orange-600 mb-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                    >
                      {remediationRequired.length}
                    </motion.div>
                    <div className="text-sm text-orange-700 font-medium">Remediation Required</div>
                    <AlertTriangle className="h-5 w-5 text-orange-500 mx-auto mt-2" />
                  </motion.div>
                  <motion.div 
                    className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <motion.div 
                      className="text-3xl font-bold text-red-600 mb-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                    >
                      {needsIntervention.length}
                    </motion.div>
                    <div className="text-sm text-red-700 font-medium">Needs External Intervention</div>
                    <XCircle className="h-5 w-5 text-red-500 mx-auto mt-2" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filter Tabs */}
          <RubricFilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />

          {/* Filtered Concepts */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence mode="popLayout">
              {filteredConcepts.map((concept, index) => (
                <ConceptCard key={concept.concept} concept={concept} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Next Module Button */}
          {allMastered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <motion.div 
                      className="inline-flex p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 10px 20px rgba(0, 0, 0, 0.1)",
                          "0 20px 40px rgba(251, 191, 36, 0.4)",
                          "0 10px 20px rgba(0, 0, 0, 0.1)"
                        ]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatDelay: 1 
                      }}
                    >
                      <Trophy className="h-8 w-8 text-white" />
                    </motion.div>
                    <div className="flex justify-center gap-2 mb-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        >
                          <Award className="h-6 w-6 text-yellow-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-green-800 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Outstanding Achievement! 🎉
                  </h3>
                  <p className="text-green-700 mb-6 text-lg">
                    You've mastered all concepts in this module with exceptional performance. You're ready to advance to the next level of your learning journey!
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleNextModule}
                      size="lg"
                      className="h-14 px-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Trophy className="h-6 w-6 mr-3" />
                      ADVANCE TO NEXT MODULE
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
