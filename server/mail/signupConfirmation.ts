import moment from 'moment';

import config from '../config';
import { Signup } from '../models/signup';
import { generateToken } from '../services/signup/editTokens';
import EmailService from '.';

export default async (signup: Signup) => {
  // TODO: convert to include
  const answers = await signup.getAnswers();
  const quota = await signup.getQuota();
  const event = await quota.getEvent();
  const questions = await event.getQuestions();

  const questionFields = questions
    .map((question) => <const>[
      question,
      answers.find((answer) => answer.questionId === question.id),
    ])
    .filter(([, answer]) => answer)
    .map(([question, answer]) => ({
      label: question.question,
      answer: answer!.answer,
    }));

  const fields = [
    { label: 'Nimi', answer: `${signup.firstName} ${signup.lastName}` },
    { label: 'Sähköposti', answer: `${signup.email}` },
    { label: 'Kiintiö', answer: quota.title },
    ...questionFields,
  ];

  const edited = answers.some((answer) => answer.createdAt.getTime() !== answer.updatedAt.getTime());
  const date = event.date && moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm');

  const editToken = generateToken(signup);
  const cancelLink = `${config.mailUrlBase}${config.pathPrefix}/signup/${signup.id}/${editToken}`;

  const params = {
    answers: fields,
    edited,
    date,
    event,
    cancelLink,
  };

  EmailService.sendConfirmationMail(signup.email!, params);
};
