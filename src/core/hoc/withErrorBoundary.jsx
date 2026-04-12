import React, { forwardRef } from 'react';
import ErrorBoundary from '../../shared/components/ErrorBoundary/ErrorBoundary';

const withErrorBoundary = (Component, errorProps = {}) => {
  const WrappedComponent = forwardRef((props, ref) => (
    <ErrorBoundary {...errorProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export default withErrorBoundary;
