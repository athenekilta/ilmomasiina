/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { MethodNotAllowed } from '@feathersjs/errors';
import { Id, Params } from '@feathersjs/feathers';
import { Service as SequelizeService } from 'feathers-sequelize';
import { IlmoApplication } from '../../defs';
import { Signup } from '../../models/signup';
import createNewSignup, { SignupCreateBody, SignupCreateResponse } from './createNewSignup';
import deleteSignup from './deleteSignup';
import getSignupForEdit, { SignupGetResponse } from './getSignupForEdit';
import updateSignup, { SignupUpdateBody, SignupUpdateResponse } from './updateSignup';

export class SignupsService
  extends SequelizeService<SignupGetResponse | SignupCreateResponse | SignupUpdateResponse | Signup> {
  constructor() {
    super({ Model: Signup });
  }

  _find(): never {
    throw new MethodNotAllowed('Cannot GET /api/signups');
  }

  _get(id: Id, params?: Params) {
    return getSignupForEdit(id, params);
  }

  _create(data: SignupCreateBody) {
    return createNewSignup(data);
  }

  _update(): never {
    throw new MethodNotAllowed('Cannot PUT /api/signups/ID');
  }

  _patch(id: Id, data: SignupUpdateBody, params?: Params) {
    return updateSignup(id, data, params);
  }

  _remove(id: Id, params?: Params) {
    return deleteSignup(id, params);
  }
}

export default function (this: IlmoApplication) {
  const app = this;

  app.use('/api/signups', new SignupsService());
}
