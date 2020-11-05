import React from 'react';
import { IndexLink } from 'react-router';

const PageNotFound = () => (
  <div className="container text-center">
    <h1>Error 404 😢</h1>
    <p>Sivua ei löydy. Tapahtuma on varmaan vanhentunut ja poistettu näkyvistä.</p>
    <p>Page not found. The event has probably expired or was removed.</p>
    <p>
      <IndexLink to={`${PREFIX_URL}/`}>Palaa etusivulle / To home page</IndexLink>
    </p>
  </div>
);

export default PageNotFound;
