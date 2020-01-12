import React from 'react';

import { Checkbox, Input, Select } from 'formsy-react-components';
import _ from 'lodash';

import { Event } from '../../../modules/types';
import { SortableItems } from './Sortable';

const QUESTION_TYPES = [
  { value: 'text', label: 'Teksti (lyhyt)' },
  { value: 'textarea', label: 'Teksti (pitkä)' },
  { value: 'number', label: 'Numero' },
  { value: 'select', label: 'Monivalinta (voi valita yhden)' },
  { value: 'checkbox', label: 'Monivalinta (voi valita monta)' }
];

type Props = {
  event: Event;
  onDataChange: (field: string, value: any) => void;
};

const Quotas = (props: Props) => {
  const { event, onDataChange } = props;

  function updateQuestion(itemId, field, value) {
    const { questions } = event;
    const newQuestions = _.map(questions, question => {
      if (question.id === itemId) {
        if (value === 'select' || value === 'checkbox') {
          if (!question.options) {
            question.options = [''];
          } else {
            question.options = null;
          }
        }

        return {
          ...question,
          [field]: value
        };
      }

      return question;
    });

    onDataChange('questions', newQuestions);
  }

  function removeQuestion(itemId: string) {
    const newQuestions = _.filter(event.questions, question => {
      if (question.id === itemId) {
        return false;
      }
      return true;
    });

    onDataChange('questions', newQuestions);
  }

  function updateOrder(args) {
    const newQuestions = event.questions;

    const elementToMove = newQuestions[args.oldIndex];
    newQuestions.splice(args.oldIndex, 1);
    newQuestions.splice(args.newIndex, 0, elementToMove);

    onDataChange('questions', newQuestions);
  }

  function updateQuestionOption(itemId, index, value) {
    const newQuestions = _.map(event.questions, question => {
      if (question.id === itemId) {
        question.options[index] = value;
      }

      return question;
    });

    onDataChange('questions', newQuestions);
  }

  function addOption(questionId) {
    const newQuestions = _.map(event.questions, question => {
      if (question.id === questionId) {
        question.options.push('');
      }
      return question;
    });

    onDataChange('questions', newQuestions);
  }

  const questions = _.map(event.questions, question => (
    <div className="panel-body" key={question.id}>
      <div className="col-xs-12 col-sm-10">
        <Input
          name={`question-${question.id}-question`}
          value={question.question}
          label="Kysymys"
          type="text"
          required
          onChange={(field, value) =>
            updateQuestion(question.id, 'question', value)
          }
        />
        <Select
          name={`question-${question.id}-type`}
          value={question.type}
          label="Tyyppi"
          options={QUESTION_TYPES}
          onChange={(field, value) =>
            updateQuestion(question.id, 'type', value)
          }
          required
        />
        <div>
          {_.map(question.options, (option, index) => (
            <Input
              key={`question-${index}`}
              name={`question-${question.id}-question-option-${index}`}
              value={option}
              label="Vastausvaihtoehto "
              type="text"
              required
              onChange={(field, value) =>
                updateQuestionOption(question.id, index, value)
              }
            />
          ))}
          <a onClick={() => addOption(question.id)}>Lisää vastausvaihtoehto</a>
        </div>
      </div>
      <div className="col-xs-12 col-sm-2">
        <Checkbox
          name={`question-${question.id}-required`}
          value={question.required}
          label="Pakollinen"
          onChange={(field, value) =>
            updateQuestion(question.id, 'required', value)
          }
        />
        <Checkbox
          name={`question-${question.id}-public`}
          value={question.public}
          label="Julkinen"
          onChange={(field, value) =>
            updateQuestion(question.id, 'public', value)
          }
        />
        <a onClick={() => removeQuestion(question.id)}>Poista</a>
      </div>
    </div>
  ));

  return (
    <SortableItems
      collection="questions"
      items={questions}
      onSortEnd={updateOrder}
      useDragHandle
    />
  );
};

export default Quotas;
