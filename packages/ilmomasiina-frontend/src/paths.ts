import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { Event } from '@tietokilta/ilmomasiina-models/src/services/events';
import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';

export const urlPrefix = PREFIX_URL;

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

const defaultPaths: IlmoPaths = {
  hasAdmin: true,
  api: API_URL || `${urlPrefix}/api`,

  eventsList: `${urlPrefix}/`,
  eventDetails: (slug: Event.Slug) => `${urlPrefix}/events/${slug}`,
  editSignup: (id: Signup.Id, editToken: string) => `${urlPrefix}/signup/${id}/${editToken}`,

  adminLogin: `${urlPrefix}/login`,
  adminEventsList: `${urlPrefix}/admin`,
  adminEditEvent: (id: AdminEvent.Id) => `${urlPrefix}/admin/edit/${id}`,
  adminUsersList: `${urlPrefix}/admin/users`,
  adminAuditLog: `${urlPrefix}/admin/auditlog`,
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

export function setPaths(newPaths: IlmoPaths) {
  configuredPaths = newPaths;
}
