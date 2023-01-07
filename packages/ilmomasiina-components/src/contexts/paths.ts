import { createContext, useContext } from 'react';

import type {
  EventID, EventSlug, SignupEditToken, SignupID,
} from '@tietokilta/ilmomasiina-models';

export type UserPaths = {
  eventsList: string;
  eventDetails: (slug: EventSlug) => string;
  editSignup: (id: SignupID, editToken: SignupEditToken) => string;
};

export type AdminPaths = {
  adminLogin: string;
  adminEventsList: string;
  adminEditEvent: (id: EventID) => string,
  adminUsersList: string;
  adminAuditLog: string;
};

export type PublicPaths = { hasAdmin: false } & UserPaths;
export type FullPaths = { hasAdmin: true } & UserPaths & AdminPaths;
export type IlmoPaths = PublicPaths | FullPaths;

export const defaultPaths: IlmoPaths = {
  hasAdmin: false,

  eventsList: '/',
  eventDetails: (slug) => `/events/${slug}`,
  editSignup: (id, editToken) => `/signup/${id}/${editToken}`,
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
