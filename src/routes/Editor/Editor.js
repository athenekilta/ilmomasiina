import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import Spinner from 'react-spinkit';
import { browserHistory, Link } from 'react-router';
import { toast } from 'react-toastify';
import Promise from 'bluebird';
import { connect } from 'react-redux';

import './Editor.scss';
import * as EditorActions from '../../modules/editor/actions';

import BasicDetailsTab from './components/BasicDetailsTab';
import QuotasTab from './components/QuotasTab';
import QuestionsTab from './components/QuestionsTab';
import EmailsTab from './components/EmailsTab';
import SignupsTab from './components/SignupsTab';

async function minDelay(func, ms = 1000) {
  const res = await Promise.all([func, new Promise(resolve => setTimeout(resolve, ms))]);
  return res[0];
}

class Editor extends React.Component {
  static propTypes = {
    publishEventAsync: PropTypes.func,
    updateEventAsync: PropTypes.func,
    updateEventField: PropTypes.func,
    getEventAsync: PropTypes.func,
    setEvent: PropTypes.func,
    event: PropTypes.object,
    eventLoading: PropTypes.bool,
    eventError: PropTypes.bool,
    eventPublishLoading: PropTypes.bool,
    eventPublishError: PropTypes.bool,
    params: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      isValid: false,
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
          this.props.setEvent({});

          // Set base quota field
          this.props.updateEventField('quota', [{ title: 'Kiintiö' }]);
        } else {
          this.props.getEventAsync(eventId);
        }
      },
    );
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

    if (this.props.params.id === 'new') {
      try {
        const res = await minDelay(this.props.publishEventAsync(event), 1000);
        browserHistory.push(`/admin/edit/${res.id}`);
      } catch (error) {
        console.log(error);
        toast.error('Jotain meni pieleen - tapahtuman luonti epäonnistui.', { autoClose: 2000 });
      }
      this.setState({
        eventPublishing: false,
      });
    } else {
      try {
        await minDelay(this.props.updateEventAsync(event), 1000);
      } catch (error) {
        console.log(error);
        toast.error('Jotain meni pieleen - tapahtuman päivittäminen epäonnistui.', { autoClose: 2000 });
      }
    }
  }

  renderButtons() {
    if (this.props.params.id === 'new') {
      return (
        <div className="pull-right event-editor--buttons-wrapper">
          {this.props.eventPublishLoading ? <Spinner name="circle" fadeIn="quarter" /> : null}
          <input
            disabled={!this.state.isValid || this.props.eventPublishLoading}
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
          {this.props.eventPublishLoading ? <Spinner name="circle" fadeIn="quarter" /> : null}
          <div className="event-editor--public-status">
            <div className="event-editor--bubble draft event-editor--animated" />
            <span>Luonnos</span>
          </div>
          <input
            disabled={!this.state.isValid || this.props.eventPublishLoading}
            className="btn btn-success event-editor--animated"
            formNoValidate
            type="submit"
            defaultValue="Julkaise"
            onClick={() => this.publishEvent(false)}
          />
          <input
            disabled={!this.state.isValid || this.props.eventPublishLoading}
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
        {this.props.eventPublishLoading ? <Spinner name="circle" fadeIn="quarter" /> : null}
        <div className="event-editor--public-status">
          <div className="event-editor--bubble public event-editor--animated" />
          <span>Julkaistu</span>
        </div>
        <input
          disabled={!this.state.isValid || this.props.eventPublishLoading}
          className="btn btn-warning event-editor--animated"
          formNoValidate
          type="submit"
          defaultValue="Muuta luonnokseksi"
          onClick={() => this.publishEvent(true)}
        />
        <input
          disabled={!this.state.isValid || this.props.eventPublishLoading}
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

    if (this.props.eventLoading) {
      return (
        <div className="event-editor">
          <div className="event-editor--loading-container">
            <Spinner name="circle" fadeIn="quarter" />
          </div>
        </div>
      );
    }

    if (this.props.eventError) {
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
          className="form-horizontal col-xs-12 col-md-10 col-md-offset-1"
        >
          <h1>{isNewEvent ? 'Luo uusi tapahtuma' : 'Muokkaa tapahtumaa'}</h1>
          {this.renderButtons()}
          <ul className="event-editor--nav nav nav-tabs">
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
            <li className={this.state.activeTab === 5 ? 'active' : ''}>
              <a onClick={() => this.changeTab(5)}>Ilmoittautuneet</a>
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
            <div className={`tab-pane ${this.state.activeTab === 5 ? 'active' : ''}`}>
              <SignupsTab event={this.props.event} onDataChange={this.onDataChange} />
            </div>
          </div>
        </Formsy.Form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  publishEventAsync: EditorActions.publishEventAsync,
  updateEventAsync: EditorActions.updateEventAsync,
  getEventAsync: EditorActions.getEventAsync,
  setEvent: EditorActions.setEvent,
  updateEventField: EditorActions.updateEventField,
};

const mapStateToProps = state => ({
  event: state.editor.event,
  eventLoading: state.editor.eventLoading,
  eventError: state.editor.eventError,
  eventPublishLoading: state.editor.eventPublishLoading,
  eventPublishError: state.editor.eventPublishError,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);
