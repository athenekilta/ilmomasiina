import { IlmoHookContext } from '../../../defs';
import { Signup } from '../../../models/signup';
import { generateToken } from '../editToken';

export default () => (hook: IlmoHookContext<Signup>) => {
  hook.result!.editToken = generateToken(hook.result!);
};
