import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequest, Forbidden, NotFound } from 'http-errors';
import { Transaction } from 'sequelize';

import { AuditEvent } from '@tietokilta/ilmomasiina-models/src/enum';
import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import sendSignupConfirmationEmail from '../../mail/signupConfirmation';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Signup } from '../../models/signup';
import { stringifyDates } from '../utils';
import { signupsAllowed } from './createNewSignup';

/** Requires editTokenVerification */
export default async function updateSignup(
  request: FastifyRequest<{ Params: schema.SignupPathParams, Body: schema.SignupUpdateSchema }>,
  reply: FastifyReply,
): Promise<schema.UpdatedSignupSchema> {
  const updatedSignup = await Signup.sequelize!.transaction(async (transaction) => {
    // Retrieve event data and lock the row for editing
    const signup = await Signup.scope('active').findByPk(request.params.id, {
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

    /** Is this signup already confirmed (i.e. is this the first update for this signup) */
    const notConfirmedYet = !signup.confirmedAt;
    const questions = event.questions!;

    // Check that required common fields are present (if first time confirming)
    let nameFields = {};
    if (notConfirmedYet && event.nameQuestion) {
      const { firstName, lastName } = request.body;
      if (!firstName) throw new BadRequest('Missing first name');
      if (!lastName) throw new BadRequest('Missing last name');
      nameFields = { firstName, lastName };
    }

    let emailField = {};
    if (notConfirmedYet && event.emailQuestion) {
      const { email } = request.body;
      if (!email) throw new BadRequest('Missing email');
      emailField = { email };
    }

    // Check that all questions are answered with a valid answer
    const newAnswers = questions.map((question) => {
      const answer = request.body.answers
        ?.find((a) => a.questionId === question.id)
        ?.answer
        || '';

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
        questionId: question.id,
        answer,
        signupId: signup.id,
      };
    });

    // Update fields for the signup (name and email only editable on first confirmation)
    const updatedFields = {
      ...nameFields,
      ...emailField,
      namePublic: Boolean(request.body.namePublic),
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

    await request.logEvent(AuditEvent.EDIT_SIGNUP, {
      signup,
      event: quota.event,
      transaction,
    });

    return signup;
  });

  // Send the confirmation email
  await sendSignupConfirmationEmail(updatedSignup);

  // Return data
  const res = stringifyDates({
    id: updatedSignup.id,
    confirmedAt: updatedSignup.confirmedAt!,
  });

  reply.status(200);
  return res;
}
