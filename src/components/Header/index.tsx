import React from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';

import { redirectToLogin } from '../../modules/admin/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

import './Header.scss';

interface HeaderProps {}

type Props = HeaderProps & RouteComponentProps;

const Header = (props: Props) => {
  const { history } = props;

  const dispatch = useTypedDispatch();
  const loggedIn = useTypedSelector(state => state.admin.loggedIn);

  return (
    <div className="navbar navbar-default">
      <div className="container">
        <a
          onClick={() => history.push(`${PREFIX_URL}/`)}
          className="navbar-brand"
        >
          {BRANDING_HEADER_TITLE}
        </a>
        {loggedIn && (
          <a
            onClick={() => dispatch(redirectToLogin())}
            className="navbar-brand"
            style={{ float: 'right' }}
          >
            Logout
          </a>
        )}
      </div>
    </div>
  );
};

export default withRouter(Header);
