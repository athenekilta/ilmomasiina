import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { adminSessionSchema } from '@tietokilta/ilmomasiina-models/src/schema';
import { addLogEventHook } from '../auditlog';
import AdminAuthSession from '../authentication/adminAuthSession';
import config from '../config';
import getCategoriesList from './admin/categories/categories';
import createEvent from './admin/event/createEvent';
import deleteEvent from './admin/event/deleteEvent';
import updateEvent from './admin/event/updateEvent';
import checkSlugAvailability from './admin/slug/checkSlugAvailability';
import getAuditLogItems from './auditlog/getAuditLogs';
import {
  getEventDetailsForAdmin,
  getEventDetailsForUser,
} from './event/getEventDetails';
import getEventsListForUser, { getEventsListForAdmin } from './event/getEventsList';
import { sendICalFeed } from './ical';
import { addSessionValidationHook, adminLogin } from './login/adminLogin';
import createSignup from './signup/createNewSignup';
import { deleteSignupAsAdmin, deleteSignupAsUser } from './signup/deleteSignup';
import { requireValidEditToken } from './signup/editTokens';
import getSignupForEdit from './signup/getSignupForEdit';
import updateSignup from './signup/updateSignup';
import createUser, { inviteUser } from './user/createUser';
import deleteUser from './user/deleteUser';
import listUsers from './user/listUsers';

const errorResponses = {
  '4XX': schema.errorResponseSchema,
  '5XX': schema.errorResponseSchema,
};

export interface RouteOptions {
  adminSession: AdminAuthSession
}

export default async function setupRoutes(
  fastifyInstance: FastifyInstance,
  opts: RouteOptions,
): Promise<void> {
  addLogEventHook(fastifyInstance);

  const fastify = fastifyInstance.withTypeProvider<TypeBoxTypeProvider>();

  // Setup admin routes (prefixed with '/admin')
  fastify.register(async (instance) => {
    // Add session validation hook:
    // All the following routes require a valid session. The route functions are called only if the session is valid.
    // For invalid sessions, the hook automatically responds with a proper error response.
    addSessionValidationHook(opts.adminSession, instance);

    const server = instance.withTypeProvider<TypeBoxTypeProvider>();

    /** Routes for categories */
    server.get<{/* Params: types.UserID */}>(
      '/categories',
      {
        schema: {
          response: {
            ...errorResponses,
            200: schema.listCategoriesResponse,
          },
        },
      },
      getCategoriesList,
    );

    /** Admin routes for events */
    server.post<{ Body: schema.EventCreateSchema }>(
      '/events',
      {
        schema: {
          body: schema.eventCreateSchema,
          response: {
            ...errorResponses,
            201: schema.adminEventSchema,
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
            200: schema.adminEventListSchema,
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
            200: schema.adminEventSchema,
          },
        },
      },
      getEventDetailsForAdmin,
    );

    server.patch<{ Params: schema.AdminEventPathParams, Body: schema.EventEditSchema }>(
      '/events/:id',
      {
        schema: {
          params: schema.adminEventPathParams,
          body: schema.eventEditSchema,
          response: {
            ...errorResponses,
            200: schema.adminEventSchema,
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
            200: schema.userListSchema,
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
  }, { prefix: '/admin' });

  // Setup public routes
  const server = fastify;

  /** Routes for signup that require a signup edit token */
  server.get<{ Params: schema.SignupPathParams }>(
    '/signups/:id',
    {
      schema: {
        params: schema.signupPathParams,
        response: {
          ...errorResponses,
          200: schema.userSignupForEditSchema,
        },
      },
      // Require valid edit token:
      preHandler: requireValidEditToken,
    },
    getSignupForEdit,
  );

  server.patch<{ Params: schema.SignupPathParams, Body: schema.SignupUpdateSchema }>(
    '/signups/:id',
    {
      schema: {
        params: schema.signupPathParams,
        body: schema.signupUpdateSchema,
        response: {
          ...errorResponses,
          409: Type.Union([schema.editConflictError, schema.wouldMoveSignupsToQueueError]),
          200: schema.updatedSignupSchema,
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

  /** Admin session management routes */
  server.post<{ Body: schema.AdminLoginSchema }>(
    '/authentication',
    {
      schema: {
        body: schema.adminLoginSchema,
        response: {
          ...errorResponses,
          201: adminSessionSchema,
        },
      },
    },
    adminLogin(opts.adminSession),
  );

  // TODO: Add an API endpoint for session token renewal
  // server.patch(
  //   '/authentication',
  //   {
  //     schema: {
  //       response: {
  //         ...errorResponses,
  //         200: adminSessionSchema,
  //       },
  //     },
  //   },
  //   renewAdminToken(opts.adminSession),
  // );

  /** Public routes for events */
  server.get<{ Querystring: schema.EventListQuery }>(
    '/events',
    {
      schema: {
        querystring: schema.eventListQuery,
        response: {
          ...errorResponses,
          200: schema.userEventListSchema,
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
          200: schema.userEventSchema,
        },
      },
    },
    getEventDetailsForUser,
  );

  /** Public route for signup creation */
  server.post<{ Body: schema.SignupCreateSchema }>(
    '/signups',
    {
      schema: {
        body: schema.signupCreateSchema,
        response: {
          ...errorResponses,
          201: schema.createdSignupSchema,
        },
      },
    },
    createSignup,
  );

  /** Public route for iCal feed */
  server.get(
    '/ical',
    {},
    sendICalFeed,
  );

  if (config.adminRegistrationAllowed) {
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
