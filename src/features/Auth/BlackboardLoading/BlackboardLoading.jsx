import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, removeToken } from '@api/base';
import { fetchStudentProfile } from '@core/store/studentProfileActions';
import { clearProfile } from '@core/store/studentProfileSlice';
import { useApp } from '@core/contexts/AppContext';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';

const BlackboardLoading = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, performanceData } = useApp();
  const [error, setError] = useState(null);
  const authCalledRef = React.useRef(false);

  // Step 1: Set token from URL (synchronous, no API call needed)
  useEffect(() => {
  const initializeBlackboardUser = async () => {
    if (authCalledRef.current) return;

  try {
      const jwtToken = searchParams.get('token');
      if (!jwtToken) throw new Error('Authentication failed. Please try again.');

      authCalledRef.current = true;
      removeToken();
      dispatch(clearProfile());

      setToken(jwtToken);
      try {
        await dispatch(fetchStudentProfile());
      } catch (profileErr) {
        console.warn('Failed to fetch student profile after Blackboard login:', profileErr);
      }
    } catch (err) {
      console.error('Error initializing Blackboard user:', err);
      setError('Authentication failed. Please try again.');
    }
  };

  initializeBlackboardUser();
  }, [searchParams, dispatch]);

  // Step 2: Navigate once AppContext has loaded data (triggered by token-changed event)
  useEffect(() => {
    if (!isLoading && authCalledRef.current && !error) {
      if (performanceData?.conceptPerformance?.length > 0) {
        navigate('/evaluation');
      } else if (performanceData) {
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
