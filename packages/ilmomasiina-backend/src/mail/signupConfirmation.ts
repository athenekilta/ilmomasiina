import moment from 'moment-timezone';

import config from '../config';
import { Signup } from '../models/signup';
import { generateToken } from '../routes/signup/editTokens';
import EmailService from '.';

export default async (signup: Signup) => {
  if (signup.email === null) return;

  // TODO: convert to include
  const answers = await signup.getAnswers();
  const quota = await signup.getQuota();
  const event = await quota.getEvent();
  const questions = await event.getQuestions();

  // Show name only if filled
  const fullName = `${signup.firstName} ${signup.lastName}`.trim();
  const nameField = fullName ? [{ label: 'Nimi', answer: fullName }] : [];

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
    ...nameField,
    { label: 'Sähköposti', answer: String(signup.email) },
    { label: 'Kiintiö', answer: quota.title },
    ...questionFields,
  ];

  const edited = answers.some((answer) => answer.createdAt.getTime() !== answer.updatedAt.getTime());
  const date = event.date && moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm');

  const editToken = generateToken(signup.id);
  const cancelLink = config.editSignupUrl
    .replace(/\{id\}/g, signup.id)
    .replace(/\{editToken\}/g, editToken);

  const params = {
    answers: fields,
    edited,
    date,
    event,
    cancelLink,
  };

  EmailService.sendConfirmationMail(signup.email, params);
};
