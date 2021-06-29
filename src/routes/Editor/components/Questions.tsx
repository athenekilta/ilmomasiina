import React from 'react';

import { useField } from 'formik';
import _ from 'lodash';
import {
  Button, Card, Col, Form,
} from 'react-bootstrap';
import { SortEnd } from 'react-sortable-hoc';

import { EditorQuestion } from '../../../modules/editor/types';
import Sortable from './Sortable';

const QUESTION_TYPES: { value: EditorQuestion['type'], label: string }[] = [
  { value: 'text', label: 'Teksti (lyhyt)' },
  { value: 'textarea', label: 'Teksti (pitkä)' },
  { value: 'number', label: 'Numero' },
  { value: 'select', label: 'Monivalinta (voi valita yhden)' },
  { value: 'checkbox', label: 'Monivalinta (voi valita monta)' },
];

const Questions = () => {
  const [{ value: questions }, , { setValue }] = useField<EditorQuestion[]>('questions');

  function addQuestion() {
    setValue([
      ...questions,
      {
        required: false,
        public: false,
        question: '',
        type: 'text',
        options: [''],
      },
    ]);
  }

  function updateOrder({ newIndex, oldIndex }: SortEnd) {
    const newQuestions = questions.slice();
    const [elementToMove] = newQuestions.splice(oldIndex, 1);
    newQuestions.splice(newIndex, 0, elementToMove);
    setValue(newQuestions);
  }

  const questionItems = questions.map((question) => {
    const thisQuestion = question.id;

    function updateField<F extends keyof EditorQuestion>(field: F, value: EditorQuestion[F]) {
      setValue(questions.map((item) => {
        if (item.id === thisQuestion) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      }));
    }

    function removeQuestion() {
      setValue(_.reject(questions, { id: thisQuestion }));
    }

    function updateOption(index: number, value: string) {
      setValue(questions.map((item) => {
        if (item.id === thisQuestion) {
          return {
            ...item,
            options: item.options?.map((prev, i) => (i === index ? value : prev)) ?? null,
          };
        }
        return question;
      }));
    }

    function addOption() {
      setValue(questions.map((item) => {
        if (item.id === thisQuestion) {
          return {
            ...item,
            options: [...item.options, ''],
          };
        }
        return item;
      }));
    }

    return (
      <Card.Body key={question.id}>
        <Col xs="12" sm="10">
          <Form.Label htmlFor={`question-${question.id}-question`}>
            Kysymys
          </Form.Label>
          <Form.Control
            id={`question-${question.id}-question`}
            type="text"
            required
            value={question.question}
            onChange={(e) => updateField('question', e.target.value)}
          />
          <Form.Label htmlFor={`question-${question.id}-type`}>
            Tyyppi
          </Form.Label>
          <Form.Control
            as="select"
            id={`question-${question.id}-type`}
            value={question.type}
            onChange={(e) => updateField('type', e.target.value as EditorQuestion['type'])}
            required
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type.label} value={type.value}>
                {type.label}
              </option>
            ))}
          </Form.Control>
          {(question.type === 'select' || question.type === 'checkbox') && (
            <div>
              {question.options.map((option, optIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="form-row" key={optIndex}>
                  <Form.Label htmlFor={`question-${question.id}-options-${optIndex}`}>
                    Vastausvaihtoehto
                  </Form.Label>
                  <Form.Control
                    name={`question-${question.id}-option-${optIndex}`}
                    type="text"
                    required
                    value={option}
                    onChange={(e) => updateOption(optIndex, e.target.value)}
                  />
                </div>
              ))}
              <Button variant="link" type="button" onClick={addOption}>
                Lisää vastausvaihtoehto
              </Button>
            </div>
          )}
        </Col>
        <Col xs="12" sm="2">
          <Form.Check
            id={`question-${question.id}-required`}
            label="Pakollinen"
            checked={question.required}
            onChange={(e) => updateField('required', e.target.checked)}
          />
          <Form.Check
            id={`question-${question.id}-public`}
            label="Julkinen"
            checked={question.public}
            onChange={(e) => updateField('public', e.target.checked)}
          />
          <Button variant="link" type="button" onClick={removeQuestion}>
            Poista kysymys
          </Button>
        </Col>
      </Card.Body>
    );
  });

  return (
    <>
      <Sortable
        collection="questions"
        items={questionItems}
        onSortEnd={updateOrder}
        useDragHandle
      />
      <button type="button" className="btn btn-primary pull-right" onClick={addQuestion}>
        Lisää kysymys
      </button>
    </>
  );
};

export default Questions;
