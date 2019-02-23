import React from 'react';
import { browserHistory } from 'react-router'
import './Footer.scss';

export const Footer = () => (
  <footer className="page-footer">
    <div className='container'>
      <a onClick={() => browserHistory.push('/admin')}> Hallinta</a>
      <a href='https://athene.fi/hallinto/materiaalit/' className='navbar-link'>Tietosuoja</a>
      <a href='https://athene.fi' className='navbar-link'>Athene.fi</a>
      {process.env.NODE_ENV != "production" ? <p style={{ color: "#b1b107", marginLeft: "3rem", display: "inline" }}> DEV </p> : ""}
    </div>
  </footer >
);

export default Footer;
