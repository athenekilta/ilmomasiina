// const hooks = require('feathers-hooks-common');

const includeQuotas = require('./includeQuotas');
const includeAllEventData = require('./includeAllEventData');
const removeNonpublicAnswers = require('./removeNonpublicAnswers');
const formatOptionsAsArray = require('./formatOptionsAsArray');
// const createEvent = require('./createEvent');
const validateEvent = require('./validateEvent');

exports.before = {
  all: [],
  find: [includeQuotas()],
  get: [includeAllEventData()],
  create: [validateEvent()],
  update: [],
  patch: [],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [removeNonpublicAnswers(), formatOptionsAsArray()],
  create: [
    /* createEvent() */
  ],
  update: [],
  patch: [],
  remove: [],
};
