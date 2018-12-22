import React from 'react';
import './Header.scss';
import { browserHistory } from 'react-router'

export const Header = () => (
  <div className="navbar navbar-default">
    <div className="container">
      <a onClick={() => browserHistory.push('/')} className="navbar-brand"> Athenen ilmomasiina</a>
    </div>
  </div>
);

export default Header;
