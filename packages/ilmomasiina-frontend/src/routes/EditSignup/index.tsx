import React from 'react';

import { Button, Container, Spinner } from 'react-bootstrap';
import { Link, RouteComponentProps } from 'react-router-dom';

import paths from '../../paths';
import EditForm from './components/EditForm';
import NarrowContainer from './components/NarrowContainer';
import { Provider, useEditSignupState, useStateAndDispatch } from './state';

const EditSignupView = () => {
  const [{
    deleted, error, pending, event,
  }] = useStateAndDispatch();

  if (error) {
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

  if (pending) {
    return (
      <Container className="text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

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

  if (event!.registrationEndDate === null || new Date(event!.registrationEndDate) < new Date()) {
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
      <EditForm />
    </Container>
  );
};

export interface MatchParams {
  id: string;
  editToken: string;
}

const EditSignup = ({ match }: RouteComponentProps<MatchParams>) => {
  const state = useEditSignupState(match.params);
  return (
    <Provider state={state}>
      <EditSignupView />
    </Provider>
  );
};

export default EditSignup;
