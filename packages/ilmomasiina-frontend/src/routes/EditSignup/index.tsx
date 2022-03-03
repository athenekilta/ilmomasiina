import React, { useEffect } from 'react';

import { Button, Container, Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { getSignupAndEvent, resetState } from '../../modules/editSignup/actions';
import paths from '../../paths';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import DeleteSignup from './components/DeleteSignup';
import EditForm from './components/EditForm';
import NarrowContainer from './components/NarrowContainer';

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
      <Container className="text-center">
        <h1>Ilmoittautumisesi poistettiin onnistuneesti</h1>
        <Button as={Link} to={paths.eventDetails(event!.slug)} variant="secondary">
          Takaisin
        </Button>
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container className="text-center">
        <NarrowContainer>
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Ilmoittautumistasi ei löytynyt. Se saattaa olla jo poistettu, tai
            sitten jotain muuta kummallista tapahtui. Jos ilmoittautumisesi ei
            ole vielä poistunut, yritä kohta uudestaan.
          </p>
        </NarrowContainer>
      </Container>
    );
  }

  if (!event || !signup) {
    return (
      <Container className="text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (event.registrationEndDate === null || new Date(event.registrationEndDate) < new Date()) {
    return (
      <Container className="text-center">
        <NarrowContainer>
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman
            ilmoittautuminen on sulkeutunut.
          </p>
          <Button as={Link} to={paths.eventsList} variant="secondary">
            Takaisin etusivulle
          </Button>
        </NarrowContainer>
      </Container>
    );
  }

  return (
    <Container>
      <EditForm editToken={match.params.editToken} />
      <DeleteSignup editToken={match.params.editToken} />
    </Container>
  );
};

export default EditSignup;
