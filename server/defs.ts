import { HookContext, Application } from '@feathersjs/feathers';
import { Sequelize } from 'sequelize/types';
import { IlmoServices } from './services';

export interface IlmoApplication extends Application<IlmoServices> {
  // TODO: remove 'models' when everything is TS

  get(key: 'sequelize'): Sequelize;
  get(key: string): any;

  set(key: 'sequelize', value: Sequelize): this;
  set(key: 'authentication', value: {}): this;
}

export interface IlmoHookContext<T> extends HookContext<T> {
  readonly app: IlmoApplication;
}
