import React, { ReactNode } from 'react';

import { useField } from 'formik';
import _ from 'lodash';
import { Form, Row } from 'react-bootstrap';

import { Event } from '../../api/events';
import { Signup } from '../../api/signups';

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
          const currentAnswers = currentAnswer.split(';');
          const newAnswers = checked ? _.concat(currentAnswers, option) : _.without(currentAnswers, option);
          updateAnswer(newAnswers.join(';'));
        }

        const help = question.public ? (
          <Form.Text muted>Tämän kentän vastaukset ovat julkisia.</Form.Text>
        ) : null;

        let input: ReactNode;
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
                    value={option}
                    label={option}
                    required={question.required && !currentAnswers.some((answer) => answer !== option)}
                    checked={currentAnswers.includes(option)}
                    onChange={(e) => toggleChecked(option, e.target.checked)}
                  />
                ))}
              </>
            );
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
                  inline
                  value={option}
                  label={option}
                  required={question.required}
                  checked={currentAnswer === option}
                  onChange={(e) => updateAnswer(e.target.value)}
                />
              ));
            }
            break;
          default:
            return null;
        }

        return (
          <Form.Group as={Row} key={question.id} controlId={`question-${question.id}`}>
            <Form.Label>{question.question}</Form.Label>
            {input}
            {help}
          </Form.Group>
        );
      })}
    </>
  );
};

export default QuestionFields;
