
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MCQAnswer {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  options: string[];
  isCorrect: boolean;
  explanation?: string;
}

interface MCQResultsViewProps {
  results: MCQAnswer[];
  conceptName: string;
}

const MCQResultsView: React.FC<MCQResultsViewProps> = ({ results, conceptName }) => {
  const correctCount = results.filter(r => r.isCorrect).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {conceptName} - MCQ Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <motion.div
                  className="text-4xl font-bold text-green-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  {correctCount}/{totalQuestions}
                </motion.div>
                <p className="text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center">
                <motion.div
                  className={`text-4xl font-bold ${
                    percentage >= 80 ? 'text-green-600' : 
                    percentage >= 50 ? 'text-orange-600' : 'text-red-600'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                >
                  {percentage}%
                </motion.div>
                <p className="text-muted-foreground">Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Individual Question Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <motion.div
            key={result.questionId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
              result.isCorrect 
                ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                : 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    {result.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium text-gray-800">
                      Question {index + 1}
                    </CardTitle>
                    <p className="text-gray-700 mt-1">{result.question}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Answer Options */}
                <div className="grid gap-2">
                  {result.options.map((option, optionIndex) => {
                    const isUserAnswer = option === result.userAnswer;
                    const isCorrectAnswer = option === result.correctAnswer;
                    
                    let bgColor = 'bg-gray-50 border-gray-200';
                    let textColor = 'text-gray-700';
                    let icon = null;
                    
                    if (isCorrectAnswer) {
                      bgColor = 'bg-green-100 border-green-300';
                      textColor = 'text-green-800';
                      icon = <CheckCircle className="h-4 w-4 text-green-600" />;
                    } else if (isUserAnswer && !result.isCorrect) {
                      bgColor = 'bg-red-100 border-red-300';
                      textColor = 'text-red-800';
                      icon = <XCircle className="h-4 w-4 text-red-600" />;
                    }
                    
                    return (
                      <motion.div
                        key={optionIndex}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${bgColor}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + optionIndex * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${textColor}`}>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </span>
                          <div className="flex items-center gap-2">
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-xs text-red-600 font-medium">Your Answer</span>
                            )}
                            {isCorrectAnswer && (
                              <span className="text-xs text-green-600 font-medium">Correct</span>
                            )}
                            {icon}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <motion.div
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800 text-sm">Explanation</h4>
                        <p className="text-blue-700 text-sm mt-1">{result.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MCQResultsView;
