import React, { PropsWithChildren } from 'react';

import { FullPaths, PathsContext } from '@tietokilta/ilmomasiina-components';
import {
  AdminEventPathParams,
  SignupEditToken,
  SignupPathParams,
  UserEventPathParams,
} from '@tietokilta/ilmomasiina-models/src/schema';

export const urlPrefix = PATH_PREFIX;

const appPaths: FullPaths = {
  hasAdmin: true,

  eventsList: `${urlPrefix}/`,
  eventDetails: (slug: UserEventPathParams['slug']) => `${urlPrefix}/events/${slug}`,
  editSignup: (id: SignupPathParams['id'], editToken: SignupEditToken) => `${urlPrefix}/signup/${id}/${editToken}`,

  adminLogin: `${urlPrefix}/login`,
  adminEventsList: `${urlPrefix}/admin`,
  adminEditEvent: (id: AdminEventPathParams['id']) => `${urlPrefix}/admin/edit/${id}`,
  adminUsersList: `${urlPrefix}/admin/users`,
  adminAuditLog: `${urlPrefix}/admin/auditlog`,
};

export default appPaths;

export const apiUrl = `${urlPrefix}/api`;

export const PathsProvider = ({ children }: PropsWithChildren<{}>) => (
  <PathsContext.Provider value={appPaths}>
    {children}
  </PathsContext.Provider>
);
