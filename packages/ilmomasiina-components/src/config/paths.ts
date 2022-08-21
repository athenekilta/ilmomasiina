import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { Event } from '@tietokilta/ilmomasiina-models/src/services/events';
import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';

export type UserPaths = {
  api: string;

  eventsList: string;
  eventDetails: (slug: Event.Slug) => string;
  editSignup: (id: Signup.Id, editToken: string) => string;
};

export type AdminPaths = {
  adminLogin: string;
  adminEventsList: string;
  adminEditEvent: (id: AdminEvent.Id) => string,
  adminUsersList: string;
  adminAuditLog: string;
};

export type PublicPaths = { hasAdmin: false } & UserPaths;
export type FullPaths = { hasAdmin: true } & UserPaths & AdminPaths;
export type IlmoPaths = PublicPaths | FullPaths;

export const defaultPaths: IlmoPaths = {
  hasAdmin: false,
  api: '/api',

  eventsList: '/',
  eventDetails: (slug: Event.Slug) => `/events/${slug}`,
  editSignup: (id: Signup.Id, editToken: string) => `/signup/${id}/${editToken}`,
};

let configuredPaths: IlmoPaths = defaultPaths;

export function paths(): IlmoPaths {
  return configuredPaths;
}

export function fullPaths(): FullPaths {
  if (!configuredPaths.hasAdmin) {
    throw new Error('This app is not configured with admin paths.');
  }
  return configuredPaths;
}

export function configurePaths(newPaths: IlmoPaths) {
  configuredPaths = newPaths;
}
