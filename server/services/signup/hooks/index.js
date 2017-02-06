const hooks = require('feathers-hooks-common');

const validateNewSignup = require('./validateNewSignup.js');
const validateSignupFields = require('./validateSignupFields.js');
const attachPosition = require('./attachPosition.js');
const attachEditToken = require('./attachEditToken.js');
const insertAnswers = require('./insertAnswers.js');
const sendConfirmationMail = require('./sendConfirmationMail.js');

exports.before = {
  all: [],
  find: [hooks.disable('external')],
  get: [hooks.disable('external')],
  create: [validateNewSignup()],
  update: [hooks.disable('external')],
  patch: [validateSignupFields()],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    attachPosition(),
    attachEditToken(),
  ],
  update: [],
  patch: [
    insertAnswers(),
    sendConfirmationMail(),
  ],
  remove: [],
};
