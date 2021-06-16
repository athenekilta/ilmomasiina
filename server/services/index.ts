import { Service } from '@feathersjs/feathers';
import { AuthenticationService } from '@feathersjs/authentication';
import { AdapterService } from '@feathersjs/adapter-commons';
import adminevents, { AdminEventsService } from './admin/event';
import adminsignups, { AdminSignupsService } from './admin/signup';
import event, { EventsService } from './event';
import signup, { SignupsService } from './signup';
import user, { UsersService } from './user';
import authentication from './authentication';
import { IlmoApplication } from '../defs';

// Wraps AdapterService into feathers Service for hooks() etc.
type WrapAdapter<S> = S extends AdapterService<infer T> ? S & Service<T> : never;

export interface IlmoServices {
  '/api/admin/events': WrapAdapter<AdminEventsService>;
  '/api/admin/signups': WrapAdapter<AdminSignupsService>;
  '/api/authentication': AuthenticationService;
  '/api/events': WrapAdapter<EventsService>;
  '/api/signups': WrapAdapter<SignupsService>;
  '/api/users': UsersService;
}

export default function (this: IlmoApplication) {
  const app = this;

  app.configure(authentication);
  app.configure(adminevents);
  app.configure(adminsignups);
  app.configure(event);
  app.configure(signup);
  app.configure(user);
}
