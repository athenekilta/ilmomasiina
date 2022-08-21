import React from 'react';

import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { fullPaths } from '@tietokilta/ilmomasiina-components/src/config/paths';
import branding from '../../branding';

import './Footer.scss';

const Footer = () => (
  <footer>
    <Container>
      <Link to={fullPaths().adminEventsList}>
        Hallinta
      </Link>
      {branding.footerGdprText && (
        <a href={branding.footerGdprLink} target="_blank" rel="noreferrer">
          {branding.footerGdprText}
        </a>
      )}
      {branding.footerHomeText && (
        <a href={branding.footerHomeLink} target="_blank" rel="noreferrer">
          {branding.footerHomeText}
        </a>
      )}
    </Container>
  </footer>
);

export default Footer;
