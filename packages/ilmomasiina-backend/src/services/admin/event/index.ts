/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { AdapterService } from '@feathersjs/adapter-commons';
import { hooks as authHooks } from '@feathersjs/authentication';
import { MethodNotAllowed } from '@feathersjs/errors';
import { Id } from '@feathersjs/feathers';

import { AdminEventsServiceResponses } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { AdminEventCreateBody } from '@tietokilta/ilmomasiina-models/src/services/admin/events/create';
import { AdminEventUpdateBody } from '@tietokilta/ilmomasiina-models/src/services/admin/events/update';
import { IlmoApplication } from '../../../defs';
import { getEventDetailsForAdmin } from '../../event/getEventDetails';
import { getEventsListForAdmin } from '../../event/getEventsList';
import createEvent from './createEvent';
import deleteEvent from './deleteEvent';
import updateEvent from './updateEvent';

export class AdminEventsService extends AdapterService<AdminEventsServiceResponses> {
  _find() {
    return getEventsListForAdmin();
  }

  _get(id: Id) {
    return getEventDetailsForAdmin(String(id));
  }

  _create(data: AdminEventCreateBody) {
    return createEvent(data);
  }

  _update(): never {
    throw new MethodNotAllowed('Cannot PUT /api/admin/events/ID');
  }

  _patch(id: Id, data: Partial<AdminEventUpdateBody>) {
    return updateEvent(String(id), data);
  }

  _remove(id: Id) {
    return deleteEvent(String(id));
  }
}

export default function setupAdminEventsService(this: IlmoApplication) {
  const app = this;

  app.use('/api/admin/events', new AdminEventsService({}));

  app.service('/api/admin/events').hooks({
    before: {
      all: [authHooks.authenticate('jwt')],
    },
  });
}
