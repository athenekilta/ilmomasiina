import React from 'react';

import { Link } from 'react-router-dom';

import { Branding } from '../../branding';
import paths from '../../paths';

import './Footer.scss';

type Props = {
  branding: Branding;
};

const Footer = ({ branding }: Props) => (
  <footer className="page-footer">
    <div className="container">
      <Link to={paths.adminEventsList}>
        Hallinta
      </Link>
      <a href={branding.footerGdprLink} className="navbar-link">
        {branding.footerGdprText}
      </a>
      <a href={branding.footerHomeLink} className="navbar-link">
        {branding.footerHomeText}
      </a>
    </div>
  </footer>
);

export default Footer;
