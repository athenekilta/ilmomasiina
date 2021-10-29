import React from 'react';

import { Button, Modal } from 'react-bootstrap';

import { moveToQueueCanceled } from '../../../modules/editor/actions';
import { useTypedDispatch, useTypedSelector } from '../../../store/reducers';

type Props = {
  onProceed: () => void;
};

const MoveToQueueWarning = ({ onProceed }: Props) => {
  const dispatch = useTypedDispatch();
  const modal = useTypedSelector((state) => state.editor.moveToQueueModal);

  return (
    <Modal
      show={!!modal}
      onHide={() => dispatch(moveToQueueCanceled())}
    >
      <Modal.Header>
        <Modal.Title>Siirretäänkö ilmoittautumisia jonoon?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {'Tekemäsi muutokset kiintiöihin siirtävät vähintään '}
          {modal?.count || '?'}
          {' jo kiintiöön päässyttä ilmoittautumista jonoon. Käyttäjille ei ilmoiteta tästä automaattisesti.'}
        </p>
        <p>
          Haluatko varmasti jatkaa?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="muted" onClick={() => dispatch(moveToQueueCanceled())}>Peruuta</Button>
        <Button variant="danger" onClick={onProceed}>Jatka</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MoveToQueueWarning;
