import EventAttributes from '../../../models/event';

export interface AdminCheckSlugResponse {
  id: EventAttributes['id'] | null;
  title: string | null;
}
