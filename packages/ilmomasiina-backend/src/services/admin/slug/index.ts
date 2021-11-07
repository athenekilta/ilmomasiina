import { hooks as authHooks } from '@feathersjs/authentication';
import { ServiceMethods } from '@feathersjs/feathers';

import { AdminSlugServiceTypes } from '@tietokilta/ilmomasiina-models/src/services/admin/slug';
import { IlmoApplication } from '../../../defs';
import checkSlugAvailability from './checkSlugAvailability';

export const adminSlugService: Partial<ServiceMethods<AdminSlugServiceTypes>> = {
  get(slug) {
    return checkSlugAvailability(String(slug));
  },
};

export default function setupAdminSlugService(this: IlmoApplication) {
  const app = this;

  app.use('/api/admin/slug', adminSlugService);

  app.service('/api/admin/slug').hooks({
    before: {
      all: [authHooks.authenticate('jwt')],
    },
  });
}
