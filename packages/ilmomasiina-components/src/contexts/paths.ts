import { createContext, useContext } from 'react';

import {
  AdminEventPathParams,
  SignupEditToken,
  SignupPathParams,
  UserEventPathParams,
} from '@tietokilta/ilmomasiina-models/src/schema';

export type UserPaths = {
  eventsList: string;
  eventDetails: (slug: UserEventPathParams['slug']) => string;
  editSignup: (id: SignupPathParams['id'], editToken: SignupEditToken) => string;
};

export type AdminPaths = {
  adminLogin: string;
  adminEventsList: string;
  adminEditEvent: (id: AdminEventPathParams['id']) => string,
  adminUsersList: string;
  adminAuditLog: string;
};

export type PublicPaths = { hasAdmin: false } & UserPaths;
export type FullPaths = { hasAdmin: true } & UserPaths & AdminPaths;
export type IlmoPaths = PublicPaths | FullPaths;

export const defaultPaths: IlmoPaths = {
  hasAdmin: false,

  eventsList: '/',
  eventDetails: (slug: UserEventPathParams['slug']) => `/events/${slug}`,
  editSignup: (id: SignupPathParams['id'], editToken: SignupEditToken) => `/signup/${id}/${editToken}`,
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
