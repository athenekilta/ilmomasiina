import React, { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { useStateAndDispatch } from '../../../modules/editSignup';
import { useDeleteSignup } from '../../../modules/editSignup/actions';

const DELETE_CONFIRM_MS = 4000;

const DeleteSignup = () => {
  const [{ event }] = useStateAndDispatch();
  const deleteSignup = useDeleteSignup();

  const { isSubmitting, setSubmitting } = useFormikContext();

  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (confirming) {
      const timer = setTimeout(() => setConfirming(false), DELETE_CONFIRM_MS);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [confirming]);

  async function doDelete() {
    try {
      setSubmitting(true);
      await deleteSignup();
    } catch (error) {
      setSubmitting(false);
      toast.error('Poisto epäonnistui', { autoClose: 5000 });
    }
  }

  function onDeleteClick() {
    if (confirming) {
      setConfirming(false);
      doDelete();
    } else {
      setConfirming(true);
    }
  }

  return (
    <div className="ilmo--delete-container">
      <h2>Poista ilmoittautuminen</h2>
      <p>
        Oletko varma, että haluat poistaa ilmoittautumisesi tapahtumaan
        {' '}
        <strong>
          {event!.title}
        </strong>
        ?
      </p>
      <p>
        Jos poistat ilmoittautumisesi, menetät paikkasi jonossa. Jos
        muutat mielesi, voit aina ilmoittautua tapahtumaan uudelleen
        myöhemmin, mutta siirryt silloin jonon hännille.
        {' '}
        <strong>Tätä toimintoa ei voi perua.</strong>
      </p>
      <Button type="button" disabled={isSubmitting} onClick={onDeleteClick} variant="danger">
        {confirming ? 'Paina uudelleen varmistukseksi\u2026' : 'Poista ilmoittautuminen'}
      </Button>
    </div>
  );
};

export default DeleteSignup;
