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
import * as AdminSignupActions from '../../modules/admin/actions';

import BasicDetailsTab from './components/BasicDetailsTab';
import QuotasTab from './components/QuotasTab';
import QuestionsTab from './components/QuestionsTab';
import EmailsTab from './components/EmailsTab';
import SignupsTab from './components/SignupsTab';
import { getOpenQuotas } from '../../modules/singleEvent/selectors';
import { getSignups } from '../../modules/admin/selectors';

import { getSignupsByQuota } from '../../utils/signupUtils';


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
    adminToken: PropTypes.string.isRequired,
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
        const { adminToken } = this.props;

        if (eventId === 'new') {
          // New event, clear any existing one from redux;
          this.props.setEvent({});

          // Set base quota field
          this.props.updateEventField('quota', [{ id: 0, title: 'Kiintiö', size: 20, existsInDb: false }]);
          this.props.updateEventField('questions', []);
        } else {
          this.props.getEventAsync(eventId, adminToken);
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

    const { adminToken } = this.props;

    if (this.props.params.id === 'new') {
      try {
        const res = await minDelay(this.props.publishEventAsync(event, adminToken), 1000);
        console.log('RES EDITOR', res);
        browserHistory.push(`${PREFIX_URL}/admin/edit/${res.id}`);
      } catch (error) {
        console.log(error);
        toast.error('Jotain meni pieleen - tapahtuman luonti epäonnistui. / Something went wrong… failed creating event.', { autoClose: 2000 });
      }
      this.setState({
        eventPublishing: false,
      });
    } else {
      try {
        await minDelay(this.props.updateEventAsync(event, adminToken), 1000);
        toast.success('Muutoksesi tallennettiin onnistuneesti! / Your changes were saved!', { autoClose: 2000 });
      } catch (error) {
        console.log(error);
        toast.error('Jotain meni pieleen - tapahtuman päivittäminen epäonnistui. / Something went wrong… failed updating event.', { autoClose: 2000 });
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
            defaultValue="Tallenna luonnoksena / Save as draft"
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
            defaultValue="Julkaise / Publish"
            onClick={() => this.publishEvent(false)}
          />
          <input
            disabled={!this.state.isValid || this.props.eventPublishLoading}
            className="btn btn-info event-editor--animated"
            formNoValidate
            type="submit"
            defaultValue="Tallenna muutokset / Save changes"
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
          defaultValue="Muuta luonnokseksi / Turn to draft"
          onClick={() => this.publishEvent(true)}
        />
        <input
          disabled={!this.state.isValid || this.props.eventPublishLoading}
          className="btn btn-info event-editor--animated"
          formNoValidate
          type="submit"
          defaultValue="Tallenna muutokset / Save changes"
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
          Tähdellä merkityt kentät ovat pakollisia / Fields with an asterisk are required
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
            <h1>Hups, jotain meni pieleen / Oops, something went wrong</h1>
            <p>{`Tapahtumaa id:llä "${this.props.params.id}" ei löytynyt / Event not found with the id "${this.props.params.id}"`}</p>
            <Link to={`${PREFIX_URL}/admin/`}>Palaa tapahtumalistaukseen / Go back to event listing</Link>
          </div>
        </div>
      );
    }

    return (
      <div className="event-editor">
        <Link to={`${PREFIX_URL}/admin`}>&#8592; Takaisin / Back</Link>
        <Formsy.Form
          onValid={() => this.setValidState(true)}
          onInvalid={() => this.setValidState(false)}
          className="form-horizontal col-xs-12 col-md-10 col-md-offset-1"
        >
          <h1>{isNewEvent ? 'Luo uusi tapahtuma / New event' : 'Muokkaa tapahtumaa / Edit event'}</h1>
          {this.renderButtons()}
          <ul className="event-editor--nav nav nav-tabs">
            <li className={this.state.activeTab === 1 ? 'active' : ''}>
              <a onClick={() => this.changeTab(1)}>Perustiedot / Basic info</a>
            </li>
            <li className={this.state.activeTab === 2 ? 'active' : ''}>
              <a onClick={() => this.changeTab(2)}>Ilmoittautumisasetukset / Participant settings</a>
            </li>
            <li className={this.state.activeTab === 3 ? 'active' : ''}>
              <a onClick={() => this.changeTab(3)}>Kysymykset / Questions</a>
            </li>
            <li className={this.state.activeTab === 4 ? 'active' : ''}>
              <a onClick={() => this.changeTab(4)}>Sähköposti / Email</a>
            </li>
            <li className={this.state.activeTab === 5 ? 'active' : ''}>
              <a onClick={() => this.changeTab(5)}>Ilmoittautuneet / Participants</a>
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
              <SignupsTab event={this.props.event} deleteSignup={this.props.deleteSignup} />
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
  deleteSignup: AdminSignupActions.deleteSignupAsync,
};

const mapStateToProps = state => ({
  event: state.editor.event,
  eventLoading: state.editor.eventLoading,
  eventError: state.editor.eventError,
  eventPublishLoading: state.editor.eventPublishLoading,
  eventPublishError: state.editor.eventPublishError,
  adminToken: state.admin.accessToken,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);
