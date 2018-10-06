import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as AdminActions from '../modules/admin/actions';

function requireAuth(WrappedComponent) {
  class Comp extends Component {
    static propTypes = {
      accessToken: PropTypes.string.isRequired,
      redirectToLogin: PropTypes.func.isRequired,
    };

    render() {
      console.log('TOKEN', this.props.accessToken);
      if (!this.props.accessToken) {
        this.props.redirectToLogin();
        return null;
      }
      return <WrappedComponent />;
    }
  }

  const mapStateToProps = state => ({
    accessToken: state.admin.accessToken,
  });

  const mapDispatchToProps = {
    redirectToLogin: AdminActions.redirectToLogin,
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Comp);
}

export default requireAuth;
