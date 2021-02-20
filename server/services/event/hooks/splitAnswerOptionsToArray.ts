import { EventServiceItem } from '..';
import { IlmoHookContext } from '../../../defs';

export default () => (hook: IlmoHookContext<EventServiceItem>) => {
  if (hook.result!.questions) {
    hook.result!.questions.forEach((question) => {
      if (question.options) {
        question.options = (question.options as string).split(';');
      }
    });
  }
};
