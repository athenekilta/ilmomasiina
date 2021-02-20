import { IlmoHookContext } from '../../../defs';
import { Signup } from '../../../models/signup';
import { verifyToken } from '../editToken';

export default () => async (hook: IlmoHookContext<Signup | null>) => {
  const id = hook.id as number;
  const editToken = hook.params.query?.editToken;

  if (!verifyToken(id, editToken)) {
    throw new Error('Invalid editToken');
  }

  // TODO: ensure that no data is actually returned here
  const signup = await Signup.findByPk(id);
  hook.result = signup;
  await signup?.destroy();
};
