import React from 'react';

import _ from 'lodash';
import moment from 'moment-timezone';

import { Answer, Question, Quota } from '../../../../modules/types';

type Props = {
  answers: Answer[];
  createdAt: string;
  firstName: string;
  index: number;
  lastName: string;
  questions: Question[];
  quota: Quota;
};

const TableRow = (props: Props) => {
  const {
    answers,
    createdAt,
    firstName,
    index,
    lastName,
    questions,
    quota
  } = props;

  const getAnswer = (answers: Answer[], questionId: string, quota: Quota) => {
    if (questionId === 'quota') {
      return quota;
    }
    const answer = _.find(answers, { questionId });
    return answer == null ? '' : answer.answer;
  };

  return (
    <tr className={firstName == null ? 'text-muted' : ''}>
      <td>{index}.</td>
      <td>
        {firstName || 'Vahvistamatta'} {lastName || ''}
      </td>
      {questions.map((q, i) => (
        <td key={i}>{getAnswer(answers, q.id, quota) || ''}</td>
      ))}
      <td>
        {moment.tz(createdAt, 'Europe/Helsinki').format('DD.MM.YYYY HH:mm:ss')}
        <span className="hover">
          {moment.tz(createdAt, 'Europe/Helsinki').format('.SSS')}
        </span>
      </td>
    </tr>
  );
};

export default TableRow;
