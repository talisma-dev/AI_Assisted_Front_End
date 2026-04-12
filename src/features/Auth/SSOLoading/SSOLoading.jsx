import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken, removeToken } from '@api/base';
import { generateAccessTokenbySSO } from '@api/auth';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';
import { AlertTriangle } from 'lucide-react';

import { useApp } from '@core/contexts/AppContext';

const SSOLoading = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading, performanceData } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);
  const [error, setError] = useState(null);
  const authCalledRef = React.useRef(false);

  useEffect(() => {
    const initializeSSOUser = async () => {
      try {
        removeToken();

        const verificationToken = searchParams.get('token');
        if (!verificationToken) throw new Error('Authentication failed. Please try again.');

        setIsProcessing(true);
        authCalledRef.current = true;

        console.log('SSO Token from URL:', verificationToken);

        // Step 1: Generate access token using SSO token
        const ssoResponse = await generateAccessTokenbySSO(verificationToken);
        console.log('SSO Response:', ssoResponse);

        if (!ssoResponse || !ssoResponse?.accessToken || !ssoResponse?.redirectUrl) {
          throw new Error('Authentication failed. Please try again.');
        }

        // Step 2: Set the JWT token and persist GUIDs for later assessment calls
        setToken(ssoResponse.accessToken);

        // Extract IDs from response or fallback to parsing the redirectUrl
        let studentGuid = ssoResponse.studentGuid;
        let courseGuid = ssoResponse.courseGuid;

        if (ssoResponse.redirectUrl) {
          try {
            const urlObj = new URL(ssoResponse.redirectUrl.startsWith('http') ? ssoResponse.redirectUrl : window.location.origin + ssoResponse.redirectUrl);
            studentGuid = studentGuid || urlObj.searchParams.get('student_guid');
            courseGuid = courseGuid || urlObj.searchParams.get('course_guid');
          } catch (e) { console.warn('Failed to parse redirectUrl for GUIDs'); }
        }

        if (studentGuid) localStorage.setItem('student_id', studentGuid);
        if (courseGuid) localStorage.setItem('course_id', courseGuid);
        if (courseGuid) localStorage.setItem('module_id', courseGuid);

        console.log('JWT Token and GUIDs set successfully:', { studentGuid, courseGuid });

        // Reset time tracking for a fresh launch session 
        try {
          const { resetTimeData } = await import('@core/utils/timeTracker');
          resetTimeData();
        } catch (e) {
          console.warn('Failed to reset time tracker:', e);
        }

        // Step 3: Normalize the redirectUrl to stay on localhost (strip domain if absolute)
        let finalPath = ssoResponse.redirectUrl;
        if (finalPath) {
          try {
            if (finalPath.startsWith('http')) {
              const normalizedLink = finalPath.replace(/^https?:\/([^\/])/, 'https://$1');
              const urlObj = new URL(normalizedLink);
              finalPath = urlObj.pathname + urlObj.search;
            }
          } catch (e) {
            console.warn('Redirect URL normalization failed, using as-is:', e);
          }
        }

        setRedirectPath(finalPath);
        setIsProcessing(false);
      }
      catch (err) {
        console.error('Error initializing SSO user:', err);
        setError('Authentication failed. Please try again.');
        setIsProcessing(false);
      }
    };

    if (!authCalledRef.current) {
      initializeSSOUser();
    }
  }, [searchParams]);

  // Navigate once AppContext is ready and auth is done
  useEffect(() => {
    if (!isLoading && authCalledRef.current && !isProcessing && !error) {
      if (redirectPath && redirectPath.includes('/assessment')) {
        navigate('/confirmation');
      } else if (redirectPath && redirectPath !== '/') {
        navigate(redirectPath);
      } else if (performanceData?.conceptPerformance?.length > 0) {
        navigate('/evaluation');
      } else if (performanceData) {
        navigate('/confirmation');
      }
    }
  }, [isLoading, performanceData, navigate, isProcessing, redirectPath, error]);

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
      title="Initializing your learning session....."
      subtitle="Verifying credentials and preparing your environment."
    />
  );
};

export default SSOLoading;
