import React from 'react';

import { Spinner } from 'react-bootstrap';

import { useParams } from '../../config/router';
import { EditSignupProps, EditSignupProvider, useEditSignupContext } from '../../modules/editSignup';
import EditForm from './components/EditForm';
import NarrowContainer from './components/NarrowContainer';

const EditSignupView = () => {
  const { error, pending } = useEditSignupContext();

  if (error) {
    return (
      <NarrowContainer className="ilmo--status-container">
        <h1>Hups, jotain meni pieleen / Something went wrong</h1>
        <p>
          Ilmoittautumistasi ei löytynyt. Se saattaa olla jo poistettu, tai
          sitten jotain muuta kummallista tapahtui. Jos ilmoittautumisesi ei
          ole vielä poistunut, yritä kohta uudestaan. /
          Registration was not found. It may be already removed.
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

  // if (deleted) {
  //   return (
  //     <div className="ilmo--status-container">
  //       <h1>Ilmoittautumisesi poistettiin onnistuneesti / Registration deleted successfully</h1>
  //       <Button as={Link} to={paths().eventDetails(event!.slug)} variant="secondary">
  //         Takaisin / Back
  //       </Button>
  //     </div>
  //   );
  // }

  // if (event!.registrationEndDate === null || new Date(event!.registrationEndDate) < new Date()) {
  //   return (
  //     <NarrowContainer className="ilmo--status-container">
  //       <h1>Hups, jotain meni pieleen / Something went wrong</h1>
  //       <p>
  //         Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman
  //         ilmoittautuminen on sulkeutunut / Registration can't be edited or deleted
  //         as the signup is already closed.
  //       </p>
  //       <Button as={Link} to={paths().eventsList} variant="secondary">
  //         Takaisin etusivulle / Back to home page
  //       </Button>
  //     </NarrowContainer>
  //   );
  // }

  return <EditForm />;
};

const EditSignup = () => {
  const { id, editToken } = useParams<EditSignupProps>();
  return (
    <EditSignupProvider id={id} editToken={editToken}>
      <EditSignupView />
    </EditSignupProvider>
  );
};

export default EditSignup;
