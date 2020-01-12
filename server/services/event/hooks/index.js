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
  create: [hooks.disallow('external')],
  update: [hooks.disallow('external')],
  patch: [hooks.disallow('external')],
  remove: [hooks.disallow('external')]
};

exports.after = {
  all: [],
  find: [],
  get: [removeNonpublicAnswers(), formatOptionsAsArray(), addOpenStatus()],
  create: [],
  update: [],
  patch: [],
  remove: []
};
