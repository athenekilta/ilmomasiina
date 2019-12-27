const { authenticate } = require('@feathersjs/authentication').hooks;

const includeQuotas = require('./hooks/includeQuotas');
const includeAllEventData = require('./hooks/includeAllEventData');
const formatOptionsAsArray = require('./hooks/formatOptionsAsArray');
// const createEvent = require('./hooks/createEvent');
const updateQuotas = require('./hooks/updateQuotas');
const updateQuestions = require('./hooks/updateQuestions');

exports.before = {
  all: [authenticate('jwt')],
  find: [includeQuotas()],
  get: [includeAllEventData()],
  create: [includeAllEventData()],
  update: [includeAllEventData()],
  patch: [includeAllEventData()],
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
