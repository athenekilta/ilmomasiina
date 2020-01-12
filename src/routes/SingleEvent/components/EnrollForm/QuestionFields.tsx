import React from 'react';

import {
  CheckboxGroup,
  Input,
  RadioGroup,
  Select,
  Textarea
} from 'formsy-react-components';
import _ from 'lodash';

import { Question } from '../../../../modules/types';

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
            />
          );
        case 'checkbox':
          return (
            <CheckboxGroup
              value={[]}
              type="inline"
              name={String(question.id)}
              label={question.question}
              required={question.required}
              options={question.options.map(option => ({
                label: option,
                value: option
              }))}
              key={question.id}
              help={help}
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
            />
          );
        case 'select':
          if (question?.options?.length > 3) {
            // render select if more than 3 options
            const optionsArray = [{ label: 'Valitse...', value: null }];

            question.options.map(option =>
              optionsArray.push({ label: option, value: null })
            );

            return (
              <Select
                validations="isExisty"
                name={String(question.id)}
                label={question.question}
                options={optionsArray}
                required={question.required}
                key={question.id}
                help={help}
              />
            );
          } else if (question?.options) {
            return (
              <RadioGroup
                name={String(question.id)}
                type="inline"
                label={question.question}
                options={question?.options.map(option => ({
                  label: option,
                  value: option
                }))}
                required={question.required}
                key={question.id}
                help={help}
              />
            );
          }
        default:
          return null;
      }
    })}
  </>
);

export default QuestionFields;
