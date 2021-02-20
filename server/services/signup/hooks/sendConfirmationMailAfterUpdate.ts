import _ from 'lodash';
import moment from 'moment';
import EmailService from '../../../mail';
import config from '../../../config/ilmomasiina.config';
import { IlmoHookContext } from '../../../defs';
import { Signup } from '../../../models/signup';

export default () => async (hook: IlmoHookContext<Signup>) => {
  const signup = hook.result!;

  const answers = await signup.getAnswers();
  const quota = await signup.getQuota();
  const event = await quota.getEvent();
  const questions = await event.getQuestions();

  const fields = [
    { label: 'Nimi', answer: `${signup.firstName} ${signup.lastName}` },
    { label: 'Sähköposti', answer: `${signup.email}` },
    { label: 'Kiintiö', answer: quota.title },
  ];

  questions.forEach((question) => {
    const answer = _.find(answers, { questionId: question.id });

    if (answer) {
      fields.push({
        label: question.question,
        answer: answer.answer,
      });
    }
  });

  const params = {
    answers: fields,
    edited: answers.some((answer) => answer.createdAt.getTime() !== answer.updatedAt.getTime()),
    date: moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm'),
    event,
    cancelLink: `${config.baseUrl}${config.prefixUrl}/signup/${signup.id}/${hook.data!.editToken}`,
  };

  EmailService.sendConfirmationMail(signup.email, params);
};
