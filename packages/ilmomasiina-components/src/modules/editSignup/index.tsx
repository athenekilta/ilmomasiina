import React, { PropsWithChildren } from 'react';

import type { SignupForEditResponse } from '@tietokilta/ilmomasiina-models';
import { EDIT_TOKEN_HEADER } from '@tietokilta/ilmomasiina-models';
import apiFetch from '../../api';
import { useAbortablePromise } from '../../utils/abortable';
import useShallowMemo from '../../utils/useShallowMemo';
import { Provider, State } from './state';

export interface EditSignupProps {
  id: string;
  editToken: string;
}

export { useStateContext as useEditSignupContext } from './state';
export { useDeleteSignup, useUpdateSignup } from './actions';

export function useEditSignupState({ id, editToken }: EditSignupProps) {
  const fetchSignup = useAbortablePromise(async (signal) => {
    const response = await apiFetch(`signups/${id}`, {
      signal,
      headers: {
        [EDIT_TOKEN_HEADER]: editToken,
      },
    }) as SignupForEditResponse;
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

  // TODO: use data from server about editing end time
  const registrationClosed = !fetchSignup.result?.event.registrationEndDate
    || new Date(fetchSignup.result?.event.registrationEndDate) < new Date();

  return useShallowMemo<State>({
    editToken,
    pending: fetchSignup.pending,
    error: fetchSignup.error,
    registrationClosed,
    ...fetchSignup.result,
  });
}

export function EditSignupProvider({ id, editToken, children }: PropsWithChildren<EditSignupProps>) {
  const state = useEditSignupState({ id, editToken });
  return (
    <Provider value={state}>
      {children}
    </Provider>
  );
}
