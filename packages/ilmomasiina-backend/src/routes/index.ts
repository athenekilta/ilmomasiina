import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
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
import createSignup from './signup/createNewSignup';
import { deleteSignupAsAdmin, deleteSignupAsUser } from './signup/deleteSignup';
import getSignupForEdit from './signup/getSignupForEdit';
import updateSignup from './signup/updateSignup';
import { inviteUser } from './user/createUser';
import deleteUser from './user/deleteUser';
import listUsers from './user/listUsers';

const errorResponses = {
  '4XX': schema.errorResponseSchema,
  '5XX': schema.errorResponseSchema,
};

export default async function setupRoutes(fastifyInstance: FastifyInstance): Promise<void> {
  const fastify = fastifyInstance.withTypeProvider<TypeBoxTypeProvider>();

  // Setup admin routes (prefixed with '/admin')
  fastify.register(async (instance) => {
    const server = instance.withTypeProvider<TypeBoxTypeProvider>();

    /** Routes for categories */
    server.get<{/* Params: types.UserID */}>(
      '/categories',
      {
        schema: {
          response: {
            ...errorResponses,
            200: schema.adminListCategoriesResponse,
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
            200: schema.adminListCategoriesResponse,
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
            200: {},
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
            200: {},
          },
        },
      },
      deleteSignupAsAdmin,
    );

    /** Admin routes for event slugs */
    server.get<{ Params: schema.CheckSlugParams }>(
      '/slugs/:id',
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
            200: schema.auditLogQueryResponse,
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
            200: {},
          },
        },
      },
      deleteUser,
    );
  }, { prefix: '/admin' });

  // Setup routes requiring a signup edit token
  fastify.register(async (instance) => {
    const server = instance.withTypeProvider<TypeBoxTypeProvider>();

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
            409: Type.Union([schema.editConflictErrorSchema, schema.wouldMoveSignupsToQueue]),
            200: schema.updatedSignupSchema,
          },
        },
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
            200: {},
          },
        },
      },
      deleteSignupAsUser,
    );

    // TODO: Pass edit token in headers
  });

  // Setup public routes
  const server = fastify;

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
        params: schema.signupCreateSchema,
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
}
