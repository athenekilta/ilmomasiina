import React from 'react';

import { Button, Spinner } from 'react-bootstrap';

import { linkComponent, useParams } from '../../config/router';
import { usePaths } from '../../contexts/paths';
import { Provider, useEditSignupState, useStateAndDispatch } from '../../modules/editSignup';
import EditForm from './components/EditForm';
import NarrowContainer from './components/NarrowContainer';

const EditSignupView = () => {
  const [{
    deleted, error, pending, event,
  }] = useStateAndDispatch();
  const Link = linkComponent();
  const paths = usePaths();

  if (error) {
    return (
      <NarrowContainer className="ilmo--status-container">
        <h1>Hups, jotain meni pieleen</h1>
        <p>
          Ilmoittautumistasi ei löytynyt. Se saattaa olla jo poistettu, tai
          sitten jotain muuta kummallista tapahtui. Jos ilmoittautumisesi ei
          ole vielä poistunut, yritä kohta uudestaan.
        </p>
      </NarrowContainer>
    );
  }

  if (pending) {
    return (
      <div className="ilmo--loading-container">
        <Spinner animation="border" />
      </div>
    );
  }

  if (deleted) {
    return (
      <div className="ilmo--status-container">
        <h1>Ilmoittautumisesi poistettiin onnistuneesti</h1>
        <Button as={Link} to={paths.eventDetails(event!.slug)} variant="secondary">
          Takaisin
        </Button>
      </div>
    );
  }

  if (event!.registrationEndDate === null || new Date(event!.registrationEndDate) < new Date()) {
    return (
      <NarrowContainer className="ilmo--status-container">
        <h1>Hups, jotain meni pieleen</h1>
        <p>
          Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman
          ilmoittautuminen on sulkeutunut.
        </p>
        <Button as={Link} to={paths.eventsList} variant="secondary">
          Takaisin etusivulle
        </Button>
      </NarrowContainer>
    );
  }

  return <EditForm />;
};

export interface MatchParams {
  id: string;
  editToken: string;
}

const EditSignup = () => {
  const params = useParams<MatchParams>();
  const state = useEditSignupState(params);
  return (
    <Provider state={state}>
      <EditSignupView />
    </Provider>
  );
};

export default EditSignup;
