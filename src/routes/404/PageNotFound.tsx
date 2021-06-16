import React from 'react';

import { NavLink } from 'react-router-dom';

const PageNotFound = () => (
  <div className="container text-center">
    <h1>Virhe 404</h1>
    <p>
      Sivua ei löydy. Tapahtuma on varmaan vanhentunut ja poistettu näkyvistä.
    </p>
    <p>
      <NavLink to={`${PREFIX_URL}/`}>Palaa etusivulle</NavLink>
    </p>
  </div>
);

export default PageNotFound;
