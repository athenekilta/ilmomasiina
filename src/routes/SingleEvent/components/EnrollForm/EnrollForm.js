import React from 'react';
import Formsy from 'formsy-react';
import { Checkbox, Select, Input, Textarea } from 'formsy-react-components';
import './EnrollForm.scss';

export class EnrollForm extends React.Component {
  render() {
    const selectOptions = [
    { value: 'a', label: 'Option A' },
    { value: 'a', label: 'Option A (again)' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
    { value: 'd', label: 'Option D' },
    ];

    const singleSelectOptions = selectOptions.slice(0);
    singleSelectOptions.unshift({ value: '', label: 'Please select…' });

    return (
      <div className="form-wrapper">
        <div className="container">
          <a className="close" onClick={() => this.props.closeForm()} />
          <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
            <h2>Ilmoittaudu</h2>
            <p>Ilmoittautumistilanteesi on: [insert tilanne]</p>
            <Formsy.Form
              onSubmit={this.submitForm}>
              <Input
                name="firstname"
                id="nimiId1"
                value=""
                label="Etunimi"
                type="text"
                placeholder="Etunimi"
                required />
              <Input
                name="lastname"
                id="nimiId2"
                value=""
                label="Sukunimi"
                type="text"
                placeholder="Sukunimi"
                required />
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
              <Textarea className='open-question form-control'
                rows={3}
                cols={40}
                name="avoinKysymys"
                label="Avoin kysymys"
                placeholder="Tämä on avoimen kysymyksen ennakkoteksti."
              />
              <Checkbox
                name="checkbox1"
                value
                label="Valitse minut"
                rowLabel="Klikattava vaihtoehto"
              />
              <Select
                name="select1"
                label="Select"
                options={singleSelectOptions}
                required
              />
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
};

export default EnrollForm;
