const authentication = require('@feathersjs/authentication');
const hooks = require('feathers-hooks-common');
const deleteSignup = require('./deleteSignup.js');
const sendEmailToQueue = require('../../../signup/hooks/advanceQueueAfterDeletion');

exports.before = {
    all: [authentication.hooks.authenticate('jwt')],
    find: [hooks.disallow('external')],
    get: [hooks.disallow('external')],
    create: [hooks.disallow('external')],
    update: [hooks.disallow('external')],
    patch: [hooks.disallow('external')],
    remove: [deleteSignup(), sendEmailToQueue()],

};

exports.after = {};
