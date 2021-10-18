/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { AdapterService } from '@feathersjs/adapter-commons';
import { hooks as authHooks } from '@feathersjs/authentication';
import { MethodNotAllowed } from '@feathersjs/errors';
import { Id } from '@feathersjs/feathers';

import { AdminSlugServiceResponses } from '@tietokilta/ilmomasiina-api/src/services/admin/slug';
import { IlmoApplication } from '../../../defs';
import checkSlugAvailability from './checkSlugAvailability';

export class AdminSlugService extends AdapterService<AdminSlugServiceResponses> {
  _find(): never {
    throw new MethodNotAllowed('Cannot GET /api/admin/slug');
  }

  _get(slug: Id) {
    return checkSlugAvailability(String(slug));
  }

  _create(): never {
    throw new MethodNotAllowed('Cannot POST /api/admin/slug');
  }

  _update(): never {
    throw new MethodNotAllowed('Cannot PUT /api/admin/slug/ID');
  }

  _patch(): never {
    throw new MethodNotAllowed('Cannot PATCH /api/admin/slug/ID');
  }

  _remove(): never {
    throw new MethodNotAllowed('Cannot DELETE /api/admin/slug/ID');
  }
}

export default function setupAdminSlugService(this: IlmoApplication) {
  const app = this;

  app.use('/api/admin/slug', new AdminSlugService({}));

  app.service('/api/admin/slug').hooks({
    before: {
      all: [authHooks.authenticate('jwt')],
    },
  });
}
