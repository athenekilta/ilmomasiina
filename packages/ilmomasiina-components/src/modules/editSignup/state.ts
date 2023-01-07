import type { UserSignupForEditSchema } from '@tietokilta/ilmomasiina-models';
import { createStateContext } from '../../utils/stateContext';

export type State = Partial<UserSignupForEditSchema> & {
  pending: boolean;
  error: boolean;
  editToken: string;
  registrationClosed: boolean;
};

export const { Provider, useStateContext, createThunk } = createStateContext<State>();
