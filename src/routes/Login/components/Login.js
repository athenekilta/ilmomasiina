import React from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';

const Login = () => (
  <div className="container">
    <div className="col-xs-12 col-sm-8 col-md-6">
      <h1>Kirjaudu sisään</h1>
      <Formsy.Form>
        <Input value="" label="Sähköposti" name="email" title="Email" required />
        <Input value="" label="Salasana" name="password" title="Password" type="password" required />
        <p><button className="btn btn-primary btn-lg" type="submit">Kirjaudu</button></p>
        <p><a>Unohditko salasanasi?</a></p>
      </Formsy.Form>
    </div>
  </div>
);

export default Login;
