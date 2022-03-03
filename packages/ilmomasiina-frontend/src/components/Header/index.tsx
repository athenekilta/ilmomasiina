import React from 'react';

import { Button, Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Branding } from '../../branding';
import { redirectToLogin } from '../../modules/auth/actions';
import paths from '../../paths';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

import './Header.scss';

type Props = {
  branding: Branding;
};

const Header = ({ branding }: Props) => {
  const dispatch = useTypedDispatch();
  const loggedIn = useTypedSelector((state) => state.auth.loggedIn);

  return (
    <Navbar>
      <Container>
        <Link to={paths.eventsList} className="navbar-brand">
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
