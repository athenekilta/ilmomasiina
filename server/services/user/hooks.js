const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const hooks = require('feathers-hooks-common');
const createPassword = require('./hooks/createPassword');
const validateRegistration = require('./hooks/validateRegistration');
const getUser = require('./hooks/getUser');
const sendEmail = require('./hooks/sendEmail');
const config = require('../../../config/ilmomasiina.config.js');

let createHook;

if (config.adminRegistrationAllowed) {
  createHook = [
    validateRegistration(),
    createPassword(),
    hashPassword('password'),
  ];
} else {
  createHook = [
    authenticate('jwt'),
    createPassword(),
    hashPassword('password'),
  ];
}

exports.before = {
  all: [],
  find: [hooks.disallow('external')],
  get: [getUser()],
  create: createHook,
  update: [hooks.disallow('external'), hashPassword('password')],
  patch: [hooks.disallow('external'), hashPassword('password')],
  remove: [hooks.disallow('external')],
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
