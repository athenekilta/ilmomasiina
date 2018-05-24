const { hashPassword } = require('feathers-authentication-local').hooks;

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [hashPassword()],
  update: [hashPassword()],
  patch: [hashPassword()],
  remove: [],
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
