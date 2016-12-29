import React from 'react';
import { Link } from 'react-router';
import Separator from '../Separator';
import './Footer.scss';

export const Footer = () => (
  <footer>
    <div className='container'>
      <Link to='/admin' className='navbar-link'>Hallinta</Link>
      <Separator />
      <Link to='https://athene.fi' className='navbar-link'>Athene.fi</Link>
      <span className='pull-right'>On ilmoja pidelly</span>
    </div>
  </footer>
);

export default Footer;
