import type { Signup } from '@tietokilta/ilmomasiina-models';
import apiFetch from '../../api';
import { createThunk } from './state';

export const useUpdateSignup = createThunk(({ signup, editToken }) => async (answers: Signup.Update.Body) => {
  await apiFetch(`signups/${signup!.id}`, {
    method: 'PATCH',
    body: {
      ...answers,
      editToken,
    },
  });
});

export const useDeleteSignup = createThunk(({ signup, editToken }) => async () => {
  await apiFetch(`signups/${signup!.id}?editToken=${editToken}`, {
    method: 'DELETE',
  });
});
