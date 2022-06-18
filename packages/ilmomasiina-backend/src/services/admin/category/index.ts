import { hooks as authHooks } from '@feathersjs/authentication';
import { ServiceMethods } from '@feathersjs/feathers';

import { AdminCategoriesServiceTypes } from '@tietokilta/ilmomasiina-models/src/services/admin/categories';
import { IlmoApplication } from '../../../defs';
import getCategoriesList from './getCategoriesList';

export const adminCategoryService: Partial<ServiceMethods<AdminCategoriesServiceTypes>> = {
  find() {
    return getCategoriesList();
  },
};

export default function setupAdminSlugService(this: IlmoApplication) {
  const app = this;

  app.use('/api/admin/categories', adminCategoryService);

  app.service('/api/admin/categories').hooks({
    before: {
      all: [authHooks.authenticate('jwt')],
    },
  });
}
