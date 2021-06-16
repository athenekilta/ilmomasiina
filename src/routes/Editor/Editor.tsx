import React, { useEffect, useState } from 'react';

import { Spinner } from '@theme-ui/components';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  clearEvent,
  getEvent,
  publishEvent,
  updateEventEditor,
  updateEventField,
} from '../../modules/editor/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import BasicDetailsTab from './components/BasicDetailsTab';
import EmailsTab from './components/EmailsTab';
import QuestionsTab from './components/QuestionsTab';
import QuotasTab from './components/QuotasTab';
import SignupsTab from './components/SignupsTab';
import EditorTabs from './EditorTabs';
import EditorToolbar from './EditorToolbar';

import './Editor.scss';

interface MatchParams {
  id: string;
  editToken: string;
}

interface EditSignupProps {}

type Props = EditSignupProps & RouteComponentProps<MatchParams>;

const baseQuota = [
  {
    id: 0,
    title: 'Kiintiö',
    size: 20,
    existsInDb: false,
  },
];

const Editor = (props: Props) => {
  const { history, match } = props;

  const dispatch = useTypedDispatch();
  const { event, eventError, eventLoading } = useTypedSelector(
    (state) => state.editor,
    shallowEqual,
  );
  const adminToken = useTypedSelector((state) => state.admin.accessToken);

  const formMethods = useForm({ defaultValues: event });
  const {
    register, handleSubmit, setValue, reset,
  } = formMethods;
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    // https://github.com/react-hook-form/react-hook-form/issues/1042
    if (event) {
      reset(event);
    }
  }, [event]);

  useEffect(() => {
    const fieldsToRegister = [
      'date',
      'registrationStartDate',
      'registrationEndDate',
    ];

    fieldsToRegister.forEach((field) => {
      register({ name: field }, { required: true });
      setValue(field, event[field]);
    });
  }, []);

  useEffect(() => {
    const eventId = match.params.id;
    if (eventId === 'new') {
      dispatch(updateEventField('quota', baseQuota));
      dispatch(updateEventField('questions', []));
    } else {
      dispatch(getEvent(eventId, adminToken));
    }
    return () => dispatch(clearEvent({}));
  }, []);

  function onSubmit(data) {
    let isDraft = false;
    if (match.params.id == 'new' || event.draft) {
      isDraft = true;
    }
    publish(data, isDraft);
  }

  function publish(data, isDraft = false) {
    const modifiedEvent = {
      ...data,
      questions: event.questions,
      quota: event.quota,
      id: Number(match.params.id),
      draft: isDraft,
    };

    try {
      if (match.params.id === 'new') {
        const res = dispatch(publishEvent(modifiedEvent, adminToken));
        history.push(`${PREFIX_URL}/admin/edit/${res.id}`);
      } else {
        dispatch(updateEventEditor(modifiedEvent, adminToken));
        toast.success('Muutoksesi tallennettiin onnistuneesti!', {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(
        'Jotain meni pieleen - tapahtuman päivittäminen epäonnistui.',
        { autoClose: 2000 },
      );
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-horizontal col-xs-12 col-md-10 col-md-offset-1"
      >
        <EditorToolbar publish={publish} />
        <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="event-editor--valid-notice collapsed">
          <span>
            <b>*</b>
            Tähdellä merkityt kentät ovat pakollisia
          </span>
        </div>
        <div className="tab-content">
          <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`}>
            <BasicDetailsTab event={event} formMethods={formMethods} />
          </div>
          <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`}>
            <QuotasTab event={event} formMethods={formMethods} />
          </div>
          <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`}>
            <QuestionsTab event={event} />
          </div>
          <div className={`tab-pane ${activeTab === 4 ? 'active' : ''}`}>
            <EmailsTab event={event} register={register} />
          </div>
          <div className={`tab-pane ${activeTab === 5 ? 'active' : ''}`}>
            <SignupsTab event={event} />
          </div>
        </div>
      </form>
    </div>
  );
};

// Editor.whyDidYouRender = true;

export default Editor;
