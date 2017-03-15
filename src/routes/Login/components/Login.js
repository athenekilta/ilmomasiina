import React from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';

const Login = () => (
  <div className="container">
    <div className="col-xs-12 col-sm-8 col-md-6">
      <h1>Kirjaudu sisään</h1>
      <Formsy.Form>
        <Input label="Sähköposti" name="email" title="Sähköposti" required />
        <Input label="Salasana" name="password" title="Salasana" type="password" required />
        <p><button className="btn btn-primary btn-lg" type="submit">Kirjaudu</button></p>
        <p><a>Unohditko salasanasi?</a></p>
      </Formsy.Form>
    </div>
  </div>
);

export default Login;
