import React from 'react';
import Formsy from 'formsy-react';
import { Input, Textarea } from 'formsy-react-components';
import './SingleEvent.scss';

class EnrollForm extends React.Component {
  render() {
    return (
      <div className='col-xs-12'>
        <a onClick={() => this.props.closeForm()} >Sulje</a>
        <h2>Ilmoittaudu</h2>
        <p>Olet mukana</p>
        <Formsy.Form
          onSubmit={this.submitForm}>
          <Input
            name="nimi"
            id="nimiId"
            value=""
            label="Nimi"
            type="text"
            placeholder="Nimesi"
            help="*Tämä kenttä on pakollinen."
            required />
          <Input
            name="email"
            value=""
            label="Sähköposti"
            type="email"
            placeholder="Sähköpostisi"
            help="*Tämä kenttä on pakollinen"
            validations="isEmail"
            validationErrors={{
              isEmail: 'Anna sähköpostisi muodossa pekka@cto.fi',
            }}
            required
          />
          <Textarea
            rows={3}
            cols={40}
            name="avoinKysymys"
            label="Avoin kysymys"
            placeholder="Tämä on avoimen kysymyksen ennakkoteksti."
          />
        </Formsy.Form>
      </div>
    );
  }
}

class AttendButton extends React.Component {
  render() {
    return <button className='btn btn-success btn-block' onClick={() => this.props.openForm()} >
      {this.props.data.quotaName}</button>;
  }
}

class ViewProgress extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.data.quotaName}</p>
        <div className='progress col-xs-12'>
          <div className='progress-bar' role='progressbar'
            style={{ minWidth: '4em', width: `${(this.props.data.going / this.props.data.max) * 100}%` }}>
            {this.props.data.going}/{this.props.data.max}
          </div>
        </div>
      </div>
    );
  }
}

class AttendeeGroup extends React.Component {
  render() {
    const RegistrationRow = attendee =>
      <tr>
        <td>{attendee.data}</td>
        <td>{attendee.data}</td>
        <td>{attendee.data}</td>
      </tr>;

    return (
      <div>
        <h3>{this.props.data.quotaName}</h3>
        <table className='table table-condensed table-responsive'>
          <thead>
            <tr className='active'>
              <th>Sija</th>
              <th>Nimi</th>
              {typeof this.props.data !== 'undefined' ? <th>Oma tsyssäri jos on</th> : null }
            </tr>
          </thead>
          <tbody>
            {
            this.props.data.attendees.map(
              i =>
                <RegistrationRow data={i} />)
          }
          </tbody>
        </table>
        <hr />
      </div>
    );
  }
}

class SingleEvent extends React.Component {
  componentWillMount() {
    // get the event with correct id
    this.props.getEventInfo();
  }
  constructor(props) {
    super(props);
    this.state = {
      formOpened: false,
    };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  openForm() {
    const state = this.state;
    state.formOpened = true;
    this.setState(state);
  }

  closeForm() {
    const state = this.state;
    state.formOpened = false;
    this.setState(state);
  }

  submitForm() {
    const state = this.state;
    state.formOpened = false;
    this.setState(state);
  }
  render() {
    return (
      <div>
        {this.state.formOpened ? <EnrollForm closeForm={this.closeForm} /> : '' }
        <div className='col-xs-12 col-md-8'>
          <h1>{this.props.singleEvent.title}</h1>
          <p>
            {this.props.singleEvent.date}<br />
            Hinta: {this.props.singleEvent.price}<br />
            <a href='http://pekkalammi.com'>Facebook-tapahtuma</a>
          </p>
          <p>{this.props.singleEvent.description}</p>
        </div>
        <div className='sidebar-widget col-xs-12 col-md-4 pull-right'>
          <h3 className='col-md-12'>Ilmoittaudu</h3>
          {(this.props.singleEvent.quota ? this.props.singleEvent.quota.map((i, index) =>
            <AttendButton openForm={this.openForm} key={index} data={i} />) : '')}
        </div>
        <div className='sidebar-widget col-xs-12 col-md-4 pull-right'>
          <h3>Ilmoittautuneet</h3>
          {(this.props.singleEvent.quota ? this.props.singleEvent.quota.map((i, index) =>
            <ViewProgress key={index} data={i} />) : '')}
        </div>
        <div className='col-xs-12 col-md-8'>
          <h2>Ilmoittautuneet</h2>
          {(this.props.singleEvent.quota ? this.props.singleEvent.quota.map((i, index) =>
            <AttendeeGroup key={index} data={i} />) : '')}
        </div>
      </div>
    );
  }
}

EnrollForm.propTypes = {
  closeForm: React.PropTypes.func.isRequired,
};

AttendButton.propTypes = {
  openForm: React.PropTypes.func.isRequired,
};

ViewProgress.propTypes = {
  data: React.PropTypes.shape({
    quotaName: React.PropTypes.string,
    going: React.PropTypes.number,
    max: React.PropTypes.number,
  }).isRequired,
};

AttendButton.propTypes = {
  data: React.PropTypes.shape({
    quotaName: React.PropTypes.string,
  }).isRequired,
};

AttendeeGroup.propTypes = {
  data: React.PropTypes.shape({
    quotaName: React.PropTypes.string,
    attendees: React.PropTypes.array,
  }).isRequired,
};

SingleEvent.propTypes = {
  getEventInfo: React.PropTypes.func.isRequired,
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
  }).isRequired,
  singleEvent: React.PropTypes.shape({
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.string,
    date: React.PropTypes.number,
    quota: React.PropTypes.array,
  }),
};

export default SingleEvent;
