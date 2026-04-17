import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStudentProfile } from '@core/store/studentProfileActions';
import { isTokenValid } from '@api/base';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';

const PUBLIC_ROUTES = ['/sso', '/direct', '/lms', '/'];

const isPublicRoute = (pathname) => {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
};

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, isInitialized, error } = useSelector((state) => state.studentProfile);
  const fetchingRef = useRef(false);
  const pathname = window.location.pathname;

  useEffect(() => {
    if (isPublicRoute(pathname)) return;

    if (!profile && !isLoading && !isInitialized && !fetchingRef.current) {
      fetchingRef.current = true;
      dispatch(fetchStudentProfile())
        .catch((err) => {
          console.error('[ProtectedRoute] Profile fetch error:', err);
        })
        .finally(() => {
          fetchingRef.current = false;
        });
    }
  }, [dispatch, profile, isLoading, isInitialized, pathname]);

  useEffect(() => {
    if (isPublicRoute(pathname)) return;

    const interval = setInterval(() => {
      if (!isTokenValid()) {
        console.log('[ProtectedRoute] Token expired, redirecting to login');
        window.dispatchEvent(new CustomEvent('token-removed'));
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [pathname]);

  if (isPublicRoute(pathname)) {
    return children;
  }

  if (isLoading && !profile) {
    return <Loader title="Loading profile..." />;
  }

  if (error && !profile) {
    const isAuthError = error?.status === 401 || error?.message?.toLowerCase().includes('unauthorized');
    
    return (
      <ErrorPage
        error={error}
        title="Failed to Load Profile"
        message={isAuthError ? "Your session has expired. Please log in again." : error}
        onRetry={isAuthError ? () => navigate('/sso', { replace: true }) : () => dispatch(fetchStudentProfile())}
        showRetry={true}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
