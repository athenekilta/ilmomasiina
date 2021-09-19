import { BadRequest, NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import _ from 'lodash';
import { Transaction } from 'sequelize';

import sendSignupConfirmationEmail from '../../mail/signupConfirmation';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Signup } from '../../models/signup';
import { verifyToken } from './editTokens';

// Expected request schema.
export interface SignupUpdateBodyAnswer {
  questionId: number;
  answer: string;
}

export interface SignupUpdateBody {
  firstName: string;
  lastName: string;
  email: string;
  answers: SignupUpdateBodyAnswer[];
  editToken?: string;
}

// Response schema.
export interface SignupUpdateResponse {
  id: number;
  confirmedAt: Date;
}

// Fields that are present and required in every signup.
const alwaysRequiredFields = ['firstName', 'lastName', 'email'] as const;

export default async (id: number, data: SignupUpdateBody, params?: Params): Promise<SignupUpdateResponse> => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  const editToken = params?.query?.editToken || data.editToken;
  verifyToken(Number(id), editToken);

  const updatedSignup = await Signup.sequelize!.transaction(async (transaction) => {
    // Retrieve event data and lock the row for editing
    const signup = await Signup.findByPk(id, {
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
    const questions = quota.event!.questions!;

    // Check that all common fields are present (if first time confirming)
    if (!signup.confirmedAt) {
      alwaysRequiredFields.forEach((fieldName) => {
        if (!data[fieldName]) {
          throw new BadRequest(`Missing ${fieldName}`);
        }
      });
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
            if (!Number.isFinite(answer)) {
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
        questionId: question.id,
        answer,
        signupId: signup.id,
      };
    });

    // Update the fields for the signup if this is the first confirmation
    if (!signup.confirmedAt) {
      const updatedFields = {
        ..._.pick(data, alwaysRequiredFields),
        confirmedAt: new Date(),
      };
      await signup.update(updatedFields, { transaction });
    }

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
