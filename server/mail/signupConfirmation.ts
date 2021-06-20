import _ from 'lodash';
import moment from 'moment';
import EmailService from '.';
import config from '../config';
import { Signup } from '../models/signup';
import { generateToken } from '../services/signup/editTokens';

export default async (signup: Signup) => {
  // TODO: convert to include
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

  const editToken = generateToken(signup);

  const params = {
    answers: fields,
    edited: answers.some((answer) => answer.createdAt.getTime() !== answer.updatedAt.getTime()),
    date: moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm'),
    event,
    cancelLink: `${config.baseUrl}${config.prefixUrl}/signup/${signup.id}/${editToken}`,
  };

  EmailService.sendConfirmationMail(signup.email!, params);
};
