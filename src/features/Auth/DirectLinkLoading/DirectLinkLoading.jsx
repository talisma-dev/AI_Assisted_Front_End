import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, removeToken } from '@api/base';
import { generateJWTToken } from '@api/auth';
import { fetchStudentProfile } from '@core/store/studentProfileActions';
import { clearProfile } from '@core/store/studentProfileSlice';
import { useApp } from '@core/contexts/AppContext';
import { ROUTES } from '@core/constants/routes';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';

const DirectLinkLoading = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, performanceData, isError } = useApp();
  const [error, setError] = useState(null);
  const authCalledRef = React.useRef(false);

  useEffect(() => {
    const initializeDirectLinkUser = async () => {
      try {

        let studentGuid = searchParams.get('student_guid') || searchParams.get('student_id') || searchParams.get('studentId');
        let courseGuid = searchParams.get('course_guid') || searchParams.get('course_id') || searchParams.get('courseId');

        if (!studentGuid || !courseGuid) {
          throw new Error('Authentication failed. Please try again.');
        }

        authCalledRef.current = true;
        removeToken();
        dispatch(clearProfile());

        // Persist GUIDs for assessment payloads
        if (studentGuid) localStorage.setItem('student_id', studentGuid);
        if (courseGuid) localStorage.setItem('course_id', courseGuid);
        if (courseGuid) localStorage.setItem('module_id', courseGuid);

        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
          setToken(tokenFromUrl);
        } else {
          const token = await generateJWTToken(studentGuid, courseGuid);
          if (!token) throw new Error('Authentication failed. Please try again.');
          setToken(token);
        }

        // Fetch student profile immediately after login
        try {
          await dispatch(fetchStudentProfile());
          } catch (profileErr) {
          console.warn('Failed to fetch student profile after DirectLink login:', profileErr);
        }

        // Reset time tracking for a fresh launch session
        try {
          const { resetTimeData } = await import('@core/utils/timeTracker');
          resetTimeData();
        } catch (e) {
          console.warn('Failed to reset time tracker:', e);
        }
      } catch (err) {
        console.error('Error initializing Direct Link user:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    if (!authCalledRef.current) {
      initializeDirectLinkUser();
    }
  }, [searchParams, dispatch]);

  // Navigate once AppContext is ready
  useEffect(() => {
    if (!isLoading && authCalledRef.current && !error) {
      if (performanceData?.conceptPerformance?.length > 0) {
        navigate(ROUTES.EVALUATION);
      } else if (performanceData) {
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
