import { HookContext } from '@feathersjs/feathers';

import EmailService from '../../../mail';
import { NewUserData } from '..';

export default () => (hook: HookContext<NewUserData>) => {
  const fields = [
    { label: 'Sähköposti', answer: hook.result!.email },
    { label: 'Salasana', answer: hook.data!.passwordPlain! },
  ];

  EmailService.sendNewUserMail(hook.result!.email, { fields });
};
