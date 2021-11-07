import React, { useEffect, useRef } from 'react';

import { Formik, FormikHelpers } from 'formik';
import { Container, Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  getEvent, newEvent, publishEventUpdate, publishNewEvent, resetState, serverEventToEditor,
} from '../../modules/editor/actions';
import { selectFormData as selectInitialFormData } from '../../modules/editor/selectors';
import { EditorEvent } from '../../modules/editor/types';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import EditForm from './components/EditForm';

import './Editor.scss';

export interface EditorSubmitOptions {
  saveAsDraft: boolean | undefined;
  allowMoveToQueue: boolean;
}

interface MatchParams {
  id: string;
}

type Props = RouteComponentProps<MatchParams>;

const Editor = ({ history, match }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, isNew, loadError,
  } = useTypedSelector((state) => state.editor, shallowEqual);
  const initialFormData = useTypedSelector(selectInitialFormData);

  const urlEventId = match.params.id;
  const urlIsNew = urlEventId === 'new';

  useEffect(() => {
    if (urlIsNew) {
      dispatch(newEvent());
    } else {
      dispatch(getEvent(urlEventId));
    }
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, urlIsNew, urlEventId]);

  // Ugly hack, but Formik doesn't really give us a clean way to pass data from submitForm() to onSubmit().
  // If we call setFieldValue("draft", ...) and then submitForm(), the data won't be propagated.
  const submitOptions = useRef<EditorSubmitOptions>({
    saveAsDraft: undefined,
    allowMoveToQueue: false,
  });

  async function onSubmit(data: EditorEvent, { setSubmitting, setFieldValue }: FormikHelpers<EditorEvent>) {
    // Consume the "Proceed, move signups to queue" button click, if any.
    const moveToQueue = submitOptions.current.allowMoveToQueue;
    submitOptions.current.allowMoveToQueue = false;

    // Set draft state from last submit button pressed if any, otherwise keep it as-is.
    const draft = submitOptions.current.saveAsDraft ?? (event?.draft || isNew);
    const modifiedEvent = {
      ...data,
      draft,
    };

    try {
      let saved;
      if (isNew) {
        saved = await dispatch(publishNewEvent(modifiedEvent));
        history.push(`${PREFIX_URL}/admin/edit/${saved.id}`);
        toast.success('Tapahtuma luotiin onnistuneesti!', {
          autoClose: 2000,
        });
      } else {
        saved = await dispatch(publishEventUpdate(event!.id, modifiedEvent, moveToQueue));
        if (saved) {
          toast.success('Muutoksesi tallennettiin onnistuneesti!', {
            autoClose: 2000,
          });
        }
      }
      // Update questions/quotas to get IDs from the server
      if (saved) {
        const newFormData = serverEventToEditor(saved);
        setFieldValue('updatedAt', saved.updatedAt);
        setFieldValue('quotas', newFormData.quotas);
        setFieldValue('questions', newFormData.questions);
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
          <p>{`Tapahtumaa id:llä "${urlEventId}" ei löytynyt`}</p>
          <Link to={`${PREFIX_URL}/admin/`}>Palaa tapahtumalistaukseen</Link>
        </div>
      </Container>
    );
  }

  if (!urlIsNew && !event) {
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
        initialValues={initialFormData!}
        onSubmit={onSubmit}
      >
        {(props) => <EditForm {...props} submitOptions={submitOptions} />}
      </Formik>
    </Container>
  );
};

// Editor.whyDidYouRender = true;

export default Editor;
