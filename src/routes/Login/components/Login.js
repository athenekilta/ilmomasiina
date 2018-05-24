import React from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import { connect } from 'react-redux';

import './Login.scss';
import { loginUser } from '../modules/login';

class Login extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Login</h1>
        { this.props.loginError
          ? <div> {this.props.loginError.body} </div>
          : ''
        }
        <div className="Login col-xs-8 col-md-6 align-self-center">
          <Formsy.Form className="credentials">
            <Input id="email" value="" label="Sähköposti" name="email" title="Email" required />
            <Input id="password" value="" label="Salasana" name="password" title="Password" type="password" required />
            <div className="nuppi">
              <button
                className="nappi btn-success col-xs-3"
                onClick={() => this.props.loginUser({
                  username: document.getElementById('email').value,
                  password: document.getElementById('password').value,
                })}
              >
                Kirjaudu
              </button>
            </div>
          </Formsy.Form>
        </div>
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
