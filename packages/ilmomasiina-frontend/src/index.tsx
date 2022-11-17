import React, { useCallback } from 'react';

import * as Sentry from '@sentry/browser';
import ReactDOM from 'react-dom';
import { Link, useHistory, useParams } from 'react-router-dom';

import { configure } from '@tietokilta/ilmomasiina-components/src/config';
import AppContainer from './containers/AppContainer';
import { apiUrl } from './paths';

if (!PROD) {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

if (PROD && SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN });
}

configure({
  api: apiUrl,
  router: {
    Link,
    useParams,
    useNavigate() {
      const history = useHistory();
      return useCallback((url) => history.push(url), [history]);
    },
  },
  timezone: TIMEZONE,
});

ReactDOM.render(<AppContainer />, document.getElementById('root'));
