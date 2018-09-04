const authentication = require('feathers-authentication');
const hooks = require('feathers-hooks-common');
const createPassword = require('./hooks/createPassword');
const sendEmail = require('./hooks/sendEmail');
const { hashPassword } = require('feathers-authentication-local').hooks;

exports.before = {
  all: [authentication.hooks.authenticate('jwt')],
  find: [hooks.disable('external')],
  get: [hooks.disable('external')],
  create: [createPassword(), hashPassword()],
  update: [hooks.disable('external'), hashPassword()],
  patch: [hooks.disable('external'), hashPassword()],
  remove: [hooks.disable('external')],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [sendEmail()],
  update: [],
  patch: [],
  remove: [],
};
