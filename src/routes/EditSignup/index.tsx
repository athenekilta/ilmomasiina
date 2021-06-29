import React, { useEffect } from 'react';

import { Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Signup } from '../../api/signups';
import {
  deleteSignup,
  getSignupAndEvent,
  resetState,
  updateSignup,
} from '../../modules/editSignup/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import EditForm from './components/EditForm';

import './EditSignup.scss';

interface MatchParams {
  id: string;
  editToken: string;
}

const EditSignup = ({ match }: RouteComponentProps<MatchParams>) => {
  const dispatch = useTypedDispatch();
  const {
    event, loadError, deleted, signup,
  } = useTypedSelector((state) => state.editSignup, shallowEqual);

  useEffect(() => {
    const { id, editToken } = match.params;
    dispatch(getSignupAndEvent(id, editToken));
    return () => {
      dispatch(resetState());
    };
  }, []);

  if (deleted) {
    return (
      <div className="container align-items-center">
        <div className="EditSignup--wrapper">
          <h1>Ilmoittautumisesi poistettiin onnistuneesti</h1>
          <Link to={`${PREFIX_URL}/`} className="btn btn-default">
            Takaisin etusivulle
          </Link>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container align-items-center">
        <div className="EditSignup--wrapper">
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Ilmoittautumistasi ei löytynyt. Se saattaa olla jo poistettu, tai
            sitten jotain muuta kummallista tapahtui. Jos ilmoittautumisesi ei
            ole vielä poistunut, yritä kohta uudestaan.
          </p>
        </div>
      </div>
    );
  }

  if (!event || !signup) {
    return (
      <div className="container align-items-center">
        <div className="EditSignup--wrapper">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  if (new Date(event.registrationEndDate) < new Date()) {
    return (
      <div className="container align-items-center">
        <div className="EditSignup--wrapper">
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman
            ilmoittautuminen on sulkeutunut.
          </p>
          <Link to={`${PREFIX_URL}/`} className="btn btn-default">
            Takaisin etusivulle
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(answers: Signup.Update.Body) {
    const progressToast = toast.info('Ilmoittautuminen käynnissä', {});

    const success = await dispatch(updateSignup(signup!.id, answers, match.params.editToken));

    if (success) {
      toast.update(progressToast, {
        render: 'Muokkaus onnistui!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
    } else {
      toast.update(progressToast, {
        render: 'Muokkaus ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    }
  }

  function onDelete() {
    dispatch(deleteSignup(signup!.id, match.params.editToken));
  }

  return (
    <div className="container align-items-center">
      <EditForm submitForm={onSubmit} />
      <div className="EditSignup--wrapper">
        <h2>Poista ilmoittautuminen</h2>
        <p>
          Oletko varma, että haluat poistaa ilmoittautumisesi tapahtumaan
          {' '}
          <strong>
            {event.title}
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
        <button type="button" onClick={onDelete} className="btn btn-danger">
          Poista ilmoittautuminen
        </button>
      </div>
    </div>
  );
};

export default EditSignup;
