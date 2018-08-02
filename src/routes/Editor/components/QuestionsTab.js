import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, Checkbox, Select } from 'formsy-react-components';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import './Editor.scss';

const DragHandle = SortableHandle(() => <span className="handler" />); // This can be any component you want

const SortableItem = SortableElement(({ value }) =>
  <div className="panel panel-default">
    <DragHandle />
    {value}
  </div>);

const SortableItems = SortableContainer(({ collection, items }) =>
  <div>
    {items.map((value, index) => <SortableItem collection={collection} key={index} index={index} value={value} />)}
  </div>,
);

const QUESTION_TYPES = [
  { value: 'text', label: 'Teksti (lyhyt)' },
  { value: 'textarea', label: 'Teksti (pitkä)' },
  { value: 'number', label: 'Numero' },
  { value: 'select', label: 'Monivalinta (voi valita yhden)' },
  { value: 'checkbox', label: 'Monivalinta (voi valita monta)' },
];


class QuestionsTab extends React.Component {

  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
  }

  updateState(updates) {
    this.setState(updates, () => {
      if (typeof this.props.onDataChange === 'function') {
        this.props.onDataChange(this.state.data);
      }
    });
  }

  handleChange(field, value) {
    this.updateState({
      data: { ...this.state.data, [field]: value },
    });
  }

  addQuestion() {
    const questions = this.state.data.questions ? this.state.data.questions : [];

    this.updateState({
      data: {
        ...this.state.data,
        questions: _.concat(questions, {
          id: (_.max(questions.map(n => n.id)) || 0) + 1,
          existsInDb: false,
          title: '',
          type: 'text',
        }),
      },
    });
  }

  updateOrder(args) {
    let newQuestions = this.state.data.questions;

    const elementToMove = newQuestions[args.oldIndex];
    newQuestions.splice(args.oldIndex, 1);
    newQuestions.splice(args.newIndex, 0, elementToMove);

    // Update quota id's
    newQuestions = _.map(newQuestions, (question, index) => {
      question.id = index + 1;
      return question;
    });

    this.updateState({
      data: {
        ...this.state.data,
        questions: newQuestions,
      },
    });
  }

  updateQuestion(itemId, field, value) {
    this.updateState({
      data: {
        ...this.state.data,
        questions: _.map(this.state.data.questions, (question) => {
          if (question.id === itemId) {
            return {
              ...question,
              [field]: value,
            };
          }

          return question;
        }),
      },
    });
  }

  removeQuestion(itemId) {
    this.updateState({
      data: {
        ...this.state.data,
        questions: _.filter(this.state.data.questions, (question) => {
          if (question.id === itemId) {
            return false;
          }

          return true;
        }),
      },
    });
  }

  renderQuestions() {
    const q = _.map(this.state.data.questions, (item) => {
      return (
        <div className="panel-body">
          <div className="col-xs-12 col-sm-10">
            <Input
              name={`question-${item.id}-title`}
              value={item.title}
              label="Kysymys"
              type="text"
              required
              onChange={(field, value) => this.updateQuestion(item.id, 'title', value)}
            />
            <Select
              name={`question-${item.id}-type`}
              value={item.type}
              label="Tyyppi"
              options={QUESTION_TYPES}
              onChange={(field, value) => this.updateQuestion(item.id, 'type', value)}
              required
            />
          </div>
          <div className="col-xs-12 col-sm-2">
            <Checkbox
              name={`question-${item.id}-required`}
              value={false}
              label="Pakollinen"
              onChange={(field, value) => this.updateQuestion(item.id, 'required', value)}
            />
            <Checkbox
              name={`question-${item.id}-public`}
              value={false}
              label="Julkinen"
              onChange={(field, value) => this.updateQuestion(item.id, 'public', value)}
            />
            <a onClick={() => this.removeQuestion(item.id)}>Poista</a>
          </div>
        </div>
      );
    });

    return <SortableItems collection="questions" items={q} onSortEnd={this.updateOrder} useDragHandle />;
  }

  render() {
    return (
      <div>
        <p>Kaikilta osallistujilta kerätään aina nimi ja sähköpostiosoite.</p>
        <div>
          {this.renderQuestions()}
          <a className="btn btn-primary pull-right" onClick={this.addQuestion}>Lisää kysymys</a>
        </div>
      </div>
    );
  }
}

export default QuestionsTab;
