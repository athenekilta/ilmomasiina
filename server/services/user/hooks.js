const hooks = require('feathers-hooks-common');
const createPassword = require('./hooks/createPassword');
const validateRegistration = require('./hooks/validateRegistration');
const sendEmail = require('./hooks/sendEmail');
const { hashPassword } = require('feathers-authentication-local').hooks;

exports.before = {
  all: [],
  find: [hooks.disable('external')],
  get: [hooks.disable('external')],
  create: [validateRegistration(), createPassword(), hashPassword()],
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
