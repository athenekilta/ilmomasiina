import type { SignupUpdateSchema } from '@tietokilta/ilmomasiina-models';
import { EDIT_TOKEN_HEADER_NAME } from '@tietokilta/ilmomasiina-models';
import apiFetch from '../../api';
import { createThunk } from './state';

export const useUpdateSignup = createThunk(({ signup, editToken }) => async (answers: SignupUpdateSchema) => {
  await apiFetch(`signups/${signup!.id}`, {
    method: 'PATCH',
    body: answers,
    headers: {
      [EDIT_TOKEN_HEADER_NAME]: editToken,
    },
  });
});

export const useDeleteSignup = createThunk(({ signup, editToken }) => async () => {
  await apiFetch(`signups/${signup!.id}`, {
    method: 'DELETE',
    headers: {
      [EDIT_TOKEN_HEADER_NAME]: editToken,
    },
  });
});
