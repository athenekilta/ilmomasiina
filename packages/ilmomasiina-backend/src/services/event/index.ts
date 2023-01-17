import { ServiceMethods } from '@feathersjs/feathers';

import { EventsServiceTypes } from '@tietokilta/ilmomasiina-models/dist/services/events';
import { IlmoApplication } from '../../defs';
import getEventDetails from './getEventDetails';
import getEventsList from './getEventsList';

export const eventService: Partial<ServiceMethods<EventsServiceTypes>> = {
  find(params) {
    return getEventsList(params);
  },

  get(id) {
    return getEventDetails(String(id));
  },
};

export default function setupEventsService(this: IlmoApplication) {
  const app = this;

  app.use('/api/events', eventService);
}
