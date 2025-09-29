import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, BookOpen, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

const Microconcept = () => {
  const { concept, microconcept } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const decodedConcept = decodeURIComponent(concept || '');
  const decodedMicroconcept = decodeURIComponent(microconcept || '');
  const { content, videoUrl } = location.state || {};
  const [videoLoading, setVideoLoading] = useState(!!videoUrl);

  // Helper to render markdown or HTML content
  const renderContent = (content: string) => {
    if (!content) return <div className="text-gray-500">No content available.</div>;
    return (
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in pt-6 px-6">
          <Button
            variant="ghost"
            onClick={() => {
              const { microconcepts, videourls } = location.state || {};
              navigate(`/learning/${encodeURIComponent(decodedConcept)}`, {
                state: microconcepts || videourls ? { microconcepts, videourls } : undefined
              });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Learning
          </Button>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Microconcept
          </Badge>
        </div>

        {/* Resource Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-0 shadow-xl animate-scale-in mx-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                {videoUrl ? (
                  <Play className="h-6 w-6 text-white" />
                ) : (
                  <BookOpen className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {decodedMicroconcept}
                </CardTitle>
                <p className="text-muted-foreground">Part of {decodedConcept}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Resource Content */}
        <Card className="flex-1 border-0 shadow-xl animate-fade-in mx-6 mb-8 overflow-hidden">
          <CardContent className="p-0 h-full">
            {videoUrl ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="w-full h-full flex-1 flex items-center justify-center relative">
                  {videoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                      <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                    </div>
                  )}
                  <div className="w-full h-full aspect-video max-h-[70vh] rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={videoUrl.replace('youtu.be/', 'youtube.com/embed/')}
                      title={decodedMicroconcept}
                      className="w-full h-full min-h-[300px]"
                      frameBorder="0"
                      allowFullScreen
                      onLoad={() => setVideoLoading(false)}
                    />
                  </div>
                </div>
                {/* <div className="text-center py-4">
                  <p className="text-gray-600 text-lg">
                    Watch the video above to learn about {decodedMicroconcept}
                  </p>
                </div> */}
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[70vh] p-8">
                {renderContent(content)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Microconcept; 