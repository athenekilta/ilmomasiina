import React from 'react';
import Formsy from 'formsy-react';
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
            return { questionId, answer };
          }

          return null;
        })
        .filter(x => x);
    }

    return this.props.submitForm(answers);
  }

  render() {
    function questionsToField(question) {
      if (question.type === 'text') {
        return (
          <Input
            name={String(question.id)}
            label={question.question}
            type="text"
            required={question.required === 1}
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
            required={question.required === 1}
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
            required={question.required === 1}
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
            options={question.options.map(option => ({ label: option, value: option }))}
            key={question.id}
          />
        );
      }

      return '';
    }

    return (
      <div className="form-wrapper">
        <div className="container">
          <a className="close" onClick={() => this.props.closeForm()} />
          <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
            <h2>Ilmoittaudu</h2>
            <p>Ilmoittautumistilanteesi on: [insert tilanne]</p>
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

              {this.props.questions.map(questionsToField)}

              <input className="btn btn-primary pull-right" formNoValidate type="submit" defaultValue="Submit" />
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
  questions: React.PropTypes.shape({
    map: React.PropTypes.func,
  }),
};

export default EnrollForm;
