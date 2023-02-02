import React, { PropsWithChildren } from 'react';

import { FullPaths, PathsContext } from '@tietokilta/ilmomasiina-components';

export const urlPrefix = PATH_PREFIX;

const appPaths: FullPaths = {
  hasAdmin: true,

  eventsList: `${urlPrefix}/`,
  eventDetails: (slug) => `${urlPrefix}/events/${slug}`,
  editSignup: (id, editToken) => `${urlPrefix}/signup/${id}/${editToken}`,

  adminLogin: `${urlPrefix}/login`,
  adminEventsList: `${urlPrefix}/admin`,
  adminEditEvent: (id) => `${urlPrefix}/admin/edit/${id}`,
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
