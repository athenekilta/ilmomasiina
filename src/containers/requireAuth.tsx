import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { redirectToLogin } from '../modules/admin/actions';
import { AppState } from '../store/types';

interface Props {
  accessToken: string;
  accessTokenExpires: string | Date;
  redirectToLogin: () => void;
}

const requireAuth = WrappedComponent => {
  const Comp = (props: Props) => {
    const { accessToken, redirectToLogin } = props;

    useEffect(() => {
      let { accessTokenExpires } = props;

      if (!accessTokenExpires) {
        redirectToLogin();
      }
      if (typeof accessTokenExpires === 'string') {
        accessTokenExpires = new Date(accessTokenExpires);
      }
      if (accessTokenExpires < new Date()) {
        redirectToLogin();
      }
    }, []);

    if (!accessToken) {
      redirectToLogin();
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  const mapStateToProps = (state: AppState) => ({
    accessToken: state.admin.accessToken,
    accessTokenExpires: state.admin.accessTokenExpires
  });

  const mapDispatchToProps = {
    redirectToLogin: redirectToLogin
  };

  return connect(mapStateToProps, mapDispatchToProps)(Comp);
};

export default requireAuth;
