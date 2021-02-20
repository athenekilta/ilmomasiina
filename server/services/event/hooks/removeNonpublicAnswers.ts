import { EventServiceItem } from '..';
import { IlmoHookContext } from '../../../defs';

export default () => (hook: IlmoHookContext<EventServiceItem>) => {
  const event = hook.result!;

  // Hide all signups if answers are not public
  if (!event.signupsPublic) {
    if (event.quotas) {
      event.quotas = event.quotas.map((quota) => ({
        ...quota,
        signups: null,
      }));
    }
    return hook;
  }

  // Find IDs of public questions
  const publicQuestions = event.questions
    .filter((question) => question.public)
    .map((question) => question.id);

  // Hide answers of non-public questions
  hook.result!.quotas = event.quotas.map((quota) => ({
    ...quota,
    signups: quota.signups!.map((signup) => ({
      ...signup,
      answers: signup.answers.filter((answer) => publicQuestions.includes(answer.questionId)),
    })),
  }));

  return hook;
};
