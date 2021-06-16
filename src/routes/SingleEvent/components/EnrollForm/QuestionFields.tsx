import React from 'react';

import {
  Checkbox,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
} from '@theme-ui/components';
import _ from 'lodash';

import { Question } from '../../../../modules/types';

import './EnrollForm.scss';

type Props = {
  questions: Question[];
  register: any;
};

const QuestionFields = ({ questions, register }: Props) => (
  <>
    {_.map(questions, (question) => {
      const help = question.public && (
        <span>Tämän kentän vastaukset ovat julkisia.</span>
      );

      switch (question.type) {
        case 'text':
          return (
            <li key={question.id}>
              <Label hitmlFor={question.id}>{question.question}</Label>
              <div>
                <Input
                  name={question.id}
                  label={question.question}
                  type="text"
                  ref={register({ required: question.required })}
                />
                {help}
              </div>
            </li>
          );
        case 'number':
          return (
            <li key={question.id}>
              <Label htmlFor={question.id}>{question.question}</Label>
              <div>
                <Input
                  name={question.id}
                  label={question.question}
                  type="number"
                  ref={register({ required: question.required })}
                />
                {help}
              </div>
            </li>
          );
        case 'checkbox':
          return (
            <li key={question.id}>
              <p>{question.question}</p>
              <ul className="flex-inner">
                {question.options.map((option) => (
                  <li>
                    <Label mr={3}>
                      <Checkbox
                        name={question.id}
                        ref={register({ required: question.required })}
                      />
                      {option}
                    </Label>
                  </li>
                ))}
                {help}
              </ul>
            </li>
          );
        case 'textarea':
          return (
            <li key={question.id}>
              <Label htmlFor={question.id}>{question.question}</Label>
              <div>
                <Textarea
                  className="open-question form-control"
                  rows={3}
                  cols={40}
                  name={question.id}
                  label={question.question}
                  ref={register({ required: question.required })}
                />
                {help}
              </div>
            </li>
          );
        case 'select':
          if (question?.options?.length > 3) {
            // render select if more than 3 options
            const optionsArray = [{ label: 'Valitse...', value: null }];

            question.options.map((option) => optionsArray.push({ label: option, value: null }));

            return (
              <li key={question.id}>
                <Label htmlFor={question.id}>{question.question}</Label>
                <div>
                  <Select
                    defaultValue="Valitse..."
                    name={question.id}
                    ref={register({ required: question.required })}
                    mb={2}
                  >
                    {question.options.map((option) => (
                      <option key={question.id} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  {help}
                </div>
              </li>
            );
          } if (question?.options) {
            return (
              <li key={question.id}>
                <p>{question.question}</p>
                <ul className="flex-inner">
                  {question.options.map((option) => (
                    <li>
                      <Label htmlFor={question.id} mr={3}>
                        <Radio
                          name={question.id}
                          required={question.required}
                        />
                        {option}
                      </Label>
                    </li>
                  ))}
                  {help}
                </ul>
              </li>
            );
          }
        default:
          return null;
      }
    })}
  </>
);

export default QuestionFields;
