const hooks = require('feathers-hooks-common');
const createPassword = require('./hooks/createPassword');
const validateRegistration = require('./hooks/validateRegistration');
const sendEmail = require('./hooks/sendEmail');
const { hashPassword } = require('feathers-authentication-local').hooks;
const config = require('../../../config/ilmomasiina.config.js');
const authentication = require('feathers-authentication');

let createHook;

if (config.adminRegistrationAllowed) {
  createHook = [validateRegistration(), createPassword(), hashPassword()]
}
else {
  createHook = [authentication.hooks.authenticate('jwt'), createPassword(), hashPassword()]
}

exports.before = {
  all: [],
  find: [authentication.hooks.authenticate('jwt')],
  get: [hooks.disable('external')],
  create: createHook,
  update: [hooks.disable('external'), hashPassword()],
  patch: [hooks.disable('external'), hashPassword()],
  remove: [authentication.hooks.authenticate('jwt')],
};

exports.after = {
  all: [hooks.remove('password')],
  find: [],
  get: [],
  create: [sendEmail()],
  update: [],
  patch: [],
  remove: [],
};
