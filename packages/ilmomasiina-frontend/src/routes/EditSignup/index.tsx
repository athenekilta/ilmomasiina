import React, { useEffect } from 'react';

import {
  Button, Col, Container, Row, Spinner,
} from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Signup } from '@tietokilta/ilmomasiina-api/src/services/signups';
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

type Props = RouteComponentProps<MatchParams>;

const EditSignup = ({ match }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, loadError, deleted, signup,
  } = useTypedSelector((state) => state.editSignup, shallowEqual);

  useEffect(() => {
    dispatch(getSignupAndEvent(match.params.id, match.params.editToken));
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, match.params.id, match.params.editToken]);

  if (deleted) {
    return (
      <Container className="align-items-center">
        <div className="EditSignup--wrapper">
          <h1>Ilmoittautumisesi poistettiin onnistuneesti</h1>
          <Button as={Link} to={`${PREFIX_URL}/`} variant="secondary">
            Takaisin etusivulle
          </Button>
        </div>
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container className="align-items-center">
        <div className="EditSignup--wrapper">
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Ilmoittautumistasi ei löytynyt. Se saattaa olla jo poistettu, tai
            sitten jotain muuta kummallista tapahtui. Jos ilmoittautumisesi ei
            ole vielä poistunut, yritä kohta uudestaan.
          </p>
        </div>
      </Container>
    );
  }

  if (!event || !signup) {
    return (
      <Container className="align-items-center">
        <div className="EditSignup--wrapper">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (event.registrationEndDate === null || new Date(event.registrationEndDate) < new Date()) {
    return (
      <Container className="align-items-center">
        <div className="EditSignup--wrapper">
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman
            ilmoittautuminen on sulkeutunut.
          </p>
          <Button as={Link} to={`${PREFIX_URL}/`} variant="secondary">
            Takaisin etusivulle
          </Button>
        </div>
      </Container>
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
    <Container>
      <EditForm submitForm={onSubmit} />
      <Row className="justify-content-md-center text-center my-5">
        <Col xs="12" md="10" lg="8">
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
        </Col>
      </Row>
    </Container>
  );
};

export default EditSignup;
