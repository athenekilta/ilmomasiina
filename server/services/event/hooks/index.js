const hooks = require('feathers-hooks-common');

const includeQuotas = require('./includeQuotas');
const includeAllEventData = require('./includeAllEventData');
const removeNonpublicAnswers = require('./removeNonpublicAnswers');
const formatOptionsAsArray = require('./formatOptionsAsArray');
const addOpenStatus = require('./addOpenStatus');

exports.before = {
  all: [],
  find: [includeQuotas()],
  get: [includeAllEventData()],
  create: [hooks.disable('external')],
  update: [hooks.disable('external')],
  patch: [hooks.disable('external')],
  remove: [hooks.disable('external')],
};

exports.after = {
  all: [],
  find: [],
  get: [removeNonpublicAnswers(), formatOptionsAsArray(), addOpenStatus()],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
