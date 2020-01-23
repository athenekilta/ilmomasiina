import React, { useEffect } from 'react';

import { Spinner } from '@theme-ui/components';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  deleteSignupAsync,
  getSignupAndEventAsync,
  resetEventState
} from '../../modules/editSignup/actions';
import {
  completeSignupAsync,
  CompleteSignupData,
  updateEventAsync
} from '../../modules/singleEvent/actions';
import { Event, Signup } from '../../modules/types';
import { AppState, DispatchAction } from '../../store/types';
import EditForm from './components/EditForm';

import './EditSignup.scss';

interface MatchParams {
  id: string;
  editToken: string;
}

interface EditSignupProps {}

type Props = EditSignupProps &
  LinkStateProps &
  LinkDispatchProps &
  RouteComponentProps<MatchParams>;

const EditSignup = (props: Props) => {
  const {
    event,
    deleted,
    deleteSignupAsync,
    error,
    getSignupAndEventAsync,
    loading,
    match,
    resetEventState,
    signup,
    updateSignupAsync,
    updateEventAsync
  } = props;

  useEffect(() => {
    return () => {
      resetEventState();
      const { id, editToken } = match.params;
      getSignupAndEventAsync(id, editToken);
    };
  }, []);

  function deleteSignup() {
    const { id, editToken } = match.params;
    deleteSignupAsync(id, editToken);
  }

  async function updateSignup(answers) {
    this.toastId = toast.info('Ilmoittautuminen käynnissä', {});

    const response = await updateSignupAsync(signup.id, {
      editToken: match.params.editToken,
      ...answers
    });

    const success = response === true;

    if (success) {
      toast.update(this.toastId, {
        render: 'Muokkaus onnistui!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000
      });

      updateEventAsync(event.id);
    } else {
      const toastText =
        'Muokkaus ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan.';
      toast.update(this.toastId, {
        render: toastText,
        type: toast.TYPE.ERROR,
        autoClose: 5000
      });
    }
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
  if (error) {
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

  if (loading) {
    return (
      <div className="container align-items-center">
        <div className="EditSignup--wrapper">
          <Spinner name="circle" fadeIn="quarter" />
        </div>
      </div>
    );
  }

  return (
    <div className="container align-items-center">
      <EditForm
        submitForm={updateSignup}
        signup={signup}
        event={event}
        questions={signup.answers}
        loading={loading}
      />
      <div className="EditSignup--wrapper">
        <h2>Poista ilmoittautuminen</h2>
        <p>
          Oletko varma että haluat poistaa ilmoittautumisesi tapahtumaan{' '}
          <strong>{event.title}?</strong>
        </p>
        <p>
          Jos poistat ilmoittautumisesi, menetät paikkasi jonossa. Jos kuitenkin
          muutat mielesi, voit aina ilmoittautua tapahtumaan uudelleen
          myöhemmin, mutta siirryt silloin jonon hännille.{' '}
          <strong>Tätä toimintoa ei voi perua.</strong>
        </p>
        <button onClick={deleteSignup} className="btn btn-danger">
          Poista ilmoittautuminen
        </button>
      </div>
    </div>
  );
};

interface LinkStateProps {
  event: Event | {};
  signup: Signup | {};
  loading: boolean;
  error: boolean;
  deleted: boolean;
}

interface LinkDispatchProps {
  updateEventAsync: (eventId: string) => void;
  updateSignupAsync: (
    signupId: string,
    data: CompleteSignupData
  ) => Promise<boolean>;
  getSignupAndEventAsync: (id: string, editToken: string) => Promise<boolean>;
  deleteSignupAsync: (id: string, editToken: string) => Promise<boolean>;
  resetEventState: () => void;
}

const mapStateToProps = (state: AppState) => ({
  event: state.editSignup.event,
  signup: state.editSignup.signup,
  error: state.editSignup.error,
  loading: state.editSignup.loading,
  deleted: state.editSignup.deleted
});

const mapDispatchToProps = (dispatch: DispatchAction) => ({
  updateEventAsync: updateEventAsync,
  updateSignupAsync: completeSignupAsync,
  getSignupAndEventAsync: getSignupAndEventAsync,
  deleteSignupAsync: deleteSignupAsync,
  resetEventState: dispatch(resetEventState)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSignup);
