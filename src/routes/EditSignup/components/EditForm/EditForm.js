import React from 'react';
import Formsy from 'formsy-react';
import { Link } from 'react-router';
import _ from 'lodash';

import { CheckboxGroup, Select, Input, Textarea } from 'formsy-react-components';
import './EditForm.scss';

export class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.parseSubmit = this.parseSubmit.bind(this);
    this.setError = this.setError.bind(this);
    this.state = { inputError: false };
  }
  setError() {
    this.setState({ inputError: true });
  }
  parseSubmit(data) {
    const answers = {
      firstName: this.props.signup.firstName,
      lastName: this.props.signup.lastName,
      email: this.props.signup.email,
      answers: [],
    };
      answers.answers = this.props.questions
        .map((question) => {
          const questionId = question.id;
          const answer = data[question.id];
          if (answer && answer.length > 0) {
            if (question.type === 'checkbox') {
              return { id: question.answerId, questionId, answer: answer.join(';') };
            }
            return { id: question.answerId, questionId, answer };
          }
          return {id: question.answerId, questionId, answer: ""};
        })
        .filter(x => x);
    return this.props.submitForm(answers);
  }

  renderQuestionFields() {
    return _.map(this.props.questions, (question) => {
      const help = question.public ? 'Tämän kentän vastaukset ovat julkisia. / Answers to this field are public.' : null;

      if (question.type === 'text') {
        return (
          <Input
            name={String(question.id)}
            label={question.question}
            type="text"
            required={question.required}
            key={question.id}
            help={help}
            value={question.answer}
          />
        );
      }
      if (question.type === 'number') {
        return (
          <Input
            name={String(question.id)}
            label={question.question}
            type="number"
            required={question.required}
            key={question.id}
            help={help}
            value={question.answer}
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
            help={help}
            value={question.answer}
          />
        );
      }

      if (question.type === 'select') {
        let optionsArray = [{ label: 'Valitse… / Choose…', value: null }];
        optionsArray = optionsArray;

        question.options.split(';').map(option => optionsArray.push({ label: option }));

        return (
          <Select
            name={String(question.id)}
            label={question.question}
            options={optionsArray}
            required={question.required}
            key={question.id}
            help={help}
            value={question.answer}
          />
        );
      }

      if (question.type === 'checkbox') {
        return (
          <CheckboxGroup
            name={String(question.id)}
            label={question.question}
            required={question.required}
            options={question.options.split(';').map(option => ({ label: option, value: option }))}
            key={question.id}
            help={help}
            value={question.answer.split(';')}
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
          <div className="col-xs-12 col-md-8 col-md-offset-2">
            {this.state.inputError ? <p style={{ color: '#a94442' }}>Ilmoittautumisessasi on virheitä. / There are errors in your info.</p> : null}
            <h2>Muokkaa ilmoittautumista / Edit registration</h2>
            {this.props.signup.status != null ? <p>{signupStatus()}</p> : null}

            <Formsy.Form onValidSubmit={this.parseSubmit} onInvalidSubmit={this.setError}>
              <Input
                name="firstName"
                value={this.props.signup.firstName}
                label="Etunimi / Firstname"
                type="text"
                placeholder="Etunimi"
                disabled
              />
              <Input
                name="lastName"
                value={this.props.signup.lastName}
                label="Sukunimi / Surname"
                type="text"
                placeholder="Sukunimi"
                disabled
              />

              <Input
                name="email"
                value={this.props.signup.email}
                label="Sähköposti / Email"
                type="email"
                placeholder="Sähköpostisi"
                validations="isEmail"
                disabled
              />

              {this.renderQuestionFields()}

              <div className="input-wrapper pull-right">
                <input
                  className="btn btn-primary pull-right"
                  formNoValidate
                  type="submit"
                  defaultValue="Päivitä"
                  disabled={this.props.loading}
                />
              </div>
              <Link className="btn btn-link pull-right" to={`${PREFIX_URL}/`} >
                Peruuta / Cancel
              </Link>
            </Formsy.Form>
          </div>
          <div className="cf" />
        </div>
      </div >
    );
  }
}

EditForm.propTypes = {
  questions: React.PropTypes.array,
  signup: React.PropTypes.object,
  loading: React.PropTypes.bool,
};

export default EditForm;
