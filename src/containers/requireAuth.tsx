import React, { useEffect } from 'react';

import { redirectToLogin } from '../modules/admin/actions';
import { useTypedDispatch, useTypedSelector } from '../store/reducers';

const requireAuth = (WrappedComponent) => {
  const InnerComponent = (props) => {
    const dispatch = useTypedDispatch();
    const { accessToken, accessTokenExpires } = useTypedSelector(
      (state) => state.admin,
    );

    useEffect(() => {
      let newExpires;
      if (!accessTokenExpires) {
        redirectToLogin();
      }
      if (typeof accessTokenExpires === 'string') {
        newExpires = new Date(accessTokenExpires);
      }
      if (newExpires < new Date()) {
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
};

export default requireAuth;
