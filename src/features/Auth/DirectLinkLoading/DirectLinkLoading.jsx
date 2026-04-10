import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '@api/base';
import { generateJWTToken } from '@api/auth';
import { useApp } from '@core/contexts/AppContext';
import { ROUTES } from '@core/constants/routes';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';

const DirectLinkLoading = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading, performanceData, isError } = useApp();
  const [error, setError] = useState(null);
  const authCalledRef = React.useRef(false);

  useEffect(() => {
    const initializeDirectLinkUser = async () => {
      try {
        console.log('URL Search Params:', Object.fromEntries(searchParams));

        let studentGuid = searchParams.get('student_guid') || searchParams.get('student_id') || searchParams.get('studentId');
        let courseGuid = searchParams.get('course_guid') || searchParams.get('course_id') || searchParams.get('courseId');

        if (!studentGuid || !courseGuid) {
          throw new Error('Authentication failed. Please try again.');
        }

        authCalledRef.current = true;

        // Persist GUIDs for assessment payloads
        if (studentGuid) localStorage.setItem('student_id', studentGuid);
        if (courseGuid) localStorage.setItem('course_id', courseGuid);
        if (courseGuid) localStorage.setItem('module_id', courseGuid);

        // Reset time tracking for a fresh launch session 
        try {
          const { resetTimeData } = await import('@core/utils/timeTracker');
          resetTimeData();
        } catch (e) {
          console.warn('Failed to reset time tracker:', e);
        }

        // Use token from URL if present; otherwise mint it using backend 
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
          setToken(tokenFromUrl);
        } else {
          const token = await generateJWTToken(studentGuid, courseGuid);
          if (!token) throw new Error('Authentication failed. Please try again.');
          setToken(token);
        }
      } catch (err) {
        console.error('Error initializing Direct Link user:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    if (!authCalledRef.current) {
      initializeDirectLinkUser();
    }
  }, [searchParams]);

  // Navigate once AppContext is ready
  useEffect(() => {
    // Condition check: once we've at least STARTED auth, and AppContext is done loading
    if (!isLoading && authCalledRef.current && !error) {
      if (performanceData?.conceptPerformance?.length > 0) {
        console.log('User has existing scores, navigating to evaluation');
        navigate(ROUTES.EVALUATION);
      } else if (performanceData) {
        console.log('No existing scores (conceptPerformance empty or null), navigating to confirmation');
        navigate(ROUTES.CONFIRMATION);
      }
    }
  }, [isLoading, performanceData, navigate, error]);

  if (error) {
    return (
      <ErrorPage
        error={error}
        title="Authentication Error"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <Loader
      title="Initializing your learning session...."
      subtitle="Verifying credentials and preparing your environment."
    />
  );
};

export default DirectLinkLoading;
