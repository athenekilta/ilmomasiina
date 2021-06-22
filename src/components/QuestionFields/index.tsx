import React, { ReactNode } from 'react';

import {
  Checkbox, Input, Label, Radio, Select, Textarea,
} from '@theme-ui/components';
import { useField } from 'formik';
import _ from 'lodash';

import { EventGetQuestionItem } from '../../api/events';
import { SignupUpdateBodyAnswer } from '../../api/signups';

type Props = {
  name: string;
  questions: EventGetQuestionItem[];
};

const QuestionFields = ({ name, questions }: Props) => {
  // TODO: add formik-based validation
  const [{ value }, , { setValue }] = useField<SignupUpdateBodyAnswer[]>(name);
  return (
    <>
      {questions.map((question) => {
        const currentAnswer = _.find(value, { questionId: question.id })?.answer || '';

        function updateAnswer(answer: string) {
          setValue(_.reject(value, { questionId: question.id }).concat({
            questionId: question.id,
            answer,
          }));
        }

        function toggleChecked(option: string, checked: boolean) {
          const currentAnswers = currentAnswer.split(';');
          const newAnswers = checked ? _.concat(currentAnswers, option) : _.without(currentAnswers, option);
          updateAnswer(newAnswers.join(';'));
        }

        const help = question.public && (
          <div className="form-text text-muted">Tämän kentän vastaukset ovat julkisia.</div>
        );

        let input: ReactNode;
        switch (question.type) {
          case 'text':
            input = (
              <Input
                name={`question-${question.id}`}
                id={`question-${question.id}`}
                type="text"
                value={currentAnswer}
                onChange={(e) => updateAnswer(e.target.value)}
              />
            );
            break;
          case 'number':
            input = (
              <Input
                id={`question-${question.id}`}
                type="number"
                required={question.required}
                value={currentAnswer}
                onChange={(e) => updateAnswer(e.target.value)}
              />
            );
            break;
          case 'checkbox': {
            const currentAnswers = currentAnswer.split(';');
            input = (
              <>
                {question.options?.map((option, optIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={optIndex}>
                    <Label>
                      <Checkbox
                        required={question.required && !currentAnswers.some((answer) => answer !== option)}
                        checked={currentAnswers.includes(option)}
                        onChange={(e) => toggleChecked(option, e.target.checked)}
                      />
                      {option}
                    </Label>
                  </div>
                ))}
              </>
            );
            break;
          }
          case 'textarea':
            input = (
              <Textarea
                className="open-question form-control"
                rows={3}
                cols={40}
                name={`question-${question.id}`}
                required={question.required}
                value={currentAnswer}
                onChange={(e) => updateAnswer(e.target.value)}
              />
            );
            break;
          case 'select':
            if (question.options && question.options.length > 3) {
              input = (
                <Select
                  name={`question-${question.id}`}
                  required={question.required}
                  key={question.id}
                  value={currentAnswer}
                  onChange={(e) => updateAnswer(e.target.value)}
                >
                  <option disabled={question.required}>
                    Valitse&hellip;
                  </option>
                  {question.options?.map((option) => (
                    <option key={question.id} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              );
            } else {
              input = question.options?.map((option, optIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={optIndex}>
                  <Label>
                    <Radio
                      required={question.required}
                      checked={currentAnswer === option}
                      onChange={(e) => updateAnswer(e.target.value)}
                    />
                    {option}
                  </Label>
                </div>
              ));
            }
            break;
          default:
            return null;
        }

        return (
          <div className="form-group" key={question.id}>
            <Label htmlFor={`question-${question.id}`}>{question.question}</Label>
            {input}
            {help}
          </div>
        );
      })}
    </>
  );
};

export default QuestionFields;
