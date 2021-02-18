import _ from 'lodash';
import { IlmoHookContext } from '../../../defs';
import { Signup } from '../../../models/signup';

export default () => async (hook: IlmoHookContext<Partial<Signup>>) => {
  const requiredFields = ['firstName', 'lastName', 'email'] as const;

  requiredFields.map((fieldName) => {
    if (!hook.data![fieldName]) {
      throw new Error('Empty fields on submit');
    }
    return true;
  });

  hook.data!.confirmedAt = new Date();

  let signup: Signup | null;
  try {
    signup = await Signup.findByPk(hook.id);
  } catch (error) {
    throw new Error('Signup expired');
  }
  if (!signup) {
    throw new Error('Signup expired');
  }

  const quota = await signup.getQuota();
  const event = await quota.getEvent();
  const questions = await event.getQuestions();

  // Prevent modification of createdAt
  delete hook.data!.createdAt;

  // Remove answers to unrelated questions
  const validQuestions = questions.map((question) => question.id);
  hook.data!.answers = hook.data!.answers?.filter((answer) => validQuestions.includes(answer.questionId));

  // Validate all answers
  questions.forEach((question) => {
    const answer = _.find(hook.data!.answers, { questionId: question.id });

    if (!answer) {
      if (question.required) {
        throw new Error(`Missing answer for question ${question.question}`);
      }
    } else {
      // Check that the select answer is valid
      if (question.type === 'select') {
        const options = question.options!.split(';');

        if (options.indexOf(answer.answer) === -1) {
          throw new Error(`Invalid answer to question ${question.question}`);
        }
      }
      // Check that all checkbox answers are valid
      if (question.type === 'checkbox') {
        const options = question.options!.split(';');
        const answers = answer.answer.split(';');

        answers.forEach((ans) => {
          if (options.indexOf(ans) === -1) {
            throw new Error(`Invalid answer to question ${question.question}`);
          }
        });
      }
    }
  });
  return hook;
};
