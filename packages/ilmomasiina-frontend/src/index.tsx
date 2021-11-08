import React from 'react';

import * as Sentry from '@sentry/browser';
import ReactDOM from 'react-dom';

import AppContainer from './containers/AppContainer';

if (!PROD) {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

if (PROD && SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN });
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));
