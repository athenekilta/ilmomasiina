import React from 'react';

import { Link } from 'react-router-dom';

import { redirectToLogin } from '../../modules/admin/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

import './Header.scss';

const Header = () => {
  const dispatch = useTypedDispatch();
  const loggedIn = useTypedSelector((state) => state.admin.loggedIn);

  return (
    <div className="navbar navbar-default">
      <div className="container">
        <Link
          to={`${PREFIX_URL}/`}
          className="navbar-brand"
        >
          {BRANDING_HEADER_TITLE}
        </Link>
        {loggedIn && (
          <button
            type="button"
            onClick={() => dispatch(redirectToLogin())}
            className="btn" // TODO
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
