import React from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import { connect } from 'react-redux';

import { loginUser } from '../modules/login';

class Login extends React.Component {
  render() {
    return (
      <div className="container" style={{ maxWidth: '400px' }}>
        <h1>Kirjaudu</h1>
        {this.props.loginError ? <p>Kirjautuminen epäonnistui</p> : ''}
        <Formsy.Form>
          <Input id="email" value="" label="Sähköposti" name="email" title="Sähköposti" placeholder="ville@athene.fi" layout="vertical" required />
          <Input id="password" value="" label="Salasana" name="password" title="Salasana" type="password" placeholder="••••••••" layout="vertical" required />
              <button
            className="btn btn-default"
            onClick={() => this.props.loginUser({
              email: document.getElementById('email').value,
              password: document.getElementById('password').value,
            })}
          >
            Kirjaudu
          </button>
        </Formsy.Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginError: state.login.errorMessage,
});

const mapDispatchToProps = {
  loginUser,
};

Login.propTypes = {
  loginError: React.PropTypes.string,
  loginUser: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
