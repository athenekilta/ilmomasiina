import React from 'react';

import { Link } from 'react-router-dom';

import { paths } from '@tietokilta/ilmomasiina-components/src/config/paths';

const PageNotFound = () => (
  <div className="ilmo--status-container">
    <h1>404</h1>
    <p>
      Sivua ei löydy.
    </p>
    <p>
      <Link to={paths().eventsList}>Palaa tapahtumalistaukseen</Link>
    </p>
  </div>
);

export default PageNotFound;
