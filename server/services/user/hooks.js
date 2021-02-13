const authentication = require('@feathersjs/authentication')
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks
const hooks = require('feathers-hooks-common')
const createPassword = require('./hooks/createPassword')
const validateRegistration = require('./hooks/validateRegistration')
const sendEmail = require('./hooks/sendEmail')
const config = require('../../../config/ilmomasiina.config.js')

const createHook = config.adminRegistrationAllowed ?
  [validateRegistration(), createPassword(), hashPassword('password')] :
  [authentication.hooks.authenticate('jwt'), createPassword(), hashPassword('password')]

exports.before = {
  all: [],
  find: [authentication.hooks.authenticate('jwt')],
  get: [hooks.disallow('external')],
  create: createHook,
  update: [hooks.disallow('external'), hashPassword('password')],
  patch: [hooks.disallow('external'), hashPassword('password')],
  remove: [authentication.hooks.authenticate('jwt')],
}

exports.after = {
  all: [protect('password')],
  find: [],
  get: [],
  create: [sendEmail()],
  update: [],
  patch: [],
  remove: [],
}
