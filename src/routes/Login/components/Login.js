import React from 'react';
import './Login.scss';
import Formsy from 'formsy-react';
import {Input} from 'formsy-react-components';

const Login = () => (
  <div className="container">
    <h1>Login</h1>
    <div className="Login col-xs-8 col-md-6 align-self-center">
      <Formsy.Form className="credentials">
        <Input value="" label="Sähköposti" name="email" title="Email" validations="isEmail" placeholder="Muotoa: cto@tietskarijengi.fi" validationError="This is not a valid email" required />
        <Input value="" label="Salasana" name="password" title="Password" type="password" validations="minLength:8" validationError="Password must be atleast 8 characters long" placeholder="Vähintään 8 merkkiä" required />
        <div className="nuppi">
          <button className="nappi btn-success col-xs-3" type="submit">Kirjaudu</button>
        </div>
      </Formsy.Form>
    </div>
  </div>
);

export default Login;
