import React, { useCallback } from 'react';

import { useFormikContext } from 'formik';
import { toast } from 'react-toastify';

import ConfirmButton from '../../../components/ConfirmButton';
import { useNavigate } from '../../../config/router';
import { usePaths } from '../../../contexts';
import { useDeleteSignup, useEditSignupContext } from '../../../modules/editSignup';

const DELETE_CONFIRM_MS = 4000;

const DeleteSignup = () => {
  const { event } = useEditSignupContext();
  const deleteSignup = useDeleteSignup();
  const navigate = useNavigate();
  const paths = usePaths();

  const { isSubmitting, setSubmitting } = useFormikContext();

  const doDelete = useCallback(async () => {
    const progressToast = toast.loading('Ilmoittautumista poistetaan');
    try {
      setSubmitting(true);
      await deleteSignup();
      toast.update(progressToast, {
        render: 'Ilmoittautumisesi poistettiin onnistuneesti.',
        type: toast.TYPE.SUCCESS,
        closeButton: true,
        closeOnClick: true,
        isLoading: false,
      });
      navigate(paths.eventDetails(event!.slug));
    } catch (error) {
      setSubmitting(false);
      toast.update(progressToast, {
        render: 'Poisto epäonnistui.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
        isLoading: false,
      });
    }
  }, [deleteSignup, event, navigate, paths, setSubmitting]);

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
      <ConfirmButton
        type="button"
        disabled={isSubmitting}
        onClick={doDelete}
        variant="danger"
        confirmDelay={DELETE_CONFIRM_MS}
        confirmLabel="Paina uudelleen varmistukseksi&hellip;"
      >
        Poista ilmoittautuminen
      </ConfirmButton>
    </div>
  );
};

export default DeleteSignup;
