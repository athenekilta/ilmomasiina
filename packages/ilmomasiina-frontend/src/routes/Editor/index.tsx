import React, { useEffect, useRef } from 'react';

import { Formik, FormikHelpers } from 'formik';
import { Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fullPaths } from '@tietokilta/ilmomasiina-components/src/config/paths';
import requireAuth from '../../containers/requireAuth';
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

const Editor = () => {
  const dispatch = useTypedDispatch();
  const {
    event, isNew, loadError,
  } = useTypedSelector((state) => state.editor, shallowEqual);
  const initialFormData = useTypedSelector(selectInitialFormData);
  const history = useHistory();

  const urlEventId = useParams<MatchParams>().id;
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
        history.push(fullPaths().adminEditEvent(saved.id));
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
      <div className="ilmo--loading-container">
        <h1>Hups, jotain meni pieleen</h1>
        <p>{`Tapahtumaa id:llä "${urlEventId}" ei löytynyt`}</p>
        <Link to={fullPaths().adminEventsList}>Palaa tapahtumalistaukseen</Link>
      </div>
    );
  }

  if (!urlIsNew && !event) {
    return (
      <>
        <h1>Muokkaa tapahtumaa</h1>
        <Link to={fullPaths().adminEventsList}>&#8592; Takaisin</Link>
        <div className="ilmo--loading-container">
          <Spinner animation="border" />
        </div>
      </>
    );
  }

  return (
    <Formik
      initialValues={initialFormData!}
      onSubmit={onSubmit}
    >
      {(props) => <EditForm {...props} submitOptions={submitOptions} />}
    </Formik>
  );
};

// Editor.whyDidYouRender = true;

export default requireAuth(Editor);
