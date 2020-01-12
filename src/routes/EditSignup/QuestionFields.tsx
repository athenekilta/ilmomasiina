import React from 'react';

import {
  CheckboxGroup,
  Input,
  Select,
  Textarea
} from 'formsy-react-components';
import _ from 'lodash';

import { Question } from '../../modules/types';

type Props = {
  questions: Question[];
};

const QuestionFields = ({ questions }: Props) => (
  <>
    {_.map(questions, question => {
      const help = question.public && 'Tämän kentän vastaukset ovat julkisia.';

      switch (question.type) {
        case 'text':
          return (
            <Input
              name={String(question.id)}
              label={question.question}
              type="text"
              required={question.required}
              key={question.id}
              help={help}
              value={question.answer}
            />
          );
        case 'number':
          return (
            <Input
              name={String(question.id)}
              label={question.question}
              type="number"
              required={question.required}
              key={question.id}
              help={help}
              value={question.answer}
            />
          );
        case 'checkbox':
          return (
            <CheckboxGroup
              name={String(question.id)}
              label={question.question}
              required={question.required}
              options={question.options
                .split(';')
                .map(option => ({ label: option, value: option }))}
              key={question.id}
              help={help}
              value={question.answer.split(';')}
            />
          );
        case 'textarea':
          return (
            <Textarea
              className="open-question form-control"
              rows={3}
              cols={40}
              name={String(question.id)}
              label={question.question}
              required={question.required}
              key={question.id}
              help={help}
              value={question.answer}
            />
          );
        case 'select':
          const optionsArray = [{ label: 'Valitse...', value: null }];

          question.options
            .split(';')
            .map(option => optionsArray.push({ label: option }));

          return (
            <Select
              validations="isExisty"
              name={String(question.id)}
              label={question.question}
              options={optionsArray}
              required={question.required}
              key={question.id}
              help={help}
              value={question.answer}
            />
          );
        default:
          return null;
      }
    })}
  </>
);

export default QuestionFields;
