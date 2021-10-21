import React, { useEffect, useRef, useState } from 'react';

import { Formik, FormikHelpers } from 'formik';
import { Container, Form, Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  getEvent, newEvent, publishEventUpdate, publishNewEvent, resetState,
} from '../../modules/editor/actions';
import { EditorEvent } from '../../modules/editor/types';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import BasicDetailsTab from './components/BasicDetailsTab';
import EditorTabBody from './components/EditorTabBody';
import EditorTabHeader, { EditorTab } from './components/EditorTabHeader';
import EditorToolbar from './components/EditorToolbar';
import EmailsTab from './components/EmailsTab';
import QuestionsTab from './components/QuestionsTab';
import QuotasTab from './components/QuotasTab';
import SignupsTab from './components/SignupsTab';

import './Editor.scss';

interface MatchParams {
  id: string;
}

interface EditSignupProps {}

type Props = EditSignupProps & RouteComponentProps<MatchParams>;

const Editor = ({ history, match }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, formData, isNew, loadError,
  } = useTypedSelector(
    (state) => state.editor,
    shallowEqual,
  );

  const eventId = match.params.id;

  const [activeTab, setActiveTab] = useState<EditorTab>(EditorTab.BASIC_DETAILS);

  useEffect(() => {
    if (eventId === 'new') {
      dispatch(newEvent());
    } else {
      dispatch(getEvent(eventId));
    }
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, eventId]);

  // Ugly hack, but Formik doesn't really give us a clean way to
  // call setFieldValue("draft", ...) and then submit once that has propagated.
  const saveAsDraft = useRef<boolean | undefined>();

  async function onSubmit(data: EditorEvent, { setSubmitting }: FormikHelpers<EditorEvent>) {
    // Set draft state from last submit button pressed if any, otherwise keep it as-is.
    const draft = saveAsDraft.current ?? (event?.draft || isNew);
    const modifiedEvent = {
      ...data,
      draft,
    };

    try {
      if (isNew) {
        const created = await dispatch(publishNewEvent(modifiedEvent));
        history.push(`${PREFIX_URL}/admin/edit/${created.id}`);
        toast.success('Tapahtuma luotiin onnistuneesti!', {
          autoClose: 2000,
        });
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
      <Container className="event-editor">
        <div className="event-editor--loading-container">
          <h1>Hups, jotain meni pieleen</h1>
          <p>{`Tapahtumaa id:llä "${eventId}" ei löytynyt`}</p>
          <Link to={`${PREFIX_URL}/admin/`}>Palaa tapahtumalistaukseen</Link>
        </div>
      </Container>
    );
  }

  if (!formData) {
    return (
      <Container className="event-editor">
        <div className="event-editor--loading-container">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="event-editor" role="tablist">
      <Formik
        initialValues={formData!}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, submitForm }) => {
          function onSubmitClick(asDraft: boolean) {
            saveAsDraft.current = asDraft;
            submitForm();
          }

          return (
            <Form onSubmit={handleSubmit}>
              <EditorToolbar onSubmitClick={onSubmitClick} />
              <EditorTabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="event-editor--valid-notice collapsed">
                <span>
                  <b>*</b>
                  Tähdellä merkityt kentät ovat pakollisia
                </span>
              </div>
              <div className="tab-content">
                <EditorTabBody id={EditorTab.BASIC_DETAILS} activeTab={activeTab} component={BasicDetailsTab} />
                <EditorTabBody id={EditorTab.QUOTAS} activeTab={activeTab} component={QuotasTab} />
                <EditorTabBody id={EditorTab.QUESTIONS} activeTab={activeTab} component={QuestionsTab} />
                <EditorTabBody id={EditorTab.EMAILS} activeTab={activeTab} component={EmailsTab} />
                <EditorTabBody id={EditorTab.SIGNUPS} activeTab={activeTab} component={SignupsTab} />
              </div>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

// Editor.whyDidYouRender = true;

export default Editor;
