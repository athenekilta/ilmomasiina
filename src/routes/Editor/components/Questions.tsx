import React from 'react';

import {
  Checkbox, Flex, Input, Label, Select,
} from '@theme-ui/components';
import { useField } from 'formik';
import _ from 'lodash';
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
      <div className="panel-body" key={question.id}>
        <div className="col-xs-12 col-sm-10">
          <Label htmlFor={`question-${question.id}-question`}>
            Kysymys
          </Label>
          <Input
            name={`question-${question.id}-question`}
            value={question.question}
            type="text"
            required
            onChange={(e) => updateField('question', e.target.value)}
          />
          <Label htmlFor={`question-${question.id}-type`}>
            Tyyppi
          </Label>
          <Select
            name={`question-${question.id}-type`}
            value={question.type}
            onChange={(e) => updateField('type', e.target.value as EditorQuestion['type'])}
            required
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type.label} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          {(question.type === 'select' || question.type === 'checkbox') && (
            <div>
              {question.options.map((option, optIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="form-row" key={optIndex}>
                  <Label htmlFor={`question-${question.id}-options-${optIndex}`}>
                    Tyyppi
                  </Label>
                  <Input
                    name={`question-${question.id}-option-${optIndex}`}
                    value={option}
                    type="text"
                    required
                    onChange={(e) => updateOption(optIndex, e.target.value)}
                  />
                </div>
              ))}
              <button type="button" className="btn btn-link" onClick={() => addOption()}>
                Lisää vastausvaihtoehto
              </button>
            </div>
          )}
        </div>
        <div className="col-xs-12 col-sm-2">
          <Flex pt={2}>
            <Label sx={{ fontWeight: 'body' }} mb={0}>
              <Checkbox
                name={`question-${question.id}-required`}
                defaultChecked={question.required}
                onChange={(e) => updateField('required', e.target.checked)}
              />
              Pakollinen
            </Label>
          </Flex>
          <Flex pb={2}>
            <Label sx={{ fontWeight: 'body' }} mb={0}>
              <Checkbox
                name={`question-${question.id}-public`}
                defaultChecked={question.public}
                onChange={(e) => updateField('public', e.target.checked)}
              />
              Julkinen
            </Label>
          </Flex>
          <button type="button" className="btn btn-link" onClick={() => removeQuestion()}>
            Poista kysymys
          </button>
        </div>
      </div>
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
