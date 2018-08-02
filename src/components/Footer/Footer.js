import React from 'react';
import { Link } from 'react-router';
import Separator from '../Separator';
import './Footer.scss';

export const Footer = () => (
  <footer className="page-footer">
    <div className='container'>
      <Link to='/admin' className='navbar-link'>Hallinta</Link>
      <Separator />
      <Link to='https://athene.fi' className='navbar-link'>Athene.fi</Link>
    </div>
  </footer>
);

export default Footer;
