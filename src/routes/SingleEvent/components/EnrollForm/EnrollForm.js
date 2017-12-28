import React from 'react';
import Formsy from 'formsy-react';
import { Checkbox, Select, Input, Textarea } from 'formsy-react-components';
import './EnrollForm.scss';

export class EnrollForm extends React.Component {
  render() {
    function questionsToField(question) {
      if (question.type === 'text') {
        return (
          <Input
            name={question.question}
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
            name={question.question}
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
            name={question.question}
            label={question.question}
            options={optionsArray}
            required={question.required === 1}
            key={question.id}
          />
        );
      }

      if (question.type === 'checkbox') {
        return question.options.map((option, index) => (
          <Checkbox
            name={option}
            label={option}
            rowLabel={index === 0 ? question.question : ''}
            key={question.id + index / 100}
          />
        ));
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
            <Formsy.Form onSubmit={this.submitForm}>
              <Input
                name="firstname"
                id="nimiId1"
                value=""
                label="Etunimi"
                type="text"
                placeholder="Etunimi"
                required
              />
              <Input
                name="lastname"
                id="nimiId2"
                value=""
                label="Sukunimi"
                type="text"
                placeholder="Sukunimi"
                required
              />
              <Input
                name="email"
                value=""
                label="Sähköposti"
                type="email"
                placeholder="Sähköpostisi"
                validations="isEmail"
                validationErrors={{
                  isEmail: 'Anna sähköpostisi muodossa pekka@cto.fi',
                }}
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
