import React from 'react';

import { Link } from 'react-router-dom';

const PageNotFound = () => (
  <div className="container text-center">
    <h1>404</h1>
    <p>
      Sivua ei löydy.
    </p>
    <p>
      <Link to={`${PREFIX_URL}/`}>Palaa etusivulle</Link>
    </p>
  </div>
);

export default PageNotFound;
