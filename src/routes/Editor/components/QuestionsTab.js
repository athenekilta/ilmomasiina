import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, Checkbox, Select } from 'formsy-react-components';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span className="handler" />); // This can be any component you want

const SortableItem = SortableElement(({ value }) => (
  <div className="panel panel-default">
    <DragHandle />
    {value}
  </div>
));

const SortableItems = SortableContainer(({ collection, items }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem collection={collection} key={index} index={index} value={value} />
    ))}
  </div>
));

const QUESTION_TYPES = [
  { value: 'text', label: 'Teksti (lyhyt) / Text (short)' },
  { value: 'textarea', label: 'Teksti (pitkä) / Text (longer)' },
  { value: 'number', label: 'Numero / Number' },
  { value: 'select', label: 'Monivalinta (voi valita yhden) / Select one' },
  { value: 'checkbox', label: 'Monivalinta (voi valita monta) / Select multiple' },
];

class QuestionsTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.addQuestion = this.addQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
  }

  addQuestion() {
    const questions = this.props.event.questions ? this.props.event.questions : [];

    const newQuestions = _.concat(questions, {
      id: (_.max(questions.map(n => n.id)) || 0) + 1,
      existsInDb: false,
      required: false,
      public: false,
      question: '',
      type: 'text',
    });

    this.props.onDataChange('questions', newQuestions);
  }

  updateOrder(args) {
    let newQuestions = this.props.event.questions; //eslint-disable-line

    const elementToMove = newQuestions[args.oldIndex];
    newQuestions.splice(args.oldIndex, 1);
    newQuestions.splice(args.newIndex, 0, elementToMove);

    this.props.onDataChange('questions', newQuestions);
  }

  updateQuestion(itemId, field, value) {
    const questions = this.props.event.questions;
    const newQuestions = _.map(questions, (question) => {
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
          [field]: value,
        };
      }

      return question;
    });

    this.props.onDataChange('questions', newQuestions);
  }

  updateQuestionOption(itemId, index, value) {
    const questions = this.props.event.questions;
    const newQuestions = _.map(questions, (question) => {
      if (question.id === itemId) {
        question.options[index] = value;
      }

      return question;
    });

    this.props.onDataChange('questions', newQuestions);
  }

  addOption(questionId) {
    const questions = this.props.event.questions;
    const newQuestions = _.map(questions, (question) => {
      if (question.id === questionId) {
        question.options.push('');
      }
      return question;
    });

    this.props.onDataChange('questions', newQuestions);
  }
  removeQuestion(itemId) {
    const questions = this.props.event.questions;
    const newQuestions = _.filter(questions, (question) => {
      if (question.id === itemId) {
        return false;
      }

      return true;
    });

    this.props.onDataChange('questions', newQuestions);
  }
  renderQuestionOptions(question) {
    if (!question.options) { return null; }
    return (
      <div>
        {_.map(question.options, (option, index) => (
          <Input
            name={`question-${question.id}-question-option-${index}`}
            value={option}
            label={'Vastausvaihtoehto / Option '}
            type="text"
            required
            onChange={(field, value) => this.updateQuestionOption(question.id, index, value)}
          />
        ))}
        <a onClick={() => this.addOption(question.id)}>Lisää vastausvaihtoehto</a>
      </div>);
  }
  renderQuestions() {
    const q = _.map(this.props.event.questions, item => (
      <div className="panel-body">
        <div className="col-xs-12 col-sm-10">
          <Input
            name={`question-${item.id}-question`}
            value={item.question}
            label="Kysymys / Question"
            type="text"
            required
            onChange={(field, value) => this.updateQuestion(item.id, 'question', value)}
          />
          <Select
            name={`question-${item.id}-type`}
            value={item.type}
            label="Tyyppi / Type"
            options={QUESTION_TYPES}
            onChange={(field, value) => this.updateQuestion(item.id, 'type', value)}
            required
          />
          {this.renderQuestionOptions(item)}
        </div>
        <div className="col-xs-12 col-sm-2">
          <Checkbox
            name={`question-${item.id}-required`}
            value={item.required}
            label="Pakollinen / Required"
            onChange={(field, value) => this.updateQuestion(item.id, 'required', value)}
          />
          <Checkbox
            name={`question-${item.id}-public`}
            value={item.public}
            label="Julkinen / Public"
            onChange={(field, value) => this.updateQuestion(item.id, 'public', value)}
          />
          <a onClick={() => this.removeQuestion(item.id)}>Poista</a>
        </div>
      </div>
    ));

    return <SortableItems collection="questions" items={q} onSortEnd={this.updateOrder} useDragHandle />;
  }

  render() {
    return (
      <div>
        <p>Kaikilta osallistujilta kerätään aina nimi ja sähköpostiosoite.</p>
        <p>Participants are always asked name and email.</p>
        <div>
          {this.renderQuestions()}
          <a className="btn btn-primary pull-right" onClick={this.addQuestion}>
            Lisää kysymys / Add a question
          </a>
        </div>
      </div>
    );
  }
}

export default QuestionsTab;
