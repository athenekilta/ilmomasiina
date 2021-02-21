import { BadRequest, NotFound } from '@feathersjs/errors';
import { Id, Params } from '@feathersjs/feathers';
import _ from 'lodash';
import { Model } from 'sequelize';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { eventServiceEventAttrs } from '../event';
import { verifyToken } from './editTokens';

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

export interface SignupGetResponse {
  signup: SignupGetSignupItem | null;
  event: SignupGetEventItem | null;
}

export default async (id: Id, params?: Params): Promise<SignupGetResponse> => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  const editToken = params?.query?.editToken;
  verifyToken(Number(id), editToken);

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
    throw new NotFound('No signup found with id');
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

  return {
    signup: {
      ..._.pick(signup, signupGetSignupAttrs),
      answers: answersByQuestion,
    },
    event: _.pick(event, signupGetEventAttrs),
  };
};
