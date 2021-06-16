import React from 'react';

import {
  Checkbox, Input, Label, Select, Textarea,
} from '@theme-ui/components';
import _ from 'lodash';

import { Question } from '../../../../modules/types';

type Props = {
  questions: Question[];
  register: any;
};

const QuestionFields = ({ questions, register }: Props) => (
  <>
    {_.map(questions, (question) => {
      const help = question.public && 'Tämän kentän vastaukset ovat julkisia.';

      switch (question.type) {
        case 'text':
          return (
            //   <Label htmlFor={question.question}>{question.question}</Label>
            //     <Input
            //       name={question.question}
            //       type="text"
            //       value={question.answer}
            //       ref={register({ required: true })}
            //     />
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
            <>
              {question.options.split(';').map((option) => (
                <div key={`${question.id}-${option}`}>
                  <Label htmlFor={question.id}>{option}</Label>
                  <Checkbox required={question.required} />
                </div>
              ))}
            </>
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
            .map((option) => optionsArray.push({ label: option }));

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
