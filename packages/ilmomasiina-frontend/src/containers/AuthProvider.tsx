import React, { PropsWithChildren } from 'react';

import AuthContext from '@tietokilta/ilmomasiina-components/src/contexts/auth';
import { useTypedSelector } from '../store/reducers';

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const auth = useTypedSelector((state) => state.auth);
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
