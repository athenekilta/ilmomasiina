import React from 'react';
import { browserHistory } from 'react-router'
import './Footer.scss';

export const Footer = () => (
  <footer className="page-footer">
    <div className='container'>
      <a onClick={() => browserHistory.push('/admin')}> Hallinta</a>
      <a href={BRANDING_FOOTER_GDPR_LINK} className='navbar-link'>{BRANDING_FOOTER_GDPR_TEXT}</a>
      <a href={BRANDING_FOOTER_HOME_LINK} className='navbar-link'>{BRANDING_FOOTER_HOME_TEXT}</a>
    </div>
  </footer>
);

export default Footer;
