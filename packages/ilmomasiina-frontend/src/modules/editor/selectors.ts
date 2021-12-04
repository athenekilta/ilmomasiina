import { createSelector } from 'reselect';

import { AppState } from '../../store/types';
import { defaultEvent, serverEventToEditor } from './actions';

// eslint-disable-next-line import/prefer-default-export
export const selectFormData = createSelector(
  (state: AppState) => state.editor.event,
  (event) => (!event ? defaultEvent() : serverEventToEditor(event)),
);
