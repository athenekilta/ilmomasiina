import sequelizeService from 'feathers-sequelize';
import { IlmoApplication } from '../../defs';
import { Signup } from '../../models/signup';
import hooks from './hooks';

export default function (this: IlmoApplication) {
  const app = this;

  const options = {
    Model: Signup,
  };

  // Initialize our service with any options it requires
  app.use('/api/signups', sequelizeService(options));

  // Get our initialize service to that we can bind hooks
  const signupService = app.service('/api/signups');

  signupService.hooks(hooks);
}
