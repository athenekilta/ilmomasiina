import {
  eventServiceAnswerAttrs, eventServiceAttrs, eventServiceQuestionAttrs, eventServiceQuotaAttrs,
  eventServiceSignupAttrs,
} from '..';
import { IlmoHookContext } from '../../../defs';
import { Answer } from '../../../models/answer';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { Signup } from '../../../models/signup';

export default () => (hook: IlmoHookContext<Event>) => {
  hook.params.sequelize = {
    distinct: true,
    attributes: eventServiceAttrs,
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
