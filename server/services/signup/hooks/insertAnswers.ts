import { IlmoHookContext } from '../../../defs';
import { Signup } from '../../../models/signup';

module.exports = () => (hook: IlmoHookContext<Signup>) => {
  const signupId = hook.id;
  const answers = hook.data!.answers!.map((answer) => ({
    ...answer,
    signupId,
  }));

  return hook.app
    .get('models')
    .answer.bulkCreate(answers, { updateOnDuplicate: true })
    .then(() => hook);
};
