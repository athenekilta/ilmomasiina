import AnswerAttributes from '../../models/answer';
import EventAttributes from '../../models/event';
import QuestionAttributes from '../../models/question';
import SignupAttributes from '../../models/signup';
import { eventGetEventAttrs, eventGetQuestionAttrs } from '../events/details';

// Include the same attributes from Event as /api/events.
export const signupGetEventAttrs = eventGetEventAttrs;

export const signupGetQuestionAttrs = eventGetQuestionAttrs;

// Attributes included from Answer.
export const signupGetAnswerAttrs = [
  'questionId',
  'answer',
] as const;

// Attributes included from Signup.
export const signupGetSignupAttrs = [
  'id',
  'firstName',
  'lastName',
  'email',
  'status',
  'position',
] as const;

// Data type definitions for this endpoint - pick columns and add included relations

export interface SignupGetAnswerItem extends Pick<AnswerAttributes, typeof signupGetAnswerAttrs[number]> {}

export interface SignupGetSignupItem extends Pick<SignupAttributes, typeof signupGetSignupAttrs[number]> {
  answers: SignupGetAnswerItem[];
}

export interface SignupGetQuestionItem
  extends Omit<Pick<QuestionAttributes, typeof signupGetQuestionAttrs[number]>, 'options'> {
  options: string[] | null;
}

export interface SignupGetEventItem extends Pick<EventAttributes, typeof signupGetEventAttrs[number]> {
  questions: SignupGetQuestionItem[];
}

export interface SignupGetResponse {
  signup: SignupGetSignupItem | null;
  event: SignupGetEventItem | null;
}
