import React from 'react';

import { Button, Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { paths } from '@tietokilta/ilmomasiina-components/src/config/paths';
import branding from '../../branding';
import { redirectToLogin } from '../../modules/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

import './Header.scss';

const Header = () => {
  const dispatch = useTypedDispatch();
  const loggedIn = useTypedSelector((state) => state.auth.loggedIn);

  return (
    <Navbar>
      <img alt="Logo" src={branding.headerLogoUrl} />
      <Container>
        <Link to={paths().eventsList} className="navbar-brand">
          {branding.headerTitle}
        </Link>
        {loggedIn && (
          <Button
            onClick={() => dispatch(redirectToLogin())}
          >
            Logout
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
