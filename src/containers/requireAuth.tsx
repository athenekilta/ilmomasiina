import React, { ComponentType, useEffect } from 'react';

import { redirectToLogin } from '../modules/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../store/reducers';

export default function requireAuth<P>(WrappedComponent: ComponentType<P>) {
  const InnerComponent = (props: P) => {
    const dispatch = useTypedDispatch();
    const { accessToken, accessTokenExpires } = useTypedSelector(
      (state) => state.auth,
    );

    useEffect(() => {
      let newExpires;
      if (!accessTokenExpires) {
        redirectToLogin();
      }
      if (typeof accessTokenExpires === 'string') {
        newExpires = new Date(accessTokenExpires);
      }
      if (newExpires && newExpires < new Date()) {
        dispatch(redirectToLogin());
      }
    }, []);

    if (!accessToken) {
      dispatch(redirectToLogin());
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  return InnerComponent;
}
