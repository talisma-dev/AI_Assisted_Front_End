import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStudentProfile } from '@core/store/studentProfileActions';
import { isTokenValid } from '@api/base';
import Loader from '@shared/components/Loader/Loader';

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

  // Fetch profile on mount if needed
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

  // Periodic token validity check (every 5 minutes)
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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Failed to load profile</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => dispatch(fetchStudentProfile())}>Retry</button>
          {(isAuthError || !isTokenValid()) && (
            <button 
              onClick={() => navigate('/sso', { replace: true })}
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
