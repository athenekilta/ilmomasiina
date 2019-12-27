import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as AdminActions from '../modules/admin/actions';

function requireAuth(WrappedComponent) {
  class Comp extends Component {
    static propTypes = {
      accessToken: PropTypes.string,
      accessTokenExpires: PropTypes.string,
      redirectToLogin: PropTypes.func.isRequired,
    };

    componentDidMount() {
      let { accessTokenExpires } = this.props;
      console.log(accessTokenExpires);
      if (!accessTokenExpires) {
        this.props.redirectToLogin();
      }
      if (typeof accessTokenExpires === 'string') {
        accessTokenExpires = new Date(accessTokenExpires);
      }
      if (accessTokenExpires < new Date()) {
        this.props.redirectToLogin();
      }
    }

    render() {
      console.log('TOKEN', this.props.accessToken);
      if (!this.props.accessToken) {
        this.props.redirectToLogin();
        return null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    accessToken: state.admin.accessToken,
    accessTokenExpires: state.admin.accessTokenExpires,
  });

  const mapDispatchToProps = {
    redirectToLogin: AdminActions.redirectToLogin,
  };

  return connect(mapStateToProps, mapDispatchToProps)(Comp);
}

export default requireAuth;
