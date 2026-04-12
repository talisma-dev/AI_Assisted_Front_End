import React, { Suspense, forwardRef } from 'react';
import Loader from '../../shared/components/Loader/Loader';

const withSuspense = (Component, loadingText = "Loading...") => {
  const WrappedComponent = forwardRef((props, ref) => (
    <Suspense fallback={<Loader text={loadingText} />}>
      <Component {...props} ref={ref} />
    </Suspense>
  ));

  WrappedComponent.displayName = `withSuspense(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export default withSuspense;
