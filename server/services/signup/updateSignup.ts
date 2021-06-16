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
export interface SignupUpdateBody {
  firstName: string;
  lastName: string;
  email: string;
  answers: {
    questionId: number;
    answer: string;
  }[];
}

// Response schema.
export interface SignupUpdateResponse {
  id: number;
  confirmedAt: Date;
}

export default async (id: number, data: SignupUpdateBody, params?: Params): Promise<SignupUpdateResponse> => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  const editToken = params?.query?.editToken;
  verifyToken(Number(id), editToken);

  // Check that all common fields are present
  const requiredFields = ['firstName', 'lastName', 'email'] as const;
  requiredFields.map((fieldName) => {
    if (!data[fieldName]) {
      throw new BadRequest(`Missing ${fieldName}`);
    }
    return true;
  });

  const updatedSignup = await Signup.sequelize!.transaction(async (transaction) => {
    // Retrieve event data and lock the row for editing
    const signup = await Signup.findByPk(id, {
      attributes: ['id'],
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });
    if (signup === null) {
      throw new NotFound('Signup expired or already deleted');
    }

    const quota = await signup.getQuota({
      attributes: [],
      include: [
        {
          model: Event,
          attributes: [],
          include: [
            {
              model: Question,
              attributes: ['question', 'options'],
            },
          ],
        },
      ],
      transaction,
    });
    const questions = quota.event!.questions!;

    // Remove answers to unrelated questions
    const validQuestions = questions.map((question) => question.id);
    data.answers = data.answers.filter((answer) => validQuestions.includes(answer.questionId));

    // Check that all questions are answered with a valid answer
    questions.forEach((question) => {
      const answer = _.find(data.answers, { questionId: question.id });

      if (!answer) {
        if (question.required) {
          throw new BadRequest(`Missing answer for question ${question.question}`);
        }
      } else {
        let options: string[];
        let answers: string[];
        switch (question.type) {
          case 'text':
          case 'textarea':
            break;
          case 'number':
            // Check that a numeric answer is valid
            if (!Number.isFinite(answer.answer)) {
              throw new BadRequest(`Invalid answer to question ${question.question}`);
            }
            break;
          case 'select':
            // Check that the select answer is valid
            options = question.options!.split(';');

            if (options.indexOf(answer.answer) === -1) {
              throw new BadRequest(`Invalid answer to question ${question.question}`);
            }
            break;
          case 'checkbox':
            // Check that all checkbox answers are valid
            options = question.options!.split(';');
            answers = answer.answer.split(';');

            answers.forEach((option) => {
              if (options.indexOf(option) === -1) {
                throw new BadRequest(`Invalid answer to question ${question.question}`);
              }
            });
            break;
          default:
            throw new Error('Invalid question type');
        }
      }
    });

    // Update the Signup
    const updatedFields = {
      ..._.pick(data, requiredFields),
      confirmedAt: new Date(),
    };

    await signup.update(updatedFields, { transaction });

    // Update the Answers for the Signup
    const newAnswers = data.answers!.map((answer) => ({
      ...answer,
      signupId: signup.id,
    }));

    await signup.removeAnswers(undefined, { transaction });
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
