const hooks = require('feathers-hooks-common');

const validateNewSignup = require('./validateNewSignup.js');
const validateSignupFields = require('./validateSignupFields.js');
const attachPosition = require('./attachPosition.js');
const attachEditToken = require('./attachEditToken.js');
const insertAnswers = require('./insertAnswers.js');
const sendConfirmationMail = require('./sendConfirmationMail.js');
const getSignupAndEvent = require('./getSignupAndEvent.js');
const deleteSignup = require('./deleteSignup.js');
const sendEmailToQueue = require('./sendEmailToQueue.js');

exports.before = {
  all: [],
  find: [hooks.disable('external')],
  get: [getSignupAndEvent()],
  create: [validateNewSignup()],
  update: [hooks.disable('external')],
  patch: [validateSignupFields()],
  remove: [deleteSignup()],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [attachPosition(), attachEditToken()],
  update: [],
  patch: [insertAnswers(), sendConfirmationMail()],
  remove: [sendEmailToQueue()],
};
