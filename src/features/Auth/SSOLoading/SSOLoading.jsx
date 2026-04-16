import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, removeToken } from '@api/base';
import { generateAccessTokenbySSO } from '@api/auth';
import { clearProfile } from '@core/store/studentProfileSlice';
import { fetchStudentProfile } from '@core/store/studentProfileActions';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';

const SSOLoading = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);
  const [error, setError] = useState(null);
  const authCalledRef = React.useRef(false);

  useEffect(() => {
    const initializeSSOUser = async () => {
      try {
        removeToken();
        dispatch(clearProfile());

        const verificationToken = searchParams.get('token');
        if (!verificationToken) throw new Error('Authentication failed. Please try again.');

        setIsProcessing(true);
        authCalledRef.current = true;

        // Step 1: Generate access token using SSO token
        const ssoResponse = await generateAccessTokenbySSO(verificationToken);

        if (!ssoResponse?.accessToken || !ssoResponse?.redirectUrl) {
          throw new Error('Authentication failed. Please try again.');
        }

        // Extract IDs from response or fallback to parsing the redirectUrl
        let studentGuid = ssoResponse.studentGuid;
        let courseGuid = ssoResponse.courseGuid;

        let finalPath = ssoResponse.redirectUrl;
        if (finalPath) {
          try {
            if (finalPath.startsWith('http')) {
              const normalizedLink = finalPath.replace(/^https?:\/([^\/])/, 'https://$1');
              const urlObj = new URL(normalizedLink);
              finalPath = urlObj.pathname + urlObj.search;
              studentGuid = studentGuid || urlObj.searchParams.get('student_guid');
              courseGuid = courseGuid || urlObj.searchParams.get('course_guid');
            }
          } catch (e) {
            console.warn('Redirect URL normalization failed, using as-is:', e);
          }
        }

        const isAssessmentRoute = finalPath === '/assessment' || finalPath === '/confirmation';
        sessionStorage.setItem('isAssessmentRoute', isAssessmentRoute ? 'true' : 'false');

        setToken(ssoResponse.accessToken, Math.floor(ssoResponse.accessTokenExpiry - (Date.now() / 1000)));

        if (studentGuid) localStorage.setItem('student_id', studentGuid);
        if (courseGuid) localStorage.setItem('course_id', courseGuid);

        // Fetch student profile immediately after login
        try {
          await dispatch(fetchStudentProfile());
        } catch (profileErr) {
          console.warn('Failed to fetch student profile after login:', profileErr);
        }

        // Reset time tracking for a fresh launch session
        try {
          const { resetTimeData } = await import('@core/utils/timeTracker');
          resetTimeData();
        } catch (e) {
          console.warn('Failed to reset time tracker:', e);
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

  useEffect(() => {
    if (authCalledRef.current && !isProcessing && !error && redirectPath) {
        navigate(redirectPath);
    }
  }, [navigate, isProcessing, redirectPath, error]);

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
