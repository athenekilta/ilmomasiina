import React, { useEffect, useState } from 'react';

import { Spinner } from '@theme-ui/components';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { deleteSignupAsync } from '../../modules/admin/actions';
import {
  clearEvent,
  getEvent,
  publishEvent,
  updateEventEditor,
  updateEventField
} from '../../modules/editor/actions';
import { Event } from '../../modules/types';
import { AppState } from '../../store/types';
import BasicDetailsTab from './components/BasicDetailsTab';
import EmailsTab from './components/EmailsTab';
import QuestionsTab from './components/QuestionsTab';
import QuotasTab from './components/QuotasTab';
import SignupsTab from './components/SignupsTab';
import EditorTabs from './EditorTabs';

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

const baseQuota = [
  {
    id: 0,
    title: 'Kiintiö',
    size: 20,
    existsInDb: false
  }
];

const Editor = (props: Props) => {
  const {
    adminToken,
    deleteSignup,
    event,
    eventError,
    eventLoading,
    eventPublishLoading,
    eventPublishError,
    getEvent,
    history,
    match,
    publishEvent,
    clearEvent,
    updateEventEditor,
    updateEventField
  } = props;
  const formMethods = useForm();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    errors
  } = formMethods;
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const eventId = match.params.id;
    if (eventId === 'new') {
      updateEventField('quota', baseQuota);
      updateEventField('questions', []);
    } else {
      getEvent(eventId, adminToken);
    }
    return () => clearEvent({});
  }, []);

  function publish(isDraft = false) {
    const { adminToken } = props;
    const event = {
      ...props.event,
      draft: isDraft
    };

    console.log(event);

    if (match.params.id === 'new') {
      try {
        const res = publishEvent(event, adminToken);
        history.push(`${PREFIX_URL}/admin/edit/${res.id}`);
      } catch (error) {
        toast.error('Jotain meni pieleen - tapahtuman luonti epäonnistui.', {
          autoClose: 2000
        });
      }
    } else {
      try {
        updateEventEditor(event, adminToken);
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
          <Spinner />
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
      <form className="form-horizontal col-xs-12 col-md-10 col-md-offset-1">
        <h1>
          {match.params.id === 'new'
            ? 'Luo uusi tapahtuma'
            : 'Muokkaa tapahtumaa'}
        </h1>

        <div className="pull-right event-editor--buttons-wrapper">
          {eventPublishLoading && <Spinner />}
          {match.params.id !== 'new' && (
            <>
              <div className="event-editor--public-status">
                <div className="event-editor--bubble draft event-editor--animated" />
                <span>Luonnos</span>
              </div>
              <input
                disabled={eventPublishLoading}
                className={
                  event.draft
                    ? 'btn btn-success event-editor--animated'
                    : 'btn btn-warning event-editor--animated'
                }
                formNoValidate
                onClick={() => (event.draft ? publish(false) : publish(true))}
                value={event.draft ? 'Julkaise' : 'Muuta luonnokseksi'}
              />
            </>
          )}
          <input
            disabled={eventPublishLoading}
            className="btn btn-info event-editor--animated"
            formNoValidate
            onClick={() =>
              match.params.id == 'new' ? publish(event.draft) : publish(true)
            }
            value={
              match.params.id == 'new'
                ? 'Tallenna luonnoksena'
                : 'Tallenna muutokset'
            }
          />
        </div>
        <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className={'event-editor--valid-notice collapsed'}>
          <span>
            <b>*</b>
            Tähdellä merkityt kentät ovat pakollisia
          </span>
        </div>
        <div className="tab-content">
          <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`}>
            <BasicDetailsTab
              event={event}
              formMethods={formMethods}
              updateEventField={updateEventField}
            />
          </div>
          <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`}>
            <QuotasTab
              event={event}
              formMethods={formMethods}
              updateEventField={updateEventField}
            />
          </div>
          <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`}>
            <QuestionsTab event={event} updateEventField={updateEventField} />
          </div>
          <div className={`tab-pane ${activeTab === 4 ? 'active' : ''}`}>
            <EmailsTab event={event} register={register} />
          </div>
          <div className={`tab-pane ${activeTab === 5 ? 'active' : ''}`}>
            <SignupsTab event={event} deleteSignup={deleteSignup} />
          </div>
        </div>
      </form>
    </div>
  );
};

interface LinkStateProps {
  event: Event;
  eventLoading: boolean;
  eventError: boolean;
  eventPublishLoading: boolean;
  eventPublishError: boolean;
  adminToken: string;
}

interface LinkDispatchProps {
  publishEvent: (data: any, token: string) => Event;
  updateEventEditor: (data: any, token: string) => Event;
  getEvent: (eventId: string, token: string) => Event;
  clearEvent: (event: Event) => void;
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

const mapDispatchToProps = {
  publishEvent: publishEvent,
  updateEventEditor: updateEventEditor,
  getEvent: getEvent,
  clearEvent: clearEvent,
  updateEventField: updateEventField,
  deleteSignup: deleteSignupAsync
};

// Editor.whyDidYouRender = true;

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
