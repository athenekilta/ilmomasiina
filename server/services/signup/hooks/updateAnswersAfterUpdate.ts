import { IlmoHookContext } from '../../../defs';
import { Answer } from '../../../models/answer';
import { Signup } from '../../../models/signup';

export default () => async (hook: IlmoHookContext<Signup>) => {
  const signup = hook.result!;

  const newAnswers = hook.data!.answers!.map((answer) => ({
    ...answer,
    signupId: signup.id,
  }));

  await signup.removeAnswers();
  await Answer.bulkCreate(newAnswers);

  return hook;
};
