/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { AdapterService } from '@feathersjs/adapter-commons';
import { MethodNotAllowed } from '@feathersjs/errors';
import { Id, Params } from '@feathersjs/feathers';

import { SignupsServiceResponses } from '@tietokilta/ilmomasiina-api/src/services/signups';
import { SignupCreateBody } from '@tietokilta/ilmomasiina-api/src/services/signups/create';
import { SignupUpdateBody } from '@tietokilta/ilmomasiina-api/src/services/signups/update';
import { IlmoApplication } from '../../defs';
import createNewSignup from './createNewSignup';
import deleteSignup from './deleteSignup';
import getSignupForEdit from './getSignupForEdit';
import updateSignup from './updateSignup';

export class SignupsService extends AdapterService<SignupsServiceResponses> {
  _find(): never {
    throw new MethodNotAllowed('Cannot GET /api/signups');
  }

  _get(id: Id, params?: Params) {
    return getSignupForEdit(String(id), params);
  }

  _create(data: SignupCreateBody) {
    return createNewSignup(data);
  }

  _update(): never {
    throw new MethodNotAllowed('Cannot PUT /api/signups/ID');
  }

  _patch(id: Id, data: SignupUpdateBody, params?: Params) {
    return updateSignup(String(id), data, params);
  }

  _remove(id: Id, params?: Params) {
    return deleteSignup(String(id), params);
  }
}

export default function setupSignupsService(this: IlmoApplication) {
  const app = this;

  app.use('/api/signups', new SignupsService({}));
}
