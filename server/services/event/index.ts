/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { AdapterService } from '@feathersjs/adapter-commons';
import { MethodNotAllowed } from '@feathersjs/errors';
import { Id } from '@feathersjs/feathers';

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
    return getEventDetails(String(id));
  }

  _create(): never {
    throw new MethodNotAllowed('Cannot POST /api/events');
  }

  _update(): never {
    throw new MethodNotAllowed('Cannot PUT /api/events/ID');
  }

  _patch(): never {
    throw new MethodNotAllowed('Cannot PATCH /api/events/ID');
  }

  _remove(): never {
    throw new MethodNotAllowed('Cannot DELETE /api/events/ID');
  }
}

export default function setupEventsService(this: IlmoApplication) {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/events', new EventsService({}));
}
