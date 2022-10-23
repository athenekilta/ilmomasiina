import React, { ComponentType, useEffect } from 'react';

import { toast } from 'react-toastify';

import { redirectToLogin } from '../modules/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../store/reducers';

export default function requireAuth<P>(WrappedComponent: ComponentType<P>) {
  return (props: P) => {
    const dispatch = useTypedDispatch();

    const { accessToken, accessTokenExpires } = useTypedSelector(
      (state) => state.auth,
    );

    const expired = accessTokenExpires && new Date(accessTokenExpires) < new Date();
    const needLogin = expired || !accessToken;

    useEffect(() => {
      if (expired) {
        toast.error('Sisäänkirjautumisesi on vanhentunut. Kirjaudu sisään uudelleen.', {
          autoClose: 10000,
        });
      }
      if (needLogin) {
        dispatch(redirectToLogin());
      }
    }, [needLogin, expired, dispatch]);

    return needLogin ? null : <WrappedComponent {...props} />;
  };
}
