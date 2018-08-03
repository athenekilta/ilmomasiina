// const hooks = require('feathers-hooks-common');

const includeQuotas = require('./includeQuotas');
const includeAllEventData = require('./includeAllEventData');
const removeUnpublicAnswers = require('./removeUnpublicAnswers');
const formatOptionsAsArray = require('./formatOptionsAsArray');

exports.before = {
  all: [],
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
