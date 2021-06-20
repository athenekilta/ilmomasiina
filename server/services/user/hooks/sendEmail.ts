import { HookContext } from '@feathersjs/feathers';
import { UserServiceItem } from '..';
import EmailService from '../../../mail';

export default () => (hook: HookContext<UserServiceItem>) => {
  const fields = [
    { label: 'Sähköposti', answer: hook.result!.email },
    { label: 'Salasana', answer: hook.data!.passwordPlain! },
  ];

  EmailService.sendNewUserMail(hook.result!.email, { fields });
};
