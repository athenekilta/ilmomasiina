import React from 'react';
import Formsy from 'formsy-react';
import _ from 'lodash';

import { CheckboxGroup, Select, Input, Textarea } from 'formsy-react-components';
import './EnrollForm.scss';

export class EnrollForm extends React.Component {
  constructor(props) {
    super(props);
    this.parseSubmit = this.parseSubmit.bind(this);
  }

  parseSubmit(data) {
    const answers = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      answers: [],
    };

    if (this.props.questions) {
      answers.answers = this.props.questions
        .map((question) => {
          const questionId = question.id;
          const answer = data[question.id];

          if (answer && answer.length > 0) {
            if (question.type === 'checkbox') {
              return { questionId, answer: answer.join(';') };
            }
            return { questionId, answer };
          }

          return null;
        })
        .filter(x => x);
    }

    return this.props.submitForm(answers);
  }

  renderQuestionFields() {
    return _.map(this.props.questions, (question) => {
      if (question.type === 'text') {
        return (
          <Input
            name={String(question.id)}
            label={question.question}
            type="text"
            required={question.required}
            key={question.id}
          />
        );
      }

      if (question.type === 'textarea') {
        return (
          <Textarea
            className="open-question form-control"
            rows={3}
            cols={40}
            name={String(question.id)}
            label={question.question}
            required={question.required}
            key={question.id}
          />
        );
      }

      if (question.type === 'select') {
        const optionsArray = [];

        question.options.map(option => optionsArray.push({ label: option }));

        return (
          <Select
            name={String(question.id)}
            label={question.question}
            options={optionsArray}
            required={question.required}
            key={question.id}
          />
        );
      }

      if (question.type === 'checkbox') {
        return (
          <CheckboxGroup
            value={[]}
            name={String(question.id)}
            label={question.question}
            required={question.required}
            options={question.options.map(option => ({ label: option, value: option }))}
            key={question.id}
          />
        );
      }

      return null;
    });
  }

  render() {
    return (
      <div className="form-wrapper">
        <div className="container">
          <a className="close" onClick={() => this.props.closeForm()} />
          <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
            <h2>Ilmoittaudu</h2>
            <p>{`Olet jonossa sijalla: ${this.props.signup.positionInQuota}`}</p>
            <Formsy.Form onValidSubmit={this.parseSubmit}>
              <Input name="firstName" value="" label="Etunimi" type="text" placeholder="Etunimi" required />
              <Input name="lastName" value="" label="Sukunimi" type="text" placeholder="Sukunimi" required />
              <Input
                name="email"
                value=""
                label="Sähköposti"
                type="email"
                placeholder="Sähköpostisi"
                validations="isEmail"
                required
              />

              {this.renderQuestionFields()}

              <div className="input-wrapper pull-right">
                <input
                  className="btn btn-primary pull-right"
                  formNoValidate
                  type="submit"
                  defaultValue="Submit"
                  disabled={this.props.loading}
                />
              </div>
              <a className="btn btn-link pull-right" onClick={() => this.props.closeForm()}>
                Peruuta
              </a>
            </Formsy.Form>
          </div>
          <div className="cf" />
        </div>
      </div>
    );
  }
}

EnrollForm.propTypes = {
  closeForm: React.PropTypes.func.isRequired,
  questions: React.PropTypes.array,
  signup: React.PropTypes.object,
  loading: React.PropTypes.bool,
  error: React.PropTypes.string,
};

export default EnrollForm;
