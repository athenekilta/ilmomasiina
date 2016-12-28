import React from 'react';
import { Link } from 'react-router';
import './Footer.scss';

export const Footer = () => (
  <footer>
    <div className='container'>
      <Link to='/admin' className='navbar-link'>Hallinta</Link>
      <span className='separator'>&middot;</span>
      <Link to='https://athene.fi' className='navbar-link'>Athene.fi</Link>
    </div>
  </footer>
);

export default Footer;
