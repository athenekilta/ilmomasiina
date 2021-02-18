import { disallow } from 'feathers-hooks-common';
import addPositionToNewSignup from './attachPosition';
import deleteSignup from './deleteSignup';
import generateEditToken from './generateEditToken';
import getSignupForEdit from './getSignupForEdit';
import insertAnswers from './insertAnswers';
import sendConfirmationMail from './sendConfirmationMail';
import advanceQueueAfterDeletion from './advanceQueueAfterDeletion';
import validateAndCreateSignup from './validateAndCreateSignup';
import validateSignupForEdit from './validateSignup';

export default {
  before: {
    all: [],
    // Unused.
    find: [disallow()],
    // Used for loading signup edit form. Custom DB read.
    get: [getSignupForEdit()],
    // Used for creating new signups. Custom DB write.
    create: [validateAndCreateSignup()],
    // Unused.
    update: [disallow()],
    // Used for editing signups. Validate and pass data to feathers-sequelize.
    patch: [validateSignupForEdit()],
    // Used for deleting signups.
    remove: [deleteSignup()],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [addPositionToNewSignup(), generateEditToken()],
    update: [],
    patch: [insertAnswers(), sendConfirmationMail()],
    remove: [advanceQueueAfterDeletion()],
  },
};
