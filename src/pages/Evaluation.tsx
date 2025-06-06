
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, CheckCircle, AlertTriangle, XCircle, Trophy } from "lucide-react";

const Evaluation = () => {
  const { state, setShowCongratulations } = useApp();
  const navigate = useNavigate();

  const masteryAchieved = state.conceptScores.filter(cs => cs.status === 'mastery');
  const remediationRequired = state.conceptScores.filter(cs => cs.status === 'remediation');
  const needsIntervention = state.conceptScores.filter(cs => cs.status === 'intervention');

  const allMastered = masteryAchieved.length === state.conceptScores.length;

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
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'remediation':
        return 'from-orange-50 to-yellow-50 border-orange-200';
      case 'intervention':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'mastery':
        return 'Completed';
      case 'remediation':
        return 'Needs Remediation';
      case 'intervention':
        return 'Contact Advisor';
      default:
        return 'Unknown';
    }
  };

  const ConceptCard = ({ concept }: { concept: any }) => (
    <Card className={`bg-gradient-to-r ${getStatusColor(concept.status)} border shadow-lg hover:shadow-xl transition-all duration-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(concept.status)}
            <CardTitle className="text-lg font-semibold">{concept.concept}</CardTitle>
          </div>
          <Badge variant={concept.status === 'mastery' ? 'default' : 'secondary'}>
            {concept.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Circle */}
          <div className="flex items-center justify-between">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-200"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${concept.score}, 100`}
                  className={
                    concept.status === 'mastery' ? 'text-green-500' :
                    concept.status === 'remediation' ? 'text-orange-500' : 'text-red-500'
                  }
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{concept.score}%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{getStatusText(concept.status)}</div>
              {concept.attempts > 0 && (
                <div className="text-xs text-muted-foreground">
                  Attempts: {concept.attempts}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {concept.status === 'remediation' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleLearnMore(concept.concept)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/module")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Module
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">Assessment Results</h1>
            <p className="text-muted-foreground">Your Personalized Learning Pathway</p>
          </div>
        </div>

        {/* Summary */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Thank you for completing the assessment!</CardTitle>
            <p className="text-muted-foreground">
              Based on your engagement and performance, we've crafted your Personalized Learning Pathway to support your continued growth and success.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{masteryAchieved.length}</div>
                <div className="text-sm text-muted-foreground">Mastery Achieved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{remediationRequired.length}</div>
                <div className="text-sm text-muted-foreground">Remediation Required</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{needsIntervention.length}</div>
                <div className="text-sm text-muted-foreground">Needs External Intervention</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mastery Achieved */}
        {masteryAchieved.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Mastery Achieved
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {masteryAchieved.map((concept) => (
                <ConceptCard key={concept.concept} concept={concept} />
              ))}
            </div>
          </div>
        )}

        {/* Remediation Required */}
        {remediationRequired.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Remediation Required
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {remediationRequired.map((concept) => (
                <ConceptCard key={concept.concept} concept={concept} />
              ))}
            </div>
          </div>
        )}

        {/* Needs External Intervention */}
        {needsIntervention.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Needs External Intervention
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {needsIntervention.map((concept) => (
                <ConceptCard key={concept.concept} concept={concept} />
              ))}
            </div>
          </div>
        )}

        {/* Next Module Button */}
        {allMastered && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Congratulations! 🎉
              </h3>
              <p className="text-green-700 mb-4">
                You've mastered all concepts in this module. You're ready to advance to the next level!
              </p>
              <Button 
                onClick={handleNextModule}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Next Module
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
