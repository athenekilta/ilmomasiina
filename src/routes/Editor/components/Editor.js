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
    params: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
    };

    this.changeTab = this.changeTab.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    const eventId = this.props.params.id;

    if (eventId === 'new') {
      // New event;
    }
    else {
      this.props.getEventAsync(eventId);
    }
  }

  changeTab(id) {
    const state = this.state;
    state.activeTab = id;
    this.setState(state);
  }

  submitForm(model) {
    // TODO: this
  }

  render() {

    const isNewEvent = this.props.params.id === 'new';

    return (
      <Formsy.Form
        onSubmit={this.submitForm}
        className="event-editor form-horizontal col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        <h1>{isNewEvent ? 'Luo uusi tapahtuma' : 'Muokkaa tapahtumaa'}</h1>
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
            <BasicDetailsTab onDataChange={data => console.log(data)} />
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 2 ? 'active' : '')}`}>
            <QuotasTab onDataChange={data => console.log(data)} />
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 3 ? 'active' : '')}`}>
            <QuestionsTab onDataChange={data => console.log(data)} />
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 4 ? 'active' : '')}`}>
            <EmailsTab onDataChange={data => console.log(data)} />
          </div>
        </div>
      </Formsy.Form>
    );
  }
}

export default Editor;
