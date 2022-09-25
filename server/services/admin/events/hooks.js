const hooks = require('feathers-hooks-common');
const authentication = require('feathers-authentication');

const includeQuotas = require('./hooks/includeQuotas');
const includeAllEventData = require('./hooks/includeAllEventData');
const formatOptionsAsArray = require('./hooks/formatOptionsAsArray');
// const createEvent = require('./hooks/createEvent');
const updateQuotas = require('./hooks/updateQuotas');
const updateQuestions = require('./hooks/updateQuestions');
const preservePrivacy = require('./hooks/preservePrivacy.js');

exports.before = {
  all: [authentication.hooks.authenticate('jwt')],
  find: [includeQuotas()],
  get: [includeAllEventData()],
  create: [includeAllEventData()],
  update: [includeAllEventData(), preservePrivacy()],
  patch: [includeAllEventData(), preservePrivacy()],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [formatOptionsAsArray()],
  create: [
    /* createEvent() */
  ],
  update: [updateQuotas(), updateQuestions()],
  patch: [updateQuotas(), updateQuestions()],
  remove: [],
};
