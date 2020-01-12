import React, { useEffect, useState } from 'react';

import { Form } from 'formsy-react-components';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import Spinner from 'react-spinkit';
import { toast } from 'react-toastify';

import { deleteSignupAsync } from '../../modules/admin/actions';
import {
  getEventAsync,
  publishEventAsync,
  setEvent,
  updateEventAsync,
  updateEventField
} from '../../modules/editor/actions';
import { Event } from '../../modules/types';
import { AppState } from '../../store/types';
import BasicDetailsTab from './components/BasicDetailsTab';
import EmailsTab from './components/EmailsTab';
import QuestionsTab from './components/QuestionsTab';
import QuotasTab from './components/QuotasTab';
import SignupsTab from './components/SignupsTab';

import './Editor.scss';

interface MatchParams {
  id: string;
  editToken: string;
}

interface EditSignupProps {}

type Props = EditSignupProps &
  LinkStateProps &
  LinkDispatchProps &
  RouteComponentProps<MatchParams>;

async function minDelay(func, ms = 1000) {
  const res = await Promise.all([
    func,
    new Promise(resolve => setTimeout(resolve, ms))
  ]);
  return res[0];
}

const Editor = (props: Props) => {
  const {
    adminToken,
    deleteSignup,
    event,
    eventError,
    eventLoading,
    eventPublishLoading,
    eventPublishError,
    getEventAsync,
    history,
    match,
    publishEventAsync,
    setEvent,
    updateEventAsync,
    updateEventField
  } = props;
  const [activeTab, setActiveTab] = useState(1);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const eventId = match.params.id;

    if (eventId === 'new') {
      // New event, clear any existing one from redux;
      setEvent({});

      // Set base quota field
      updateEventField('quota', [
        {
          id: 0,
          title: 'Kiintiö',
          size: 20,
          existsInDb: false
        }
      ]);
      updateEventField('questions', []);
    } else {
      getEventAsync(eventId, adminToken);
    }
  }, []);

  const isNewEvent = match.params.id === 'new';

  async function publishEvent(isDraft = false) {
    const { adminToken } = props;
    const event = {
      ...props.event,
      draft: isDraft
    };

    if (match.params.id === 'new') {
      try {
        const res = await minDelay(publishEventAsync(event, adminToken), 1000);
        history.push(`${PREFIX_URL}/admin/edit/${res.id}`);
      } catch (error) {
        toast.error('Jotain meni pieleen - tapahtuman luonti epäonnistui.', {
          autoClose: 2000
        });
      }
    } else {
      try {
        await minDelay(updateEventAsync(event, adminToken), 1000);
        toast.success('Muutoksesi tallennettiin onnistuneesti!', {
          autoClose: 2000
        });
      } catch (error) {
        toast.error(
          'Jotain meni pieleen - tapahtuman päivittäminen epäonnistui.',
          { autoClose: 2000 }
        );
      }
    }
  }

  if (eventLoading) {
    return (
      <div className="event-editor">
        <div className="event-editor--loading-container">
          <Spinner name="circle" fadeIn="quarter" />
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="event-editor">
        <div className="event-editor--loading-container">
          <h1>Hups, jotain meni pieleen</h1>
          <p>{`Tapahtumaa id:llä "${match.params.id}" ei löytynyt`}</p>
          <Link to={`${PREFIX_URL}/admin/`}>Palaa tapahtumalistaukseen</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="event-editor">
      <Link to={`${PREFIX_URL}/admin`}>&#8592; Takaisin</Link>
      <Form
        onValid={() => setIsValid(true)}
        onInvalid={() => setIsValid(false)}
        className="form-horizontal col-xs-12 col-md-10 col-md-offset-1"
      >
        <h1>{isNewEvent ? 'Luo uusi tapahtuma' : 'Muokkaa tapahtumaa'}</h1>

        {match.params.id == 'new' && (
          <div className="pull-right event-editor--buttons-wrapper">
            {eventPublishLoading ? (
              <Spinner name="circle" fadeIn="quarter" />
            ) : null}
            <input
              disabled={!isValid || eventPublishLoading}
              className="btn btn-info pull-right event-editor--animated"
              formNoValidate
              type="submit"
              value="Tallenna luonnoksena"
              onClick={() => publishEvent(true)}
            />
          </div>
        )}
        {event.draft && (
          <div className="pull-right event-editor--buttons-wrapper">
            {eventPublishLoading ? (
              <Spinner name="circle" fadeIn="quarter" />
            ) : null}
            <div className="event-editor--public-status">
              <div className="event-editor--bubble draft event-editor--animated" />
              <span>Luonnos</span>
            </div>
            <input
              disabled={!isValid || eventPublishLoading}
              className="btn btn-success event-editor--animated"
              formNoValidate
              type="submit"
              value="Julkaise"
              onClick={() => publishEvent(false)}
            />
            <input
              disabled={!isValid || eventPublishLoading}
              className="btn btn-info event-editor--animated"
              formNoValidate
              type="submit"
              value="Tallenna muutokset"
              onClick={() => publishEvent(event.draft)}
            />
          </div>
        )}
        <ul className="event-editor--nav nav nav-tabs">
          <li className={activeTab === 1 ? 'active' : undefined}>
            <a onClick={() => setActiveTab(1)}>Perustiedot</a>
          </li>
          <li className={activeTab === 2 ? 'active' : undefined}>
            <a onClick={() => setActiveTab(2)}>Ilmoittautumisasetukset</a>
          </li>
          <li className={activeTab === 3 ? 'active' : undefined}>
            <a onClick={() => setActiveTab(3)}>Kysymykset</a>
          </li>
          <li className={activeTab === 4 ? 'active' : undefined}>
            <a onClick={() => setActiveTab(4)}>Vahvistusviestit</a>
          </li>
          <li className={activeTab === 5 ? 'active' : undefined}>
            <a onClick={() => setActiveTab(5)}>Ilmoittautuneet</a>
          </li>
        </ul>

        <div
          className={
            isValid
              ? 'event-editor--valid-notice collapsed'
              : 'event-editor--valid-notice'
          }
        >
          <span>
            <b>*</b>
            Tähdellä merkityt kentät ovat pakollisia
          </span>
        </div>
        <div className="tab-content">
          <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`}>
            <BasicDetailsTab
              event={event}
              onDataChange={(field, value) => updateEventField(field, value)}
            />
          </div>
          <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`}>
            <QuotasTab
              event={event}
              onDataChange={(field, value) => updateEventField(field, value)}
            />
          </div>
          <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`}>
            <QuestionsTab
              event={event}
              onDataChange={(field, value) => updateEventField(field, value)}
            />
          </div>
          <div className={`tab-pane ${activeTab === 4 ? 'active' : ''}`}>
            <EmailsTab
              event={event}
              onDataChange={(field, value) => updateEventField(field, value)}
            />
          </div>
          <div className={`tab-pane ${activeTab === 5 ? 'active' : ''}`}>
            <SignupsTab event={event} deleteSignup={deleteSignup} />
          </div>
        </div>
      </Form>
    </div>
  );
};

interface LinkStateProps {
  event: Event | {};
  eventLoading: boolean;
  eventError: boolean;
  eventPublishLoading: boolean;
  eventPublishError: boolean;
  adminToken: string;
}

interface LinkDispatchProps {
  publishEventAsync: (data: any, token: string) => Event;
  updateEventAsync: (data: any, token: string) => Event;
  getEventAsync: (eventId: string, token: string) => Event;
  setEvent: (event: Event) => void;
  updateEventField: (field: string, value: any) => void;
  deleteSignup: (id: string, eventId: string) => boolean;
}

const mapStateToProps = (state: AppState) => ({
  event: state.editor.event,
  eventLoading: state.editor.eventLoading,
  eventError: state.editor.eventError,
  eventPublishLoading: state.editor.eventPublishLoading,
  eventPublishError: state.editor.eventPublishError,
  adminToken: state.admin.accessToken
});

const mapDispatchToProps = dispatch => ({
  publishEventAsync: publishEventAsync,
  updateEventAsync: updateEventAsync,
  getEventAsync: getEventAsync,
  setEvent: (event: Event) => dispatch(setEvent(event)),
  updateEventField: (field: string, value: any) =>
    dispatch(updateEventField(field, value)),
  deleteSignup: deleteSignupAsync
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Editor));
