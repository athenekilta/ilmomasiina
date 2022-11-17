import React, { PropsWithChildren } from 'react';

import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import apiFetch from '../../api';
import { useAbortablePromise } from '../../utils/abortable';
import useShallowMemo from '../../utils/useShallowMemo';
import { ExternalState, Provider } from './reducer';

export interface EditSignupProps {
  id: string;
  editToken: string;
}

export { useStateAndDispatch } from './reducer';

export function useEditSignupState({ id, editToken }: EditSignupProps) {
  const fetchSignup = useAbortablePromise(async (signal) => {
    const response = await apiFetch(`signups/${id}?editToken=${editToken}`, { signal }) as Signup.Details;
    return {
      ...response,
      signup: {
        ...response.signup,
        firstName: response.signup.firstName || '',
        lastName: response.signup.lastName || '',
        email: response.signup.email || '',
      },
    };
  }, [id, editToken]);

  return useShallowMemo<ExternalState>({
    editToken,
    pending: fetchSignup.pending,
    error: fetchSignup.error,
    ...fetchSignup.result,
  });
}

export function EditSignupProvider({ id, editToken, children }: PropsWithChildren<EditSignupProps>) {
  const state = useEditSignupState({ id, editToken });
  return (
    <Provider state={state}>
      {children}
    </Provider>
  );
}
