import React from 'react';
import Formsy from 'formsy-react';
import _ from 'lodash';

import { CheckboxGroup, Select, Input, Textarea, RadioGroup } from 'formsy-react-components';
import './EnrollForm.scss';

export class EnrollForm extends React.Component {
  constructor(props) {
    super(props);
    this.parseSubmit = this.parseSubmit.bind(this);
    this.setError = this.setError.bind(this)
    this.state = { inputError: false }
  }
  setError() {
    this.setState({ inputError: true })
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
      const help = question.public ? 'Tämän kentän vastaukset ovat julkisia.' : null;

      if (question.type === 'text') {
        return (
          <Input
            name={String(question.id)}
            label={question.question}
            type="text"
            required={question.required}
            key={question.id}
            help={help}
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
          />
        );
      }

      if (question.type === 'select') {
        if (question.options.length > 3) { // render select if more than 3 options
          let optionsArray = [{ label: "Valitse...", value: null }];

          question.options.map(option => optionsArray.push({ label: option }));

          return (
            <Select
              validations="isExisty"
              name={String(question.id)}
              label={question.question}
              options={optionsArray}
              required={question.required}
              key={question.id}
              help={help}
            />
          );
        }
        return (
          <RadioGroup
            name={String(question.id)}
            type="inline"
            label={question.question}
            options={question.options.map(option => ({ label: option, value: option }))}
            required={question.required}
            key={question.id}
            help={help}
          />
        );
      }

      if (question.type === 'checkbox') {
        return (
          <CheckboxGroup
            value={[]}
            type="inline"
            name={String(question.id)}
            label={question.question}
            required={question.required}
            options={question.options.map(option => ({ label: option, value: option }))}
            key={question.id}
            help={help}
          />
        );
      }

      return null;
    });
  }

  render() {
    const signupStatus = () => {
      const { status, position, quotaId } = this.props.signup;
      const { openQuotaSize } = this.props.event;
      const quotas = this.props.event.quota;

      if (status == 'in-quota') {
        const quota = _.find(quotas, { id: quotaId });
        return `Olet kiintiössä ${quota.title} sijalla ${position + (quota.size ? " / " + quota.size : "")}.`;
      }

      if (status == 'in-open') {
        return `Olet avoimessa kiintiössä sijalla ${position} / ${openQuotaSize}.`;
      }

      return `Olet jonossa sijalla ${position}.`;
    };
    return (

      <div className="form-wrapper">
        <div className="container">
          <a className="close" onClick={() => this.props.closeForm()} />
          <div className="col-xs-12 col-md-8 col-md-offset-2">
            {this.state.inputError ? <p style={{ color: "#a94442" }}>Ilmoittautumisessasi on virheitä.</p> : null}
            <h2>Ilmoittaudu</h2>
            {this.props.signup.status != null ? <p>{signupStatus()}</p> : null}

            <Formsy.Form onValidSubmit={this.parseSubmit} onInvalidSubmit={this.setError}>
              <Input name="firstName" value="" label="Etunimi / First name" type="text" placeholder="Etunimi" required />
              <Input name="lastName" value="" label="Sukunimi / Last name" type="text" placeholder="Sukunimi" required help="Nimi on julkinen tieto. Voit halutessasi ilmoittautua tapahtumaan salanimellä." />

              <Input
                name="email"
                value=""
                label="Sähköposti / Email"
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
                  defaultValue="Lähetä"
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
      </div >
    );
  }
}

EnrollForm.propTypes = {
  closeForm: React.PropTypes.func.isRequired,
  questions: React.PropTypes.array,
  signup: React.PropTypes.object,
  loading: React.PropTypes.bool,
  error: React.PropTypes.bool,
};

export default EnrollForm;
