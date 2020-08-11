import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import { connect } from 'react-redux';

import * as AdminActions from '../../modules/admin/actions';

class Login extends React.Component {
  static propTypes = {
    loginError: PropTypes.bool,
    loginLoading: PropTypes.bool,
    login: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  render() {
    return (
      <div className="container" style={{ maxWidth: '400px' }}>
        <h1>Kirjaudu</h1>
        {this.props.loginError ? <p>Kirjautuminen epäonnistui</p> : ''}
        <Formsy.Form>
          <Input
            value={this.state.email}
            onChange={(key, value) => this.setState({ email: value })}
            name="email"
            label="Sähköposti"
            title="Sähköposti"
            placeholder="filip@fyysikko.fi"
            layout="vertical"
            required
          />
          <Input
            value={this.state.password}
            onChange={(key, value) => this.setState({ password: value })}
            name="password"
            label="Salasana"
            title="Salasana"
            type="password"
            placeholder="••••••••"
            layout="vertical"
            required
          />
          <button
            className="btn btn-default"
            onClick={(e) => {
              e.preventDefault();
              this.props.login(this.state.email, this.state.password);
            }}
          >
            Kirjaudu / Login
          </button>
        </Formsy.Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginError: state.admin.loginError,
  loginLoading: state.admin.loginLoading,
});

const mapDispatchToProps = {
  login: AdminActions.login,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
