import React from 'react';

import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Branding } from '../../branding';
import { fullPaths } from '../../paths';

import './Footer.scss';

type Props = {
  branding: Branding;
};

const Footer = ({ branding }: Props) => (
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
