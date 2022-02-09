import { Application } from '@feathersjs/feathers';

import { IlmoServices } from './services';

export type IlmoApplication = Application<IlmoServices>;
