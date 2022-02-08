import { BadRequest, Forbidden, NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import _ from 'lodash';
import { Transaction } from 'sequelize';

import { SignupUpdateBody, SignupUpdateResponse } from '@tietokilta/ilmomasiina-models/src/services/signups/update';
import sendSignupConfirmationEmail from '../../mail/signupConfirmation';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { generateRandomId } from '../../models/randomId';
import { Signup } from '../../models/signup';
import { signupsAllowed } from './createNewSignup';
import { verifyToken } from './editTokens';

export default async (id: string, data: SignupUpdateBody, params?: Params): Promise<SignupUpdateResponse> => {
  const editToken = params?.query?.editToken || data.editToken;
  verifyToken(id, editToken);

  const updatedSignup = await Signup.sequelize!.transaction(async (transaction) => {
    // Retrieve event data and lock the row for editing
    const signup = await Signup.scope('active').findByPk(id, {
      attributes: ['id', 'quotaId', 'confirmedAt', 'firstName', 'lastName', 'email'],
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });
    if (signup === null) {
      throw new NotFound('Signup expired or already deleted');
    }

    const quota = await signup.getQuota({
      include: [
        {
          model: Event,
          include: [
            {
              model: Question,
            },
          ],
        },
      ],
      transaction,
    });
    const event = quota.event!;
    if (!signupsAllowed(event)) {
      throw new Forbidden('Signups closed for this event.');
    }

    const questions = event.questions!;

    // Check that required common fields are present (if first time confirming)
    if (!signup.confirmedAt) {
      if (event.nameQuestion) {
        if (!data.firstName) {
          throw new BadRequest('Missing first name');
        }
        if (!data.lastName) {
          throw new BadRequest('Missing last name');
        }
      }
      if (event.emailQuestion && !data.email) {
        throw new BadRequest('Missing email');
      }
    }

    // Check that all questions are answered with a valid answer
    const newAnswers = questions.map((question) => {
      const answer = _.find(data.answers, { questionId: question.id })?.answer || '';

      if (!answer) {
        if (question.required) {
          throw new BadRequest(`Missing answer for question ${question.question}`);
        }
      } else {
        switch (question.type) {
          case 'text':
          case 'textarea':
            break;
          case 'number':
            // Check that a numeric answer is valid
            if (!Number.isFinite(parseFloat(answer))) {
              throw new BadRequest(`Invalid answer to question ${question.question}`);
            }
            break;
          case 'select': {
            // Check that the select answer is valid
            const options = question.options!.split(';');

            if (!options.includes(answer)) {
              throw new BadRequest(`Invalid answer to question ${question.question}`);
            }
            break;
          }
          case 'checkbox': {
            // Check that all checkbox answers are valid
            const options = question.options!.split(';');
            const answers = answer.split(';');

            answers.forEach((option) => {
              if (!options.includes(option)) {
                throw new BadRequest(`Invalid answer to question ${question.question}`);
              }
            });
            break;
          }
          default:
            throw new Error('Invalid question type');
        }
      }

      return {
        id: generateRandomId(), // https://github.com/sequelize/sequelize/issues/2140
        questionId: question.id,
        answer,
        signupId: signup.id,
      };
    });

    // Update fields for the signup (name and email only editable on first confirmation)
    const firstUpdate = !signup.confirmedAt;
    const nameFields = firstUpdate && event.nameQuestion ? _.pick(data, 'firstName', 'lastName') : {};
    const emailField = firstUpdate && event.emailQuestion ? _.pick(data, 'email') : {};

    const updatedFields = {
      ...nameFields,
      ...emailField,
      ..._.pick(data, 'namePublic'),
      confirmedAt: new Date(),
    };
    await signup.update(updatedFields, { transaction });

    // Update the Answers for the Signup
    await Answer.destroy({
      where: {
        signupId: signup.id,
      },
      transaction,
    });
    await Answer.bulkCreate(newAnswers, { transaction });

    return signup;
  });

  // Send the confirmation email
  await sendSignupConfirmationEmail(updatedSignup);

  // Return data
  return {
    id: updatedSignup.id,
    confirmedAt: updatedSignup.confirmedAt!,
  };
};
