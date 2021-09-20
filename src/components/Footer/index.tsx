import React from 'react';

import { Link } from 'react-router-dom';

import './Footer.scss';

const Footer = () => (
  <footer className="page-footer">
    <div className="container">
      <Link to={`${PREFIX_URL}/admin`}>
        Hallinta
      </Link>
      <a href={BRANDING_FOOTER_GDPR_LINK} className="navbar-link">
        {BRANDING_FOOTER_GDPR_TEXT}
      </a>
      <a href={BRANDING_FOOTER_HOME_LINK} className="navbar-link">
        {BRANDING_FOOTER_HOME_TEXT}
      </a>
    </div>
  </footer>
);

export default Footer;
