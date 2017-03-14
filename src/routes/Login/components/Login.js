import React from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import './Login.scss';

const Login = () => (
  <div className="container">
    <h1>Login</h1>
    <div className="Login col-xs-8 col-md-6 align-self-center">
      <Formsy.Form className="credentials">
        <Input value="" label="Sähköposti" name="email" title="Email" required />
        <Input value="" label="Salasana" name="password" title="Password" type="password" required />
        <div className="nuppi">
          <button className="nappi btn-success col-xs-3" type="submit">Kirjaudu</button>
        </div>
      </Formsy.Form>
    </div>
  </div>
);

export default Login;
