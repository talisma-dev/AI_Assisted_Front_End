import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '@/lib/auth';
import { getEvaluationData } from '@/api/auth';
import { useApp } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';

const BlackboardLoadingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setMicroconcepts, setVideourls } = useApp();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeBlackboardUser = async () => {
      try {
        const jwtToken = searchParams.get('token');
        if (!jwtToken) throw new Error('Missing token');
        setToken(jwtToken);
        const evaluationData = await getEvaluationData();
        if (evaluationData?.concepts) {
          evaluationData.concepts.forEach((concept: any) => {
            if (concept.microconcepts) setMicroconcepts(concept.name, concept.microconcepts);
            if (concept.videourls) setVideourls(concept.name, concept.videourls);
          });
        }
        navigate('/evaluation');
      } catch (err) {
        console.error('Error initializing Blackboard user:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize user session');
      }
    };

    initializeBlackboardUser();
  }, [searchParams, navigate, setMicroconcepts, setVideourls]);

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
        <div className="text-xl font-semibold text-gray-700 mb-2">Initializing your learning session...</div>
        <div className="text-gray-500">Please wait while we set up your evaluation data.</div>
      </div>
    </div>
  );
};

export default BlackboardLoadingPage;
