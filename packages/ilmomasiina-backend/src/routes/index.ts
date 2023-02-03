import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models';
import { userChangePasswordSchema } from '@tietokilta/ilmomasiina-models';
import { addLogEventHook } from '../auditlog';
import AdminAuthSession from '../authentication/adminAuthSession';
import config from '../config';
import getAuditLogItems from './admin/auditlog/getAuditLogs';
import getCategoriesList from './admin/categories/getCategoriesList';
import createEvent from './admin/events/createEvent';
import deleteEvent from './admin/events/deleteEvent';
import updateEvent from './admin/events/updateEvent';
import checkSlugAvailability from './admin/slugs/checkSlugAvailability';
import changePassword from './admin/users/changePassword';
import { createUser, inviteUser } from './admin/users/createUser';
import deleteUser from './admin/users/deleteUser';
import listUsers from './admin/users/listUsers';
import resetPassword from './admin/users/resetPassword';
import { adminLogin, requireAdmin } from './authentication/adminLogin';
import {
  getEventDetailsForAdmin,
  getEventDetailsForUser,
} from './events/getEventDetails';
import { getEventsListForAdmin, getEventsListForUser } from './events/getEventsList';
import { sendICalFeed } from './ical';
import createSignup from './signups/createNewSignup';
import { deleteSignupAsAdmin, deleteSignupAsUser } from './signups/deleteSignup';
import { requireValidEditToken } from './signups/editTokens';
import getSignupForEdit from './signups/getSignupForEdit';
import updateSignup from './signups/updateSignup';

const errorResponses = {
  '4XX': schema.errorResponse,
  '5XX': schema.errorResponse,
};

export interface RouteOptions {
  adminSession: AdminAuthSession
}

/** Setup admin routes (prefixed with '/admin') */
async function setupAdminRoutes(
  fastifyInstance: FastifyInstance,
  opts: RouteOptions,
) {
  // Add session validation hook:
  // All the following routes require a valid session. The route functions are called only if the session is valid.
  // For invalid sessions, the hook automatically responds with a proper error response.
  requireAdmin(opts.adminSession, fastifyInstance);

  const server = fastifyInstance.withTypeProvider<TypeBoxTypeProvider>();

  /** Routes for categories */
  server.get<{/* Params: types.UserID */ }>(
    '/categories',
    {
      schema: {
        response: {
          ...errorResponses,
          200: schema.categoriesResponse,
        },
      },
    },
    getCategoriesList,
  );

  /** Admin routes for events */
  server.post<{ Body: schema.EventCreateBody }>(
    '/events',
    {
      schema: {
        body: schema.eventCreateBody,
        response: {
          ...errorResponses,
          201: schema.adminEventResponse,
        },
      },
    },
    createEvent,
  );

  server.get(
    '/events',
    {
      schema: {
        querystring: schema.eventListQuery,
        response: {
          ...errorResponses,
          200: schema.adminEventListResponse,
        },
      },
    },
    getEventsListForAdmin,
  );

  server.get<{ Params: schema.AdminEventPathParams }>(
    '/events/:id',
    {
      schema: {
        params: schema.adminEventPathParams,
        response: {
          ...errorResponses,
          200: schema.adminEventResponse,
        },
      },
    },
    getEventDetailsForAdmin,
  );

  server.patch<{ Params: schema.AdminEventPathParams, Body: schema.EventUpdateBody }>(
    '/events/:id',
    {
      schema: {
        params: schema.adminEventPathParams,
        body: schema.eventUpdateBody,
        response: {
          ...errorResponses,
          200: schema.adminEventResponse,
          409: Type.Union([schema.editConflictError, schema.wouldMoveSignupsToQueueError]),
        },
      },
    },
    updateEvent,
  );

  server.delete<{ Params: schema.AdminEventPathParams }>(
    '/events/:id',
    {
      schema: {
        params: schema.adminEventPathParams,
        response: {
          ...errorResponses,
          204: {},
        },
      },
    },
    deleteEvent,
  );

  /** Admin routes for signups */
  server.delete<{ Params: schema.SignupPathParams }>(
    '/signups/:id',
    {
      schema: {
        params: schema.signupPathParams,
        response: {
          ...errorResponses,
          204: {},
        },
      },
    },
    deleteSignupAsAdmin,
  );

  /** Admin routes for event slugs */
  server.get<{ Params: schema.CheckSlugParams }>(
    '/slugs/:slug',
    {
      schema: {
        params: schema.checkSlugParams,
        response: {
          ...errorResponses,
          200: schema.checkSlugResponse,
        },
      },
    },
    checkSlugAvailability,
  );

  /** Admin routes for audit logs */
  server.get<{ Querystring: schema.AuditLoqQuery }>(
    '/auditlog',
    {
      schema: {
        querystring: schema.auditLoqQuery,
        response: {
          ...errorResponses,
          200: schema.auditLogResponse,
        },
      },
    },
    getAuditLogItems,
  );

  /** Admin routes for user management */
  server.get(
    '/users',
    {
      schema: {
        response: {
          ...errorResponses,
          200: schema.userListResponse,
        },
      },
    },
    listUsers,
  );

  server.post<{ Body: schema.UserInviteSchema }>(
    '/users',
    {
      schema: {
        body: schema.userInviteSchema,
        response: {
          ...errorResponses,
          201: schema.userSchema,
        },
      },
    },
    inviteUser,
  );

  server.delete<{ Params: schema.UserPathParams }>(
    '/users/:id',
    {
      schema: {
        params: schema.userPathParams,
        response: {
          ...errorResponses,
          204: {},
        },
      },
    },
    deleteUser,
  );

  server.post(
    '/users/:id/resetpassword',
    {
      schema: {
        params: schema.userPathParams,
        response: {
          ...errorResponses,
          204: {},
        },
      },
    },
    resetPassword,
  );
  server.post(
    '/users/self/changepassword',
    {
      schema: {
        body: userChangePasswordSchema,
        response: {
          ...errorResponses,
          204: {},
        },
      },
    },
    changePassword,
  );
}

async function setupPublicRoutes(
  fastifyInstance: FastifyInstance,
  opts: RouteOptions,
) {
  const server = fastifyInstance.withTypeProvider<TypeBoxTypeProvider>();

  // Routes that require a signup edit token

  server.get<{ Params: schema.SignupPathParams }>(
    '/signups/:id',
    {
      schema: {
        params: schema.signupPathParams,
        response: {
          ...errorResponses,
          200: schema.signupForEditResponse,
        },
      },
      // Require valid edit token:
      preHandler: requireValidEditToken,
    },
    getSignupForEdit,
  );

  server.patch<{ Params: schema.SignupPathParams, Body: schema.SignupUpdateBody }>(
    '/signups/:id',
    {
      schema: {
        params: schema.signupPathParams,
        body: schema.signupUpdateBody,
        response: {
          ...errorResponses,
          200: schema.signupUpdateResponse,
        },
      },
      // Require valid edit token:
      preHandler: requireValidEditToken,
    },
    updateSignup,
  );

  server.delete<{ Params: schema.SignupPathParams }>(
    '/signups/:id',
    {
      schema: {
        params: schema.signupPathParams,
        response: {
          ...errorResponses,
          204: {},
        },
      },
      // Require valid edit token:
      preHandler: requireValidEditToken,
    },
    deleteSignupAsUser,
  );

  // Admin session management routes

  server.post<{ Body: schema.AdminLoginBody }>(
    '/authentication',
    {
      schema: {
        body: schema.adminLoginBody,
        response: {
          ...errorResponses,
          201: schema.adminLoginResponse,
        },
      },
    },
    adminLogin(opts.adminSession),
  );

  // TODO: Add an API endpoint for session token renewal as variant of adminLoginSchema

  // Public routes for events

  server.get<{ Querystring: schema.EventListQuery }>(
    '/events',
    {
      schema: {
        querystring: schema.eventListQuery,
        response: {
          ...errorResponses,
          200: schema.userEventListResponse,
        },
      },
    },
    getEventsListForUser,
  );

  server.get<{ Params: schema.UserEventPathParams }>(
    '/events/:slug',
    {
      schema: {
        params: schema.userEventPathParams,
        response: {
          ...errorResponses,
          200: schema.userEventResponse,
        },
      },
    },
    getEventDetailsForUser,
  );

  // Public route for signup creation
  server.post<{ Body: schema.SignupCreateBody }>(
    '/signups',
    {
      schema: {
        body: schema.signupCreateBody,
        response: {
          ...errorResponses,
          201: schema.signupCreateResponse,
        },
      },
    },
    createSignup,
  );

  // Public route for iCal feed
  server.get(
    '/ical',
    {},
    sendICalFeed,
  );

  if (config.adminRegistrationAllowed) {
    // Public route for initial admin user creation
    server.post<{ Body: schema.UserCreateSchema }>(
      '/users',
      {
        schema: {
          body: schema.userCreateSchema,
          response: {
            ...errorResponses,
            201: schema.userSchema,
          },
        },
      },
      createUser,
    );
  }
}

export default async function setupRoutes(
  instance: FastifyInstance,
  opts: RouteOptions,
): Promise<void> {
  addLogEventHook(instance);

  await instance.register(setupAdminRoutes, { ...opts, prefix: '/admin' });
  await instance.register(setupPublicRoutes, { ...opts, prefix: undefined });
}
