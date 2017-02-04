const hooks = require('feathers-hooks');

exports.before = {
  all: [hooks.disable('external')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};

exports.after = {
  all: [hooks.disable('external')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
