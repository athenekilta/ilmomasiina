import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { redirectToLogin } from '../../modules/admin/actions';

import './Header.scss';

class Header extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    redirectToLogin: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="navbar navbar-default">
        <div className="container">
          <a
            onClick={() => this.props.history.push(`${PREFIX_URL}/`)}
            className="navbar-brand"
          >
            {' '}
            {BRANDING_HEADER_TITLE}
          </a>
          {this.props.loggedIn ? (
            <a
              onClick={() => this.props.redirectToLogin()}
              className="navbar-brand"
              style={{ float: 'right' }}
            >
              Logout
            </a>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  redirectToLogin,
};

const mapStateToProps = state => ({
  loggedIn: state.admin.loggedIn,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
