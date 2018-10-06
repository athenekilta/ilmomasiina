const hooks = require('feathers-hooks-common');

const includeQuotas = require('./includeQuotas');
const includeAllEventData = require('./includeAllEventData');
const removeNonpublicAnswers = require('./removeNonpublicAnswers');
const formatOptionsAsArray = require('./formatOptionsAsArray');
const validateEvent = require('./validateEvent');

exports.before = {
  all: [],
  find: [includeQuotas()],
  get: [includeAllEventData()],
  create: [validateEvent()],
  update: [hooks.disable('external')],
  patch: [hooks.disable('external')],
  remove: [hooks.disable('external')],
};

exports.after = {
  all: [],
  find: [],
  get: [removeNonpublicAnswers(), formatOptionsAsArray()],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
