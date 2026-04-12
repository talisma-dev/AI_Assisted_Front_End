import React, { forwardRef } from 'react';
import Loader from '../../shared/components/Loader/Loader';

const withLoading = (Component, loadingProp = 'isLoading', loadingText = "Loading...") => {
  const WrappedComponent = forwardRef((props, ref) => {
    if (props[loadingProp]) {
      return <Loader text={loadingText} />;
    }
    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withLoading(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export default withLoading;
