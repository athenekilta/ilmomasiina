import _ from 'lodash';
import { Model } from 'sequelize';
import { IlmoHookContext } from '../../../defs';
import { Answer } from '../../../models/answer';
import { Event } from '../../../models/event';
import { Question, QuestionAttributes } from '../../../models/question';
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

interface SignupGetAnswerItem extends QuestionAttributes {
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
  const id = hook.id as number; // TODO need checks for the type?
  const editToken = hook.params.query?.editToken;

  if (!verifyToken(id, editToken)) {
    throw new Error('Invalid editToken');
  }

  const signup = await Signup.findOne({
    where: { id },
    include: [
      {
        model: Answer as typeof Model,
      },
      {
        model: Quota as typeof Model,
        attributes: [],
        include: [
          {
            model: Event as typeof Model,
            include: [
              {
                model: Question as typeof Model,
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
      signup,
      event: null,
    };
    return hook;
  }

  const answers = signup.answers!;
  const event = signup.quota!.event!;
  const questions = await event.getQuestions();

  const answersByQuestion: SignupGetAnswerItem[] = [];
  questions.forEach((question) => {
    const answer = _.find(answers, { questionId: question.id });

    if (answer) {
      answersByQuestion.push({
        ...question,
        answer: answer.answer,
        answerId: answer.id,
      });
    }
  });

  hook.result = {
    signup: {
      ..._.pick(signup, signupGetSignupAttrs),
      answers: answersByQuestion,
    },
    event,
  };
  return hook;
};
