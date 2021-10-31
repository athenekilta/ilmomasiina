import React, { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';
import { Button, Modal } from 'react-bootstrap';

import { editConflictDismissed, reloadEvent } from '../../../modules/editor/actions';
import { EditorEvent } from '../../../modules/editor/types';
import { useTypedDispatch, useTypedSelector } from '../../../store/reducers';

const EditConflictModal = () => {
  const dispatch = useTypedDispatch();
  const modal = useTypedSelector((state) => state.editor.editConflictModal);

  const deletedQuestions = modal?.deletedQuestions || [];
  const deletedQuotas = modal?.deletedQuotas || [];

  const { values: { questions, quotas }, setFieldValue, submitForm } = useFormikContext<EditorEvent>();

  // Another ugly hack. Formik doesn't provide a facility to modify fields and then reliably submit them, due to it
  // storing its data in an internal useReducer. setFieldValue() followed by submitForm() _seems_ to work, but isn't
  // guaranteed; therefore, we setFieldValue() here and submitForm() on the next render.
  const [submitOverwrite, setSubmitOverwrite] = useState(false);

  useEffect(() => {
    if (submitOverwrite) {
      setSubmitOverwrite(false);
      submitForm();
    }
  }, [submitOverwrite, submitForm]);

  function overwrite() {
    setFieldValue(
      'questions',
      questions.map((question) => {
        if (!question.id || !deletedQuestions.includes(question.id)) return question;
        return {
          ...question,
          id: undefined,
          key: `new-${Math.random()}`,
        };
      }),
    );
    setFieldValue(
      'quotas',
      quotas.map((quota) => {
        if (!quota.id || !deletedQuotas.includes(quota.id)) return quota;
        return {
          ...quota,
          id: undefined,
          key: `new-${Math.random()}`,
        };
      }),
    );
    dispatch(editConflictDismissed());
    setSubmitOverwrite(true);
  }

  function revert() {
    dispatch(reloadEvent());
    dispatch(editConflictDismissed());
  }

  return (
    <Modal
      show={!!modal}
      onHide={() => dispatch(editConflictDismissed())}
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>Päällekkäinen muokkaus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Toinen käyttäjä tai välilehti on poistanut seuraavat kiintiöt ja/tai kysymykset:
        </p>
        <ul>
          {questions
            .filter((question) => question.id && deletedQuestions.includes(question.id))
            .map((question) => (
              <li key={question.key}>
                <strong>Kysymys: </strong>
                {question.question}
              </li>
            ))}
          {quotas
            .filter((quota) => quota.id && deletedQuotas.includes(quota.id))
            .map((quota) => (
              <li key={quota.key}>
                <strong>Kiintiö: </strong>
                {quota.title}
              </li>
            ))}
        </ul>
        <p>
          Voit tallentaa tapahtuman ja ylikirjoittaa toisen käyttäjän muutokset, tai hylätä tekemäsi
          muutokset ja jatkaa toisen käyttäjän muokkaamasta tapahtumasta.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="muted" onClick={() => dispatch(editConflictDismissed())}>Peruuta</Button>
        <Button variant="secondary" onClick={revert}>Hylkää muutokset</Button>
        <Button variant="warning" onClick={overwrite}>Ylikirjoita</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditConflictModal;
