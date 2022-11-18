import { ServiceMethods } from '@feathersjs/feathers';

import { SignupServiceTypes } from '@tietokilta/ilmomasiina-models/dist/services/signups';
import { SignupCreateBody } from '@tietokilta/ilmomasiina-models/dist/services/signups/create';
import { SignupUpdateBody } from '@tietokilta/ilmomasiina-models/dist/services/signups/update';
import { IlmoApplication } from '../../defs';
import createNewSignup from './createNewSignup';
import deleteSignup from './deleteSignup';
import getSignupForEdit from './getSignupForEdit';
import updateSignup from './updateSignup';

export const signupService: Partial<ServiceMethods<SignupServiceTypes>> = {
  get(id, params) {
    return getSignupForEdit(String(id), params);
  },

  create(data: SignupCreateBody) {
    return createNewSignup(data);
  },

  patch(id, data: SignupUpdateBody, params) {
    return updateSignup(String(id), data, params);
  },

  remove(id, params) {
    return deleteSignup(String(id), params);
  },
};

export default function setupSignupService(this: IlmoApplication) {
  const app = this;

  app.use('/api/signups', signupService);
}
