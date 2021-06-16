import React from 'react';

import { Checkbox, Flex, Input, Label, Select } from '@theme-ui/components';
import _ from 'lodash';

import { updateEventField } from '../../../modules/editor/actions';
import { Event } from '../../../modules/types';
import { useTypedDispatch } from '../../../store/reducers';
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
};

const Questions = (props: Props) => {
  const { event } = props;

  const dispatch = useTypedDispatch();

  function updateQuestion(itemId, field, value) {
    const { questions } = event;
    const newQuestions = _.map(questions, question => {
      if (question.id === itemId) {
        if (field == 'type') {
          // Don't overwrite question options
          if (value === 'select' || value === 'checkbox') {
            // Only display set options if the field value is 'select' or 'checkbox'
            if (!question.options) {
              // Don't reset options if the field is
              // switched between single and multiple choice
              question.options = [''];
            }
          } else {
            // Reset options field if the field is changed to e.g. text or number
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

    dispatch(updateEventField('questions', newQuestions));
  }

  function removeQuestion(itemId: string) {
    const newQuestions = _.filter(event.questions, question => {
      if (question.id === itemId) {
        return false;
      }
      return true;
    });

    dispatch(updateEventField('questions', newQuestions));
  }

  function updateOrder(args) {
    const { newIndex, oldIndex } = args;

    const newQuestions = event.questions.map((question, index) => {
      if (oldIndex < newIndex) {
        // Moved the question down
        if (index > oldIndex && index <= newIndex) {
          question.order -= 1;
        }
      }
      if (oldIndex > newIndex) {
        // Moved the question up
        if (index >= newIndex && index < oldIndex) {
          question.order += 1;
        }
      }
      if (index === oldIndex) {
        question.order = newIndex;
      }
      return question;
    });

    const elementToMove = newQuestions[args.oldIndex];
    newQuestions.splice(args.oldIndex, 1);
    newQuestions.splice(args.newIndex, 0, elementToMove);

    dispatch(updateEventField('questions', newQuestions));
  }

  function updateQuestionOption(itemId, index, value) {
    const newQuestions = _.map(event.questions, question => {
      if (question.id === itemId) {
        question.options[index] = value;
      }

      return question;
    });

    dispatch(updateEventField('questions', newQuestions));
  }

  function addOption(questionId) {
    const newQuestions = _.map(event.questions, question => {
      if (question.id === questionId) {
        question.options.push('');
      }
      return question;
    });

    dispatch(updateEventField('questions', newQuestions));
  }

  const orderedQuestions = _.orderBy(event.questions, 'order', 'asc');

  const questions = _.map(orderedQuestions, question => (
    <div className="panel-body" key={question.id}>
      <div className="col-xs-12 col-sm-10">
        <Input
          name={`question-${question.id}-question`}
          value={question.question}
          label="Kysymys"
          type="text"
          required
          onChange={e =>
            updateQuestion(question.id, 'question', e.target.value)
          }
        />
        <Select
          name={`question-${question.id}-type`}
          value={question.type}
          label="Tyyppi"
          options={QUESTION_TYPES}
          onChange={e => updateQuestion(question.id, 'type', e.target.value)}
          required
        >
          {QUESTION_TYPES.map(type => {
            return (
              <option key={type.label} value={type.value}>
                {type.label}
              </option>
            );
          })}
        </Select>
        <div>
          {_.map(question.options, (option, index) => (
            <Input
              key={`question-${index}`}
              name={`question-${question.id}-option-${index}`}
              value={option}
              label="Vastausvaihtoehto"
              type="text"
              required
              onChange={e =>
                updateQuestionOption(question.id, index, e.target.value)
              }
            />
          ))}
          {question.options && (
            <a onClick={() => addOption(question.id)}>
              Lisää vastausvaihtoehto
            </a>
          )}
        </div>
      </div>
      <div className="col-xs-12 col-sm-2">
        <Flex pt={2}>
          <Label sx={{ fontWeight: 'body' }} mb={0}>
            <Checkbox
              name={`question-${question.id}-required`}
              defaultChecked={question.required}
              onChange={e =>
                updateQuestion(question.id, 'required', e.target.checked)
              }
            />
            Pakollinen
          </Label>
        </Flex>
        <Flex pb={2}>
          <Label sx={{ fontWeight: 'body' }} mb={0}>
            <Checkbox
              name={`question-${question.id}-public`}
              defaultChecked={question.public}
              onChange={e =>
                updateQuestion(question.id, 'public', e.target.checked)
              }
            />
            Julkinen
          </Label>
        </Flex>
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

export default Questions;
