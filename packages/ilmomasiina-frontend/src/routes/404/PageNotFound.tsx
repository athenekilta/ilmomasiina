import React from 'react';

import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import paths from '../../paths';

const PageNotFound = () => (
  <Container className="text-center">
    <h1>404</h1>
    <p>
      Sivua ei löydy.
    </p>
    <p>
      <Link to={paths.eventsList}>Palaa tapahtumalistaukseen</Link>
    </p>
  </Container>
);

export default PageNotFound;
