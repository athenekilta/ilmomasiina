import { AuthenticationService } from '@feathersjs/authentication';
import { Service, ServiceMethods } from '@feathersjs/feathers';

import { IlmoApplication } from '../defs';
import adminCategories, { adminCategoryService } from './admin/category';
import adminEvents, { adminEventService } from './admin/event';
import adminSignups, { adminSignupService } from './admin/signup';
import adminSlug, { adminSlugService } from './admin/slug';
import auditLog, { AuditLogService } from './auditlog';
import authentication from './authentication';
import event, { eventService } from './event';
import signup, { signupService } from './signup';
import user, { UsersService } from './user';

// Wraps ServiceMethods into feathers Service for hooks() etc.
type WrapService<S> = S extends Partial<ServiceMethods<infer T>> ? Service<T> : never;

export interface IlmoServices {
  '/api/admin/categories': WrapService<typeof adminCategoryService>;
  '/api/admin/events': WrapService<typeof adminEventService>;
  '/api/admin/signups': WrapService<typeof adminSignupService>;
  '/api/admin/slug': WrapService<typeof adminSlugService>;
  '/api/auditlog': AuditLogService;
  '/api/authentication': AuthenticationService;
  '/api/events': WrapService<typeof eventService>;
  '/api/signups': WrapService<typeof signupService>;
  '/api/users': UsersService;
}

export default function setupServices(this: IlmoApplication) {
  const app = this;

  app.configure(authentication);
  app.configure(adminCategories);
  app.configure(adminEvents);
  app.configure(adminSignups);
  app.configure(adminSlug);
  app.configure(auditLog);
  app.configure(event);
  app.configure(signup);
  app.configure(user);
}
