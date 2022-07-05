import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import { createReducerContext } from '../../../utils/stateContext';

type ReducerState = {
  deleted: boolean;
};

export type Actions =
  | { type: 'DELETED' };

const initialState: ReducerState = {
  deleted: false,
};

export type ExternalState = Partial<Signup.Details> & {
  pending: boolean;
  error: boolean;
  editToken: string;
};

function reducer(state: ReducerState, action: Actions): ReducerState {
  switch (action.type) {
    case 'DELETED':
      return {
        ...state,
        deleted: true,
      };
    default:
      return state;
  }
}

export const {
  Provider, useStateAndDispatch, createThunk,
} = createReducerContext<ReducerState, Actions, ExternalState>(reducer, initialState);
