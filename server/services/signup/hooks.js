const hooks = require('feathers-hooks-common');
const _ = require('lodash');
const md5 = require('md5');
const moment = require('moment');

const config = require('../../../config/ilmomasiina.config');

const validateNewSignup = () => (hook) => {
  const quotaId = hook.data.quotaId;

  const isInt = n => n % 1 === 0;

  if (quotaId && isInt(quotaId)) {
    const quotas = hook.app.get('models').quota;

    // Check is quota open for signups
    return quotas.findById(quotaId)
      .catch(() => {
        throw new Error('Quota doesn\'t exist.');
      })
      .then((quota) => {
        const signupsAllowed = (signupOpens, signupCloses) => {
          const now = moment();

          const isOpened = now.isSameOrAfter(moment(signupOpens));
          const isClosed = now.isAfter(moment(signupCloses));
          const bothNull = (_.isNull(signupOpens) && _.isNull(signupCloses));

          return (isOpened && !isClosed) || bothNull;
        };

        if (!signupsAllowed(quota.signupOpens, quota.signupCloses)) {
          throw new Error('Signups closed for this quota.');
        }
      });
  }
  throw new Error('Missing valid quota id.');
};

const attachPosition = () => (hook) => {
  const signups = hook.app.service('/api/signups');

  const query = {
    quotaId: hook.result.quotaId,
    createdAt: {
      $lte: hook.result.createdAt,
    },
  };

  return signups.find({ query })
    .then((previousSignups) => {
      hook.result = {
        id: hook.result.id,
        position: (previousSignups.length + 1),
        editHash: hook.result.editHash,
        createdAt: hook.result.createdAt,
      };
    });
};

const attachEditToken = () => (hook) => {
  hook.result.editToken = md5(`${hook.result.id}${config.editTokenSalt}`);
};

const validateSignUpFields = () => (hook) => {
  const requiredFields = ['firstName', 'lastName', 'email'];

  requiredFields.map((fieldName) => {
    if (_.isNil(hook.data[fieldName])) {
      throw new Error('Empty fields on submit');
    }
    return true;
  });

  const models = hook.app.get('models');

  return models.signup.findById(hook.id)
    .then(signup => models.quota.findById(signup.quotaId))
    .then(quota => models.event.findById(quota.eventId))
    .then(event => event.getQuestions())
    .then((questions) => {
      // Remove answers to other events questions
      const questionIds = questions.map(q => q.id);
      _.remove(hook.data.answers, obj => questionIds.indexOf(obj.questionId) < 0);

      questions.map((question) => {
        const answer = _.find(hook.data.answers, { questionId: question.id });

        // Check that required question have answers
        if (question.required && _.isNil(answer)) {
          throw new Error(`Missing answer for question ${question.question}`);
        }

        // Check that select and checkbox answers are one of the options
        if ((question.type === 'select' || question.type === 'checkbox') && !_.isNil(answer)) {
          const options = question.options.split(',');

          if (options.indexOf(answer.answer) < 0) {
            throw new Error(`Invalid answer to question ${question.question}`);
          }
        }

        return true;
      });
      return hook;
    });
};

const insertAnswers = () => (hook) => {
  const signupId = hook.id;
  const answers = hook.data.answers.map(a => _.merge(a, { signupId }));

  return hook.app.get('models').answer.bulkCreate(answers, { updateOnDuplicate: true }).then(() => hook);
};

exports.before = {
  all: [],
  find: [hooks.disable('external')],
  get: [hooks.disable('external')],
  create: [validateNewSignup()],
  update: [hooks.disable('external')],
  patch: [validateSignUpFields()],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    attachPosition(),
    attachEditToken(),
  ],
  update: [],
  patch: [insertAnswers()],
  remove: [],
};
