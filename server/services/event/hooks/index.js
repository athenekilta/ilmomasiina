// const hooks = require('feathers-hooks-common');

const includeQuotas = require('./includeQuotas');
const includeAllEventData = require('./includeAllEventData');
const removeUnpublicAnswers = require('./removeUnpublicAnswers');
const formatOptionsAsArray = require('./formatOptionsAsArray');
// const createEvent = require('./createEvent');
// const validateEvent = require('./validateEvent');

exports.before = {
  all: [],
  find: [includeQuotas()],
  get: [includeAllEventData()],
  create: [
    /* validateEvent() */
  ],
  update: [],
  patch: [],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [removeUnpublicAnswers(), formatOptionsAsArray()],
  create: [
    /* createEvent() */
  ],
  update: [],
  patch: [],
  remove: [],
};
