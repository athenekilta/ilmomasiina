import { ServiceMethods } from '@feathersjs/feathers';

import { EventsServiceTypes } from '@tietokilta/ilmomasiina-models/src/services/events';
import { IlmoApplication } from '../../defs';
import getEventDetails from './getEventDetails';
import getEventsList from './getEventsList';

export const eventService: Partial<ServiceMethods<EventsServiceTypes>> = {
  find() {
    return getEventsList();
  },

  get(id) {
    return getEventDetails(String(id));
  },
};

export default function setupEventsService(this: IlmoApplication) {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/events', eventService);
}
