import React, { useEffect, useState } from 'react';

import { Formik, FormikHelpers } from 'formik';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from 'theme-ui';

import {
  getEvent, loaded, publishEventUpdate, publishNewEvent, resetState,
} from '../../modules/editor/actions';
import { EditorEvent } from '../../modules/editor/types';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import BasicDetailsTab from './components/BasicDetailsTab';
import EmailsTab from './components/EmailsTab';
import QuestionsTab from './components/QuestionsTab';
import QuotasTab from './components/QuotasTab';
import SignupsTab from './components/SignupsTab';
import EditorTabs, { EditorTabId } from './EditorTabs';
import EditorToolbar from './EditorToolbar';

import './Editor.scss';

interface MatchParams {
  id: string;
}

interface EditSignupProps {}

type Props = EditSignupProps & RouteComponentProps<MatchParams>;

const defaultEvent = (): EditorEvent => ({
  title: '',
  date: '',
  webpageUrl: '',
  facebookUrl: '',
  location: '',
  description: '',
  price: '',
  signupsPublic: false,

  registrationStartDate: '',
  verificationEmail: '',

  openQuotaSize: 0,
  useOpenQuota: false,
  quotas: [
    {
      id: 0,
      title: 'Kiintiö',
      size: 20,
    },
  ],

  questions: [],

  registrationEndDate: '',

  draft: true,
});

const Editor = ({ history, match }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, formData, loadError,
  } = useTypedSelector(
    (state) => state.editor,
    shallowEqual,
  );

  const [activeTab, setActiveTab] = useState<EditorTabId>(1);

  useEffect(() => {
    const eventId = match.params.id;
    if (eventId !== 'new') {
      dispatch(loaded(null, defaultEvent()));
    } else {
      dispatch(getEvent(eventId));
    }
    return () => {
      dispatch(resetState());
    };
  }, []);

  async function onSubmit(data: EditorEvent, { setSubmitting }: FormikHelpers<EditorEvent>) {
    const modifiedEvent = {
      ...data,
      quota: data.quotas,
      draft: data.draft || match.params.id === 'new',
    };

    try {
      if (match.params.id === 'new') {
        const newEvent = await dispatch(publishNewEvent(modifiedEvent));
        history.push(`${PREFIX_URL}/admin/edit/${newEvent.id}`);
      } else {
        await dispatch(publishEventUpdate(event!.id, modifiedEvent));
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
    setSubmitting(false);
  }

  if (loadError) {
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

  if (!event) {
    return (
      <div className="event-editor">
        <div className="event-editor--loading-container">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="event-editor" role="tablist">
      <Formik
        initialValues={formData!}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="form-horizontal col-xs-12 col-md-10 col-md-offset-1"
          >
            <EditorToolbar isNew={match.params.id === 'new'} />
            <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="event-editor--valid-notice collapsed">
              <span>
                <b>*</b>
                Tähdellä merkityt kentät ovat pakollisia
              </span>
            </div>
            <div className="tab-content">
              <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`} role="tabpanel" id="editor-tab-1">
                <BasicDetailsTab />
              </div>
              <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`} role="tabpanel" id="editor-tab-2">
                <QuotasTab />
              </div>
              <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`} role="tabpanel" id="editor-tab-3">
                <QuestionsTab />
              </div>
              <div className={`tab-pane ${activeTab === 4 ? 'active' : ''}`} role="tabpanel" id="editor-tab-4">
                <EmailsTab />
              </div>
              <div className={`tab-pane ${activeTab === 5 ? 'active' : ''}`} role="tabpanel" id="editor-tab-5">
                <SignupsTab />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

// Editor.whyDidYouRender = true;

export default Editor;
