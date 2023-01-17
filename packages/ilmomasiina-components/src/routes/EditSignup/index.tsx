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
