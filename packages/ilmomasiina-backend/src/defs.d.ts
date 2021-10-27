import { Application } from '@feathersjs/feathers';
import { Sequelize } from 'sequelize';

import { IlmoServices } from './services';

export interface IlmoApplication extends Application<IlmoServices> {
  get(key: 'sequelize'): Sequelize;
  get(key: string): any;

  set(key: 'sequelize', value: Sequelize): this;
  set(key: 'authentication', value: {}): this;
}
