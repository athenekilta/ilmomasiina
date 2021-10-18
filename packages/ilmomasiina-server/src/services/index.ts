import { AdapterService } from '@feathersjs/adapter-commons';
import { AuthenticationService } from '@feathersjs/authentication';
import { Service } from '@feathersjs/feathers';

import { IlmoApplication } from '../defs';
import adminEvents, { AdminEventsService } from './admin/event';
import adminSignups, { AdminSignupsService } from './admin/signup';
import adminSlug, { AdminSlugService } from './admin/slug';
import authentication from './authentication';
import event, { EventsService } from './event';
import signup, { SignupsService } from './signup';
import user, { UsersService } from './user';

// Wraps AdapterService into feathers Service for hooks() etc.
type WrapAdapter<S> = S extends AdapterService<infer T> ? S & Service<T> : never;

export interface IlmoServices {
  '/api/admin/events': WrapAdapter<AdminEventsService>;
  '/api/admin/signups': WrapAdapter<AdminSignupsService>;
  '/api/admin/slug': WrapAdapter<AdminSlugService>;
  '/api/authentication': AuthenticationService;
  '/api/events': WrapAdapter<EventsService>;
  '/api/signups': WrapAdapter<SignupsService>;
  '/api/users': UsersService;
}

export default function setupServices(this: IlmoApplication) {
  const app = this;

  app.configure(authentication);
  app.configure(adminEvents);
  app.configure(adminSignups);
  app.configure(adminSlug);
  app.configure(event);
  app.configure(signup);
  app.configure(user);
}
