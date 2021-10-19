import React, { ReactNode } from 'react';

import { useField } from 'formik';
import _ from 'lodash';
import { Form } from 'react-bootstrap';

import { Event } from '@tietokilta/ilmomasiina-api/src/services/events';
import { Signup } from '@tietokilta/ilmomasiina-api/src/services/signups';
import FieldRow from '../FieldRow';

type Props = {
  name: string;
  questions: Event.Details.Question[];
};

const QuestionFields = ({ name, questions }: Props) => {
  // TODO: add formik-based validation
  const [{ value }, , { setValue }] = useField<Signup.Update.Body.Answer[]>(name);
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
          const currentAnswers = _.filter(currentAnswer.split(';'));
          const newAnswers = checked ? _.concat(currentAnswers, option) : _.without(currentAnswers, option);
          updateAnswer(newAnswers.join(';'));
        }

        const help = question.public ? 'Tämän kentän vastaukset ovat julkisia.' : null;

        let input: ReactNode;
        let isCheckboxes = false;
        switch (question.type) {
          case 'text':
            input = (
              <Form.Control
                type="text"
                required={question.required}
                value={currentAnswer}
                onChange={(e) => updateAnswer(e.target.value)}
              />
            );
            break;
          case 'number':
            input = (
              <Form.Control
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
                  <Form.Check
                    // eslint-disable-next-line react/no-array-index-key
                    key={optIndex}
                    type="checkbox"
                    id={`question-${question.id}-option-${optIndex}`}
                    value={option}
                    label={option}
                    required={question.required && !currentAnswers.some((answer) => answer !== option)}
                    checked={currentAnswers.includes(option)}
                    onChange={(e) => toggleChecked(option, e.target.checked)}
                  />
                ))}
              </>
            );
            isCheckboxes = true;
            break;
          }
          case 'textarea':
            input = (
              <Form.Control
                as="textarea"
                className="open-question form-control"
                rows={3}
                cols={40}
                required={question.required}
                value={currentAnswer}
                onChange={(e) => updateAnswer(e.target.value)}
              />
            );
            break;
          case 'select':
            if (question.options && question.options.length > 3) {
              input = (
                <Form.Control
                  as="select"
                  required={question.required}
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
                </Form.Control>
              );
            } else {
              input = question.options?.map((option, optIndex) => (
                <Form.Check
                  // eslint-disable-next-line react/no-array-index-key
                  key={optIndex}
                  type="radio"
                  id={`question-${question.id}-option-${optIndex}`}
                  inline
                  value={option}
                  label={option}
                  required={question.required}
                  checked={currentAnswer === option}
                  onChange={(e) => updateAnswer(e.target.value)}
                />
              ));
              isCheckboxes = true;
            }
            break;
          default:
            return null;
        }

        return (
          <FieldRow
            key={question.id}
            name={`question-${question.id}`}
            label={question.question}
            required={question.required}
            help={help}
            checkAlign={isCheckboxes}
          >
            {input}
          </FieldRow>
        );
      })}
    </>
  );
};

export default QuestionFields;
