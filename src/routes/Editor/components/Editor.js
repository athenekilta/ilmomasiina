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
    publishEventAsync: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateEventField: PropTypes.func.isRequired,
    event: PropTypes.object,
    params: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      eventLoading: true,
      isValid: false
    };

    this.changeTab = this.changeTab.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.publishEvent = this.publishEvent.bind(this);
  }

  componentWillMount() {
    this.setState({
      eventLoading: true,
    }, () => {
      const eventId = this.props.params.id;

      if (eventId === 'new') {
        // New event, clear any existing one from redux;
        this.props.updateEvent({});
      } else {
        // Editing existing event, fetch the event
        this.props.getEventAsync(eventId);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.eventLoading && nextProps.event !== this.props.event) {
      this.setState({
        eventLoading: false,
      });
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

  setValidState(isValid) {
    if (isValid !== this.state.isValid) {
      this.setState({
        isValid
      });
    }
  }

  publishEvent(isDraft = false) {
    const event = {
      ...this.props.event, 
      draft: isDraft,
    };

    if (this.props.params.id === 'new') {
      this.props.publishEventAsync(event);
    } else {
      this.props.updateEventAsync(event);
    }
  }

  renderButtons() {

    return(
      <div className="pull-right">
        <input disabled={!this.state.isValid} className="btn btn-success pull-right" formNoValidate type="submit" defaultValue="Julkaise" onClick={() => this.publishEvent(false)} />
        <input disabled={!this.state.isValid} className="btn btn-info pull-right" formNoValidate type="submit" defaultValue="Tallenna Luonnoksena" onClick={() => this.publishEvent(true)} />
      </div>
    );
  }

  renderValidNotice() {

    const className = this.state.isValid ? 'event-editor--valid-notice collapsed' : 'event-editor--valid-notice';

    return(
      <div className={className}>
        <span><b>*</b>Tähdellä merkityt kentät ovat pakollisia</span>
      </div>
    )
  }

  render() {
    const isNewEvent = this.props.params.id === 'new';

    return (
      <div className="event-editor">
        <Formsy.Form
          onValid={() => this.setValidState(true)}
          onInvalid={() => this.setValidState(false)}
          className="form-horizontal col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          <h1>{isNewEvent ? 'Luo uusi tapahtuma' : 'Muokkaa tapahtumaa'}</h1>
          {this.renderButtons()}
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
          {this.renderValidNotice()}
          {
            this.state.eventLoading ?
              (
                <div className="tab-content">
                  <div className={`tab-pane active`}>
                    <h1>Näytä tässä joku spinneri</h1>
                  </div>
                </div>
              ) : (
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
              )
          }
        </Formsy.Form>
      </div>
    );
  }
}

export default Editor;
