import React from 'react';

import * as Sentry from '@sentry/browser';
import ReactDOM from 'react-dom';

import 'react-dates/initialize';

import { sentryDsn } from '../config/ilmomasiina.config.js';
import AppContainer from './containers/AppContainer';

import 'react-dates/lib/css/_datepicker.css';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

if (PROD) {
  Sentry.init({ dsn: sentryDsn });
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));
