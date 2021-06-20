import { Service } from '@feathersjs/feathers';
import sequelizeService from 'feathers-sequelize';
import { IlmoApplication } from '../../defs';
import { User } from '../../models/user';
import hooks from './hooks';

export interface UserServiceItem extends User {
  passwordPlain?: string;
}

export type UsersService = Service<UserServiceItem>;

export default function (this: IlmoApplication) {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/users', sequelizeService({ Model: User }));

  // Get our initialize service to that we can bind hooks
  const userService = app.service('/api/users');

  userService.hooks(hooks);
}
