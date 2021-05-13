/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { AdapterService } from '@feathersjs/adapter-commons';
import { MethodNotAllowed } from '@feathersjs/errors';
import authentication from '@feathersjs/authentication';
import { Id } from '@feathersjs/feathers';
import { IlmoApplication } from '../../../defs';
import deleteSignup from '../../signup/deleteSignup';

type AdminSignupsServiceResponses = never;

export class AdminSignupsService extends AdapterService<AdminSignupsServiceResponses> {
  _find(): never {
    throw new MethodNotAllowed('Cannot GET /api/admin/signups');
  }

  _get(): never {
    throw new MethodNotAllowed('Cannot GET /api/admin/signups/ID');
  }

  _create(): never {
    throw new MethodNotAllowed('Cannot POST /api/admin/signups');
  }

  _update(): never {
    throw new MethodNotAllowed('Cannot PUT /api/admin/signups/ID');
  }

  _patch(): never {
    throw new MethodNotAllowed('Cannot PATCH /api/admin/signups/ID');
  }

  async _remove(id: Id) {
    // Invoke regular signup deletion with admin override
    return deleteSignup(id, { adminAuthenticated: true });
  }
}

export default function (this: IlmoApplication) {
  const app = this;

  app.use('/api/admin/signups', new AdminSignupsService({}));

  app.service('/api/admin/signups').before({
    all: [authentication.hooks.authenticate('jwt')],
  });
}
