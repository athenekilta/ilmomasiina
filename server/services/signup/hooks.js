const hooks = require('feathers-hooks');

exports.before = {
  all: [],
  find: [hooks.disable('external')],
  get: [hooks.disable('external')],
  create: [],
  update: [],
  patch: [],
  remove: [hooks.disable('external')],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
