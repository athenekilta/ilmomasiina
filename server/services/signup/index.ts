import { disallow } from 'feathers-hooks-common';
import sequelizeService from 'feathers-sequelize';
import { IlmoService } from '..';
import { IlmoApplication } from '../../defs';
import { Signup } from '../../models/signup';
import addEditTokenToNewSignup from './hooks/addEditTokenToNewSignup';
import addPositionToNewSignup from './hooks/addPositionToNewSignup';
import advanceQueueAfterDeletion from './hooks/advanceQueueAfterDeletion';
import deleteSignup from './hooks/deleteSignup';
import getSignupForEdit from './hooks/getSignupForEdit';
import sendConfirmationMailAfterUpdate from './hooks/sendConfirmationMailAfterUpdate';
import updateAnswersAfterUpdate from './hooks/updateAnswersAfterUpdate';
import validateSignupAnswers from './hooks/validateSignupAnswers';
import validateSignupCreation from './hooks/validateSignupCreation';

export type SignupsService = IlmoService<any>;

export default function (this: IlmoApplication) {
  const app = this;

  const options = {
    Model: Signup,
  };

  // Initialize our service with any options it requires
  app.use('/api/signups', sequelizeService(options));

  // Get our initialize service to that we can bind hooks
  const signupService = app.service('/api/signups');

  signupService.hooks({
    before: {
      all: [],
      // Unused.
      find: [disallow()],
      // Used for loading signup edit form. Custom DB read.
      get: [getSignupForEdit()],
      // Used for creating new signups. Verify registration is allowed and pass to feathers-sequelize.
      create: [validateSignupCreation()],
      // Unused.
      update: [disallow()],
      // Used for editing signups. Validate and pass data to feathers-sequelize.
      patch: [validateSignupAnswers()],
      // Used for deleting signups.
      remove: [deleteSignup()],
    },
    after: {
      all: [],
      find: [],
      get: [],
      create: [addPositionToNewSignup(), addEditTokenToNewSignup()],
      update: [],
      patch: [updateAnswersAfterUpdate(), sendConfirmationMailAfterUpdate()],
      remove: [advanceQueueAfterDeletion()],
    },
  });
}
