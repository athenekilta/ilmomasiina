import React, { PropsWithChildren } from 'react';

import { FullPaths, PathsContext } from '@tietokilta/ilmomasiina-components';
import { AdminEvent, Event, Signup } from '@tietokilta/ilmomasiina-models';

export const urlPrefix = PATH_PREFIX;

const appPaths: FullPaths = {
  hasAdmin: true,

  eventsList: `${urlPrefix}/`,
  eventDetails: (slug: Event.Slug) => `${urlPrefix}/events/${slug}`,
  editSignup: (id: Signup.Id, editToken: string) => `${urlPrefix}/signup/${id}/${editToken}`,

  adminLogin: `${urlPrefix}/login`,
  adminEventsList: `${urlPrefix}/admin`,
  adminEditEvent: (id: AdminEvent.Id) => `${urlPrefix}/admin/edit/${id}`,
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
