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

const branding = {
  headerTitle: BRANDING_HEADER_TITLE_TEXT,
  footerGdprText: BRANDING_FOOTER_GDPR_TEXT,
  footerGdprLink: BRANDING_FOOTER_GDPR_LINK,
  footerHomeText: BRANDING_FOOTER_HOME_TEXT,
  footerHomeLink: BRANDING_FOOTER_HOME_LINK,
};

ReactDOM.render(<AppContainer branding={branding} />, document.getElementById('root'));
