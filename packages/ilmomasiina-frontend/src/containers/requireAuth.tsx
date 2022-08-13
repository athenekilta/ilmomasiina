import React, { ComponentType, useEffect } from 'react';

import { redirectToLogin } from '../modules/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../store/reducers';

export default function requireAuth<P>(WrappedComponent: ComponentType<P>) {
  return (props: P) => {
    const dispatch = useTypedDispatch();
    const { loggedIn } = useTypedSelector(
      (state) => state.auth,
    );

    const needLogin = !loggedIn;

    useEffect(() => {
      if (needLogin) {
        dispatch(redirectToLogin());
      }
    }, [needLogin, dispatch]);

    return needLogin ? null : <WrappedComponent {...props} />;
  };
}
