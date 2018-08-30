const authentication = require('feathers-authentication');

const includeQuotas = (hook) => {
  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    attributes: ['id', 'title', 'date', 'openQuotaSize'],
    distinct: true,
    // Include quotas of event and count of signups
    include: [
      {
        model: sequelize.models.quota,
        attributes: [
          'title',
          'size',
          [sequelize.fn('COUNT', sequelize.col('quota.signups.id')), 'signupCount'],
        ],
        include: [
          {
            model: sequelize.models.signup,
            attributes: [],
          },
        ],
      },
    ],
    group: [sequelize.col('event.id'), sequelize.col('quota.id')],
  };
};

const includeAllEventData = (hook) => {
  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    distinct: true,
    attributes: [
      'id',
      'title',
      'date',
      'openQuota',
      'description',
      'price',
      'location',
      'homepage',
      'facebookLink',
      'answersPublic',
    ],
    include: [
      // First include all questions (also non-public for the form)
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: sequelize.models.question,
      },
      // Include quotas..
      {
        attributes: ['title', 'size'],
        model: sequelize.models.quota,
        // ... and signups of quotas
        include: [
          {
            attributes: ['firstName', 'lastName'],
            model: sequelize.models.signup,
            // ... and answers of signups
            include: [
              {
                attributes: ['questionId', 'answer'],
                model: sequelize.models.answer,
                // ... but only public ones
                include: [
                  {
                    model: sequelize.models.question,
                    attributes: [],
                    where: { public: true },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};

const removeUnpublicAnswers = (hook) => {
  // console.log(hook.result.answersPublic)
  // if (!hook.result.answersPublic) {
  if (hook.result.quota) {
    hook.result.quota.map((quota) => {
      quota.testi = 'asd';
      if (quota.signups) {
        quota.signups = [];
      }
    });
  }
  // }
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
  get: [removeUnpublicAnswers, formatOptionsAsArray],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
