import React from 'react';

import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { redirectToLogin } from '../../modules/admin/actions';
import { AppState } from '../../store/types';

import './Header.scss';

interface HeaderProps {}

type Props = HeaderProps &
  LinkStateProps &
  LinkDispatchProps &
  RouteComponentProps;

const Header = (props: Props) => {
  const { loggedIn } = props;

  return (
    <div className="navbar navbar-default">
      <div className="container">
        <a
          onClick={() => props.history.push(`${PREFIX_URL}/`)}
          className="navbar-brand"
        >
          {' '}
          {BRANDING_HEADER_TITLE}
        </a>
        {loggedIn && (
          <a
            onClick={() => props.redirectToLogin()}
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

interface LinkStateProps {
  loggedIn: boolean;
}

interface LinkDispatchProps {
  redirectToLogin: () => void;
}

const mapStateToProps = (state: AppState) => ({
  loggedIn: state.admin.loggedIn
});

const mapDispatchToProps = {
  redirectToLogin
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
