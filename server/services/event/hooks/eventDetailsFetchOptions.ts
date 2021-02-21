import { HookContext } from '@feathersjs/feathers';
import {
  eventServiceAnswerAttrs, eventServiceEventAttrs, eventServiceQuestionAttrs, eventServiceQuotaAttrs,
  eventServiceSignupAttrs,
} from '..';
import { Answer } from '../../../models/answer';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { Signup } from '../../../models/signup';

export default () => (hook: HookContext) => {
  hook.params.sequelize = {
    distinct: true,
    attributes: eventServiceEventAttrs,
    raw: false,
    include: [
      // First include all questions (also non-public for the form)
      {
        model: Question,
        attributes: eventServiceQuestionAttrs,
      },
      // Include quotas..
      {
        model: Quota,
        attributes: eventServiceQuotaAttrs,
        // ... and signups of quotas
        include: [
          {
            model: Signup,
            attributes: eventServiceSignupAttrs,
            required: false,
            // ... and answers of signups
            include: [
              {
                model: Answer,
                attributes: eventServiceAnswerAttrs,
                required: false,
              },
            ],
          },
        ],
      },
    ],
  };
};
