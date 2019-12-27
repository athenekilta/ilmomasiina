const { authenticate } = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-hooks-common');
const deleteSignup = require('./deleteSignup.js');

exports.before = {
  all: [authenticate('jwt')],
  find: [hooks.disallow('external')],
  get: [hooks.disallow('external')],
  create: [hooks.disallow('external')],
  update: [hooks.disallow('external')],
  patch: [hooks.disallow('external')],
  remove: [deleteSignup()],
};

exports.after = {};
