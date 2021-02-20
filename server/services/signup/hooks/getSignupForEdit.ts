import _ from 'lodash';
import { Model } from 'sequelize';
import { IlmoHookContext } from '../../../defs';
import { Answer } from '../../../models/answer';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { Signup } from '../../../models/signup';
import { eventServiceEventAttrs } from '../../event';
import { verifyToken } from '../editToken';

// Include the same attributes from Event as /api/events.
const signupGetEventAttrs = eventServiceEventAttrs;

// Attributes included from Signup.
const signupGetSignupAttrs = [
  'id',
  'firstName',
  'lastName',
  'email',
] as const;

// Attributes included from Question.
const signupGetQuestionAttrs = [
  'id',
  'question',
  'type',
  'options',
  'required',
  'public',
] as const;

// Data type definitions for this endpoint - pick columns and add included relations

interface SignupGetAnswerItem extends Pick<Question, typeof signupGetQuestionAttrs[number]> {
  answer: string;
  answerId: number;
}

interface SignupGetSignupItem extends Pick<Signup, typeof signupGetSignupAttrs[number]> {
  answers: SignupGetAnswerItem[];
}

interface SignupGetEventItem extends Pick<Event, typeof signupGetEventAttrs[number]> {}

interface SignupGetRootItem {
  signup: SignupGetSignupItem | null;
  event: SignupGetEventItem | null;
}

export default () => async (hook: IlmoHookContext<SignupGetRootItem>) => {
  const id = hook.id as number; // TODO need to check the type?

  const editToken = hook.params.query?.editToken;
  if (!verifyToken(id, editToken)) {
    throw new Error('Invalid editToken');
  }

  const signup = await Signup.findByPk(id, {
    attributes: [...signupGetSignupAttrs],
    include: [
      {
        model: Answer as typeof Model,
        required: false,
        attributes: ['id', 'answer'],
      },
      {
        model: Quota as typeof Model,
        attributes: [],
        include: [
          {
            model: Event as typeof Model,
            attributes: [...signupGetEventAttrs],
            include: [
              {
                model: Question as typeof Model,
                required: false,
                attributes: [...signupGetQuestionAttrs],
              },
            ],
          },
        ],
      },
    ],
  });
  if (signup === null) {
    // Event not found with id, probably deleted
    hook.result = {
      signup: null,
      event: null,
    };
    return hook;
  }

  const answers = signup.answers!;
  const event = signup.quota!.event!;
  const questions = event.questions!;

  // attach answers to the respective questions
  const answersByQuestion: SignupGetAnswerItem[] = [];
  questions.forEach((question) => {
    const answer = _.find(answers, { questionId: question.id });

    if (answer) {
      answersByQuestion.push({
        ...question,
        answerId: answer.id,
        answer: answer.answer,
      });
    }
  });

  hook.result = {
    signup: {
      ..._.pick(signup, signupGetSignupAttrs),
      answers: answersByQuestion,
    },
    event: _.pick(event, signupGetEventAttrs),
  };
  return hook;
};
