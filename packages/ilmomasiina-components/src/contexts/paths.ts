import { createContext, useContext } from 'react';

import type { AdminEvent, Event, Signup } from '@tietokilta/ilmomasiina-models';

export type UserPaths = {
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

  eventsList: '/',
  eventDetails: (slug: Event.Slug) => `/events/${slug}`,
  editSignup: (id: Signup.Id, editToken: string) => `/signup/${id}/${editToken}`,
};

export const PathsContext = createContext<IlmoPaths>(defaultPaths);

export function usePaths(): IlmoPaths {
  return useContext(PathsContext);
}

export function useFullPaths(): FullPaths {
  const paths = usePaths();
  if (!paths.hasAdmin) {
    throw new Error('This app is not configured with admin paths.');
  }
  return paths;
}
