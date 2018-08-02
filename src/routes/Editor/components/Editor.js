import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import './Editor.scss';

import BasicDetailsTab from './BasicDetailsTab';
import QuotasTab from './QuotasTab';
import QuestionsTab from './QuestionsTab';
import EmailsTab from './EmailsTab';

class Editor extends React.Component {

  static propTypes = {
    getEventAsync: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateEventField: PropTypes.func.isRequired,
    event: PropTypes.object,
    params: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
    };

    this.changeTab = this.changeTab.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    const eventId = this.props.params.id;

    if (eventId === 'new') {
      // New event;
    }
    else {
      console.log(eventId);
      this.props.getEventAsync(eventId);
    }
  }

  changeTab(id) {
    const state = this.state;
    state.activeTab = id;
    this.setState(state);
  }

  onDataChange(field, value) {
    this.props.updateEventField(field, value);
  }

  submitForm(model) {
    // TODO: this
  }

  render() {
    console.log('EVENT', this.props.event);
    const isNewEvent = this.props.params.id === 'new';

    return (
      <Formsy.Form
        onSubmit={this.submitForm}
        className="event-editor form-horizontal col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        <h1>{isNewEvent ? 'Luo uusi tapahtuma' : 'Muokkaa tapahtumaa'}</h1>
        <p>TODO: hook up event fields: 'draft', 'answersPublic' and 'openQuota'</p>
        <p>TODO: Hook up save-button. (If editing: update event, otherwise: create event)</p>
        <p>NOTE: Currently 'create-fake-data' script has wrong fields for events, update that</p>
        <input className="btn btn-success pull-right" formNoValidate type="submit" defaultValue="Tallenna" />
        <ul className="nav nav-tabs">
          <li className={(this.state.activeTab === 1 ? 'active' : '')}>
            <a onClick={() => this.changeTab(1)}>Perustiedot</a>
          </li>
          <li className={(this.state.activeTab === 2 ? 'active' : '')}>
            <a onClick={() => this.changeTab(2)}>Ilmoittautumisasetukset</a>
          </li>
          <li className={(this.state.activeTab === 3 ? 'active' : '')}>
            <a onClick={() => this.changeTab(3)}>Kysymykset</a>
          </li>
          <li className={(this.state.activeTab === 4 ? 'active' : '')}>
            <a onClick={() => this.changeTab(4)}>Vahvistusviestit</a>
          </li>
        </ul>
        <div className="tab-content">
          <div className={`tab-pane ${(this.state.activeTab === 1 ? 'active' : '')}`}>
            <BasicDetailsTab event={this.props.event} onDataChange={this.onDataChange} />
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 2 ? 'active' : '')}`}>
            <QuotasTab event={this.props.event} onDataChange={this.onDataChange} />
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 3 ? 'active' : '')}`}>
            <QuestionsTab event={this.props.event} onDataChange={this.onDataChange} />
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 4 ? 'active' : '')}`}>
            <EmailsTab event={this.props.event} onDataChange={this.onDataChange} />
          </div>
        </div>
      </Formsy.Form>
    );
  }
}

export default Editor;
