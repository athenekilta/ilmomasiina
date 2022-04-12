const authentication = require('feathers-authentication');
const deleteSignup = require('./deleteSignup.js');
const sendEmailToQueue = require('../../../signup/hooks/sendEmailToQueue');
const hooks = require('feathers-hooks-common');

exports.before = {
    all: [authentication.hooks.authenticate('jwt')],
    find: [hooks.disable('external')],
    get: [hooks.disable('external')],
    create: [hooks.disable('external')],
    update: [hooks.disable('external')],
    patch: [hooks.disable('external')],
    remove: [deleteSignup(), sendEmailToQueue()],

};

exports.after = {};
