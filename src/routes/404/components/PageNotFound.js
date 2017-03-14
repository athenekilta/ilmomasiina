import React from 'react';
import { IndexLink } from 'react-router';

const PageNotFound = () => (
  <div className="container text-center">
    <h1>Virhe 404</h1>
    <p>Sivua ei löydy. Tapahtuma on varmaan vanhentunut ja poistettu näkyvistä.</p>
    <p><IndexLink to='/'>Palaa etusivulle</IndexLink></p>
  </div>
);

export default PageNotFound;
