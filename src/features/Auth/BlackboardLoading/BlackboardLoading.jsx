import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '@api/base';
import { useApp } from '@core/contexts/AppContext';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';

const BlackboardLoading = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading, performanceData } = useApp();
  const [error, setError] = useState(null);
  const authCalledRef = React.useRef(false);

  // Step 1: Set token from URL (synchronous, no API call needed)
  useEffect(() => {
    if (authCalledRef.current) return;

    try {
      const jwtToken = searchParams.get('token');
      if (!jwtToken) throw new Error('Authentication failed. Please try again.');

      authCalledRef.current = true;
      setToken(jwtToken);
      console.log('Blackboard token set. Waiting for AppContext...');
    } catch (err) {
      console.error('Error initializing Blackboard user:', err);
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  // Step 2: Navigate once AppContext has loaded data (triggered by token-changed event)
  useEffect(() => {
    if (!isLoading && authCalledRef.current && !error) {
      if (performanceData?.conceptPerformance?.length > 0) {
        console.log('Existing scores found, navigating to /evaluation');
        navigate('/evaluation');
      } else if (performanceData) {
        console.log('No scores found, navigating to /confirmation');
        navigate('/confirmation');
      }
    }
  }, [isLoading, performanceData, navigate, error]);

  if (error) {
    return (
      <ErrorPage
        error={error}
        title="Authentication Error"
        message={error}
        useModal={true}
      />
    );
  }

  return (
    <Loader
      title="Initializing your learning session..."
      subtitle="Verifying credentials and preparing your environment."
    />
  );
};

export default BlackboardLoading;
