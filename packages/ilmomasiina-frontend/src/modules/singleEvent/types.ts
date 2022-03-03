import { Event } from '@tietokilta/ilmomasiina-models/src/services/events';

export interface SingleEventState {
  event: Event.Details | null;
  eventLoadError: boolean;
  creatingSignup: boolean;
}

export type { SingleEventActions } from './actions';
