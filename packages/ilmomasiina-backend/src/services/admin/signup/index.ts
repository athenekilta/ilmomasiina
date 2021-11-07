import { hooks as authHooks } from '@feathersjs/authentication';
import { ServiceMethods } from '@feathersjs/feathers';

import { IlmoApplication } from '../../../defs';
import deleteSignup from '../../signup/deleteSignup';

type AdminSignupsServiceTypes = null;

export const adminSignupService: Partial<ServiceMethods<AdminSignupsServiceTypes>> = {
  async remove(id) {
    // Invoke regular signup deletion with admin override
    return deleteSignup(String(id), { adminAuthenticated: true });
  },
};

export default function setupAdminSignupsService(this: IlmoApplication) {
  const app = this;

  app.use('/api/admin/signups', adminSignupService as Partial<ServiceMethods<any>>);

  app.service('/api/admin/signups').hooks({
    before: {
      all: [authHooks.authenticate('jwt')],
    },
  });
}
