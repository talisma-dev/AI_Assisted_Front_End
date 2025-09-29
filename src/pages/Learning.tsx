import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Target, Lightbulb, FileText, Clock, Users, Award, Loader2, Repeat } from "lucide-react";
import clsx from "clsx";
import { getQuestionsData } from "@/api/getQuestionsData";
import { useState, useEffect } from 'react';
import { generateCourseContent } from '@/api/generateCourseContent';

// Add a module-level cache for microconcepts and videourls
const microconceptCache: Record<string, { microconcepts: any[]; videourls: any[] }> = {};

const Learning = () => {
  const { concept } = useParams();
  const { state, setAssessmentQuestions, setAssessmentSource, setMicroconcepts: setGlobalMicroconcepts, setVideourls: setGlobalVideourls } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Learning component - Raw concept from params:', concept);
  const decodedConcept = decodeURIComponent(concept || "");
  console.log('Learning component - Decoded concept:', decodedConcept);
  const conceptData = state.conceptScores.find(cs => cs.concept === decodedConcept);
  console.log('Learning component - Found concept data:', conceptData);

  const [microconcepts, setMicroconcepts] = useState(() => {
    return state.microconcepts[decodedConcept] || [];
  });
  const [videourls, setVideoUrls] = useState(() => {
    return state.videourls[decodedConcept] || [];
  });

  const [loadingContent, setLoadingContent] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    // If microconcepts/videourls are in global state, use them
    if ((state.microconcepts[decodedConcept]?.length > 0 || state.videourls[decodedConcept]?.length > 0)) {
      setMicroconcepts(state.microconcepts[decodedConcept] || []);
      setVideoUrls(state.videourls[decodedConcept] || []);
      setLoadingContent(false);
      setApiError('');
      return;
    }
    // If not, fetch from new course content API
    if ((microconcepts.length === 0 && videourls.length === 0) && !loadingContent && !apiError) {
      setLoadingContent(true);
      setApiError('');
      const conceptName = conceptData?.concept || decodedConcept;
      generateCourseContent(conceptName)
        .then(res => {
          // Map micro_learnings into prior structures
          const textItems = (res.micro_learnings || []).filter(i => i.content_type === 'Text');
          const urlItems = (res.micro_learnings || []).filter(i => i.content_type === 'URL');
          const mcs = textItems.map(i => ({ microconcept: i.content_heading, content: i.text }));
          const vus = urlItems.map(i => ({ microconcept: i.content_heading, url: i.url }));
          setMicroconcepts(mcs);
          setVideoUrls(vus);
          setGlobalMicroconcepts(decodedConcept, mcs);
          setGlobalVideourls(decodedConcept, vus);
        })
        .catch(() => {
          setApiError('Failed to load content. Please try again.');
        })
        .finally(() => {
          setLoadingContent(false);
        });
    }
    // eslint-disable-next-line
  }, [location.state, decodedConcept]);

  const handleReadyToTest = () => {
    if (setAssessmentSource) setAssessmentSource('learning');
    setAssessmentQuestions([]); // Optionally clear previous questions
    // Always use the canonical concept name from conceptData if available
    const conceptName = conceptData?.concept || decodedConcept;
    navigate(`/assessment/${encodeURIComponent(conceptName)}`, { state: { conceptName } });
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

  // Combine all microconcepts and videos into a single list for display
  const allMicroconcepts = [
    ...microconcepts.map(mc => ({
      type: 'content',
      microconcept: mc.microconcept,
      content: mc.content
    })),
    ...videourls.map(v => ({
      type: 'video',
      microconcept: v.microconcept,
      videoUrl: v.url
    }))
  ];

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
          {/* <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg">
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
          </Card> */}

          {/* Key Learning Points with enhanced styling */}
          {/* <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg" style={{ animationDelay: '0.1s' }}>
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
          </Card> */}

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
              {loadingContent ? (
                <div className="w-full flex flex-col items-center justify-center py-16 space-y-4 bg-gradient-to-br from-blue-50 to-purple-100 rounded-xl shadow-md">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-300 opacity-75 w-16 h-16" />
                    <div className="relative z-10">
                      <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-700 tracking-wide text-center">
                    Loading your personalized microconcepts...
                  </div>
                  <div className="text-sm text-gray-600 text-center max-w-md">
                    We're analyzing your performance to craft tailored content that supports your progress and goals.
                  </div>
                </div>
              ) : apiError ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-2xl text-red-500 font-bold mb-2">Oops! Something went wrong.</div>
                  <div className="text-gray-600 mb-4">{apiError}</div>
                  {/* <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold">Try Again</Button> */}
                </div>
              ) : (
                <div className={`grid ${allMicroconcepts.length === 0 ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4 w-full`}>
                  {allMicroconcepts.length > 0 ? (
                    allMicroconcepts.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if ('videoUrl' in item) {
                            navigate(`/learning/${encodeURIComponent(decodedConcept)}/microconcept/${encodeURIComponent(item.microconcept)}`, { state: { videoUrl: item.videoUrl, microconcepts, videourls } });
                          } else if ('content' in item) {
                            navigate(`/learning/${encodeURIComponent(decodedConcept)}/microconcept/${encodeURIComponent(item.microconcept)}`, { state: { content: item.content, microconcepts, videourls } });
                          }
                        }}
                        className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {item.type === 'video'
                            ? <Play className="h-5 w-5 text-red-600" />
                            : <BookOpen className="h-5 w-5 text-green-600" />}
                          <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                            {item.microconcept}
                          </h4>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transform rotate-180 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center py-16 space-y-4 bg-gradient-to-br from-blue-50 to-purple-100 rounded-xl shadow-md">
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-blue-300 opacity-75 w-16 h-16" />
                        <div className="relative z-10">
                          <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                        </div>
                      </div>
                      <div className="text-xl font-bold text-blue-700 tracking-wide text-center">
                        Loading your personalized microconcepts...
                      </div>
                      <div className="text-sm text-gray-600 text-center max-w-md">
                        We're analyzing your performance to craft tailored content that supports your progress and goals.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Action Section */}
        <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-8 text-center">
            <div>
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