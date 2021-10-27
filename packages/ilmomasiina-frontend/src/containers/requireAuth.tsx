import React, { ComponentType } from 'react';

import { toast } from 'react-toastify';

import { redirectToLogin } from '../modules/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../store/reducers';

export default function requireAuth<P>(WrappedComponent: ComponentType<P>) {
  const InnerComponent = (props: P) => {
    const dispatch = useTypedDispatch();
    const { accessToken, accessTokenExpires } = useTypedSelector(
      (state) => state.auth,
    );

    if (accessTokenExpires && new Date(accessTokenExpires) < new Date()) {
      toast.error('Sisäänkirjautumisesi on vanhentunut. Kirjaudu sisään uudelleen.', {
        autoClose: 10000,
      });
      dispatch(redirectToLogin());
      return null;
    }
    if (!accessToken) {
      dispatch(redirectToLogin());
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  return InnerComponent;
}
