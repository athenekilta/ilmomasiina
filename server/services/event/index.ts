/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { AdapterService } from '@feathersjs/adapter-commons';
import { Id } from '@feathersjs/feathers';
import { disallow } from 'feathers-hooks-common';
import { IlmoApplication } from '../../defs';
import getEventDetails, { EventGetResponse } from './getEventDetails';
import getEventsList, { EventListResponse } from './getEventsList';

type EventsServiceResponses = EventListResponse | EventGetResponse;

// Service implementation.
export class EventsService extends AdapterService<EventsServiceResponses> {
  _find() {
    return getEventsList();
  }

  _get(id: Id) {
    return getEventDetails(id);
  }
}

export default function (this: IlmoApplication) {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/events', new EventsService({}));

  app.service('/api/events').before({
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  });
}
