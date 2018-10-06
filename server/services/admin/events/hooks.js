const authentication = require('feathers-authentication');

const includeQuotas = (hook) => {
  hook.params.sequelize = {
    attributes: ['id', 'title', 'date', 'openQuotaSize', 'draft'],
    distinct: true,
  };
};

const includeAllEventData = (hook) => {
  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    distinct: true,
    raw: false,
    attributes: [
      'id',
      'title',
      'date',
      'registrationStartDate',
      'registrationEndDate',
      'openQuotaSize',
      'description',
      'price',
      'location',
      'homepage',
      'webpageUrl',
      'facebookUrl',
      'draft',
      'signupsPublic',
      'verificationEmail',
    ],
    include: [
      // First include all questions
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: sequelize.models.question,
      },
      // Include quotas..
      {
        attributes: ['title', 'size', 'id'],
        model: sequelize.models.quota,
        // ... and signups of quotas
        include: [
          {
            attributes: ['firstName', 'lastName', 'createdAt'],
            model: sequelize.models.signup,
            // ... and answers of signups
            include: [
              {
                attributes: ['questionId', 'answer'],
                model: sequelize.models.answer,
              },
            ],
          },
        ],
      },
    ],
  };
};

const formatOptionsAsArray = (hook) => {
  if (hook.result.questions) {
    hook.result.questions.map((question) => {
      if (question.options) {
        question.options = question.options.split(';');
      }
    });
  }
};

exports.before = {
  all: [authentication.hooks.authenticate('jwt')],
  find: [includeQuotas],
  get: [includeAllEventData],
  create: [],
  update: [],
  patch: [],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [formatOptionsAsArray],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
