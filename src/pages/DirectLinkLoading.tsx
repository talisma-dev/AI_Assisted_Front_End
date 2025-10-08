import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '@/lib/auth';
import { generateJWTToken } from '@/api/auth';
import { useApp } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';
import { getEvaluateAssessmentScores } from '@/api/getEvaluateAssessmentScores';

const DirectLinkLoadingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAssessmentQuestions } = useApp();
  const [error, setError] = useState<string | null>(null);
  const {setConceptScores} = useApp();

  useEffect(() => {
    const initializeDirectLinkUser = async () => {
      try {
        const studentGuid = searchParams.get('student_guid');
        const courseGuid = searchParams.get('course_guid');
        if (!studentGuid || !courseGuid) throw new Error('Missing student_guid or course_guid');

        // Use token from URL if present; otherwise mint it using backend
        // const tokenFromUrl = searchParams.get('token');
        // let token = tokenFromUrl;
        // if (tokenFromUrl) {
        //   setToken(tokenFromUrl);
        // } else {
        //   token = await generateJWTToken(studentGuid, courseGuid);
        //   if (!token) throw new Error('Token generation failed');
        //   setToken(token);
        // }
         const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
          setToken(tokenFromUrl);
        } else {
          const token = await generateJWTToken(studentGuid, courseGuid);
          if (!token) throw new Error('Token generation failed');
          setToken(token);
        }

        // Checking already first assessment taken
        const evalScores = await getEvaluateAssessmentScores();
        if(evalScores && Array.isArray(evalScores.evaluationData) && evalScores.evaluationData.length > 0) {
          // User has already taken the assessment
            const mappedScores = evalScores.evaluationData.map(item => {
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
              };
          });
          setConceptScores(mappedScores);
          navigate('/evaluation');
        }
        else{ 
        // Do not prefetch assessment here to avoid duplicate generate calls
          setAssessmentQuestions([]);
          navigate('/assessment');
        }
      } catch (err) {
        console.error('Error initializing Direct Link user:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize user session');
      }
    };

    initializeDirectLinkUser();
  }, [searchParams, navigate, setAssessmentQuestions]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <div className="text-xl font-semibold text-gray-700 mb-2">Preparing your assessment...</div>
        <div className="text-gray-500">Please wait while we verify your access and fetch data.</div>
      </div>
    </div>
  );
};

export default DirectLinkLoadingPage; 