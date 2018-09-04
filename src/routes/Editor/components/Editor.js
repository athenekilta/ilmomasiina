import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import Spinner from 'react-spinkit';
import './Editor.scss';
import { browserHistory, Link } from 'react-router';
import { toast } from 'react-toastify';
import Promise from 'bluebird';

import BasicDetailsTab from './BasicDetailsTab';
import QuotasTab from './QuotasTab';
import QuestionsTab from './QuestionsTab';
import EmailsTab from './EmailsTab';

async function minDelay(func, ms = 1000) {
  const res = await Promise.all([func, new Promise(resolve => setTimeout(resolve, ms))]);
  return res[0];
}

class Editor extends React.Component {
  static propTypes = {
    getEventAsync: PropTypes.func.isRequired,
    publishEventAsync: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateEventAsync: PropTypes.func.isRequired,
    updateEventField: PropTypes.func.isRequired,
    event: PropTypes.object,
    params: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      eventLoading: true,
      eventLoadingError: false,
      isValid: false,
      eventPublishing: false,
    };

    this.changeTab = this.changeTab.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.publishEvent = this.publishEvent.bind(this);
  }

  componentWillMount() {
    this.setState(
      {
        eventLoading: true,
      },
      async () => {
        const eventId = this.props.params.id;

        if (eventId === 'new') {
          // New event, clear any existing one from redux;
          this.props.updateEvent({});

          // Set base quota field
          this.props.updateEventField('quota', [{ title: 'Kiintiö' }]);
        } else {
          // Editing existing event, fetch the event
          try {
            await this.props.getEventAsync(eventId);
          } catch (error) {
            console.log(error);
            this.setState({
              eventLoadingError: true,
              eventLoading: false,
            });
          }
        }
      },
    );
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
        isValid,
      });
    }
  }

  async publishEvent(isDraft = false) {
    const event = {
      ...this.props.event,
      draft: isDraft,
    };

    this.setState({
      eventPublishing: true,
    });

    if (this.props.params.id === 'new') {
      try {
        const res = await minDelay(this.props.publishEventAsync(event), 1000);
        browserHistory.push(`/admin/edit/${res.id}`);
      } catch (error) {
        toast.error('Jotain meni pieleen - tapahtuman luonti epäonnistui.', { autoClose: 2000 });
      }
      this.setState({
        eventPublishing: false,
      });
    } else {
      try {
        await minDelay(this.props.updateEventAsync(event), 1000);
      } catch (error) {
        toast.error('Jotain meni pieleen - tapahtuman päivittäminen epäonnistui.', { autoClose: 2000 });
      }

      this.setState({
        eventPublishing: false,
      });
    }
  }

  renderButtons() {
    if (this.props.params.id === 'new') {
      return (
        <div className="pull-right event-editor--buttons-wrapper">
          {this.state.eventPublishing ? <Spinner name="circle" fadeIn="quarter" /> : null}
          <input
            disabled={!this.state.isValid || this.state.eventPublishing}
            className="btn btn-info pull-right event-editor--animated"
            formNoValidate
            type="submit"
            defaultValue="Tallenna luonnoksena"
            onClick={() => this.publishEvent(true)}
          />
        </div>
      );
    }

    if (this.props.event.draft) {
      return (
        <div className="pull-right event-editor--buttons-wrapper">
          {this.state.eventPublishing ? <Spinner name="circle" fadeIn="quarter" /> : null}
          <div className="event-editor--public-status">
            <div className="event-editor--bubble draft event-editor--animated" />
            <span>Luonnos</span>
          </div>
          <input
            disabled={!this.state.isValid || this.state.eventPublishing}
            className="btn btn-success event-editor--animated"
            formNoValidate
            type="submit"
            defaultValue="Julkaise"
            onClick={() => this.publishEvent(false)}
          />
          <input
            disabled={!this.state.isValid || this.state.eventPublishing}
            className="btn btn-info event-editor--animated"
            formNoValidate
            type="submit"
            defaultValue="Tallenna muutokset"
            onClick={() => this.publishEvent(this.props.event.draft)}
          />
        </div>
      );
    }

    return (
      <div className="pull-right event-editor--buttons-wrapper">
        {this.state.eventPublishing ? <Spinner name="circle" fadeIn="quarter" /> : null}
        <div className="event-editor--public-status">
          <div className="event-editor--bubble public event-editor--animated" />
          <span>Julkaistu</span>
        </div>
        <input
          disabled={!this.state.isValid || this.state.eventPublishing}
          className="btn btn-warning event-editor--animated"
          formNoValidate
          type="submit"
          defaultValue="Muuta luonnokseksi"
          onClick={() => this.publishEvent(true)}
        />
        <input
          disabled={!this.state.isValid || this.state.eventPublishing}
          className="btn btn-info event-editor--animated"
          formNoValidate
          type="submit"
          defaultValue="Tallenna muutokset"
          onClick={() => this.publishEvent(this.props.event.draft)}
        />
      </div>
    );
  }

  renderValidNotice() {
    const className = this.state.isValid ? 'event-editor--valid-notice collapsed' : 'event-editor--valid-notice';

    return (
      <div className={className}>
        <span>
          <b>*</b>
          Tähdellä merkityt kentät ovat pakollisia
        </span>
      </div>
    );
  }

  render() {
    const isNewEvent = this.props.params.id === 'new';

    if (this.state.eventLoading) {
      return (
        <div className="event-editor">
          <div className="event-editor--loading-container">
            <Spinner name="circle" fadeIn="quarter" />
          </div>
        </div>
      );
    }

    if (this.state.eventLoadingError) {
      return (
        <div className="event-editor">
          <div className="event-editor--loading-container">
            <h1>Hups, jotain meni pieleen</h1>
            <p>{`Tapahtumaa id:llä "${this.props.params.id}" ei löytynyt`}</p>
            <Link to="/admin/">Palaa tapahtumalistaukseen</Link>
          </div>
        </div>
      );
    }

    return (
      <div className="event-editor">
        <Formsy.Form
          onValid={() => this.setValidState(true)}
          onInvalid={() => this.setValidState(false)}
          className="form-horizontal col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2"
        >
          <h1>{isNewEvent ? 'Luo uusi tapahtuma' : 'Muokkaa tapahtumaa'}</h1>
          {this.renderButtons()}
          <ul className="nav nav-tabs">
            <li className={this.state.activeTab === 1 ? 'active' : ''}>
              <a onClick={() => this.changeTab(1)}>Perustiedot</a>
            </li>
            <li className={this.state.activeTab === 2 ? 'active' : ''}>
              <a onClick={() => this.changeTab(2)}>Ilmoittautumisasetukset</a>
            </li>
            <li className={this.state.activeTab === 3 ? 'active' : ''}>
              <a onClick={() => this.changeTab(3)}>Kysymykset</a>
            </li>
            <li className={this.state.activeTab === 4 ? 'active' : ''}>
              <a onClick={() => this.changeTab(4)}>Vahvistusviestit</a>
            </li>
          </ul>
          {this.renderValidNotice()}
          <div className="tab-content">
            <div className={`tab-pane ${this.state.activeTab === 1 ? 'active' : ''}`}>
              <BasicDetailsTab event={this.props.event} onDataChange={this.onDataChange} />
            </div>
            <div className={`tab-pane ${this.state.activeTab === 2 ? 'active' : ''}`}>
              <QuotasTab event={this.props.event} onDataChange={this.onDataChange} />
            </div>
            <div className={`tab-pane ${this.state.activeTab === 3 ? 'active' : ''}`}>
              <QuestionsTab event={this.props.event} onDataChange={this.onDataChange} />
            </div>
            <div className={`tab-pane ${this.state.activeTab === 4 ? 'active' : ''}`}>
              <EmailsTab event={this.props.event} onDataChange={this.onDataChange} />
            </div>
          </div>
        </Formsy.Form>
      </div>
    );
  }
}

export default Editor;
