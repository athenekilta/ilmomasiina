import { Type } from '@sinclair/typebox';

export const eventSlug = Type.String({
  title: 'event slug',
  description: 'Used in event url',
});

export const eventID = Type.String({
  title: 'event ID',
});

export const eventIdentity = Type.Object({
  id: eventID,
});

export const userEventAttributesBasic = Type.Object({
  title: Type.String({
    title: 'Event title',
    description: 'title for the event',
  }),
  slug: eventSlug,
  date: Type.Union(
    [
      Type.String({
        title: 'start date',
        format: 'date-time',
      }),
      Type.Null({
        title: 'no start date',
      }),
    ],
    {
      title: 'event start date',
      description: 'Consider as a start date if endDate is defined',
    },
  ),
  endDate: Type.Union(
    [
      Type.String({
        title: 'end date',
        format: 'date-time',
      }),
      Type.Null({
        title: 'no end date',
      }),
    ],
    {
      title: 'event end date',
    },
  ),
  registrationStartDate: Type.Union(
    [
      Type.String({
        title: 'registration start date',
        format: 'date-time',
      }),
      Type.Null({
        title: 'no registration start date',
      }),
    ],
    {
      title: 'registration start date',
      description: 'time when the registration starts',
    },
  ),
  registrationEndDate: Type.Union(
    [
      Type.String({
        title: 'registration end date',
        format: 'date-time',
      }),
      Type.Null({
        title: 'no registration end date',
      }),
    ],
    {
      title: 'registration end date',
      description: 'time when the registration ends',
    },
  ),
  openQuotaSize: Type.Integer({
    title: 'size limit for open quota',
    description: '', // TODO: Describe briefly how open quota works
  }),
  category: Type.Optional(Type.String({
    title: 'event category',
    description: '', // TODO: Describe briefly how category works
  })),
});

export const userEventAttributesExtended = Type.Intersect(
  [
    userEventAttributesBasic,
    Type.Object({
      description: Type.Union(
        [
          Type.Null({
            title: 'no description',
          }),
          Type.String({
            title: 'description string',
          }),
        ],
        {
          title: 'event description',
          description: 'Description text to be shown in event page. Supports basic features of Markdown.',
        },
      ),
      price: Type.Union(
        [
          Type.String({
            title: 'price for the event',
          }),
          Type.Null({
            title: 'no price information',
          }),
        ],
        {
          description: 'Short pricing information for the event',
        },
      ),
      location: Type.Union(
        [
          Type.String({
            title: 'location',
          }),
          Type.Null({
            title: 'no location',
          }),
        ],
        {
          title: 'event location',
          description: 'Short description about the location of the event',
        },
      ),
      webpageUrl: Type.Union(
        [
          Type.String({
            title: 'URL',
          }),
          Type.Null({
            title: 'no external webpage',
          }),
        ],
        {
          title: 'external webpage URL',
          description: 'Provides a link to an external event webpage',
        },
      ),
      facebookUrl: Type.Union(
        [
          Type.String({
            title: 'URL',
          }),
          Type.Null({
            title: 'no facebook event',
          }),
        ],
        {
          title: 'facebook event URL',
          description: 'Provides a facebook event link for the event',
        },
      ),
      signupsPublic: Type.Boolean({
        title: 'show signups',
        description: '', // TODO: Describe the usage of signupsPublic
      }),
      nameQuestion: Type.Boolean({
        title: 'ask name for signup',
      }),
      emailQuestion: Type.Boolean({
        title: 'ask email for signup',
      }),
    }),
  ],
);

export const adminEventAttributesBasic = Type.Intersect(
  [
    userEventAttributesBasic,
    Type.Object({
      draft: Type.Boolean({
        title: 'is draft',
        description: '', // TODO: Describe briefly how draft events work
      }),
      listed: Type.Boolean({
        title: 'visibility in the event list',
        description: 'Listed events are publicly visible in the front page of Ilmomasiina',
      }),
    }),
  ],
);

export const adminEventAttributesExtended = Type.Intersect(
  [
    userEventAttributesExtended,
    adminEventAttributesBasic,
    Type.Object({
      verificationEmail: Type.Union(
        [
          Type.String({
            title: 'confirmation email text',
          }),
          Type.Null({
            title: 'no verification email',
          }),
        ],
        {
          title: 'email to send after a successful signup',
        },
      ),
      updatedAt: Type.String({
        title: 'last updated timestamp',
        format: 'date-time',
      }),
    }),
  ],
);

export const eventExtraInformation = Type.Object({
  millisTillOpening: Type.Union(
    [
      Type.Integer({
        title: 'remaining time in milliseconds',
        description: 'in milliseconds',
      }),
      Type.Null({
        title: 'signup is already opened or closed',
      }),
    ],
    {
      title: 'time remaining till registration opening',
    },
  ),
  registrationClosed: Type.Boolean({
    title: 'is the registration closed',
  }),
});
