import React, { useState } from "react";

import { Form, Input } from "formsy-react-components";
import { connect } from "react-redux";

import { login } from "../../modules/admin/actions";
import { AppState } from "../../store/types";

interface LoginProps {}

type Props = LoginProps & LinkStateProps & LinkDispatchProps;

const Login = (props: Props) => {
  const { loginError, loginLoading, login } = props;

  const [email, setEmail] = useState("");
  const [password, stePassword] = useState("");

  return (
    <div className="container" style={{ maxWidth: "400px" }}>
      <h1>Kirjaudu</h1>
      {loginError && <p>Kirjautuminen epäonnistui</p>}
      <Form>
        <Input
          value={email}
          onChange={(_key, value: string) => setEmail(value)}
          name="email"
          label="Sähköposti"
          title="Sähköposti"
          placeholder="admin@athene.fi"
          layout="vertical"
          required
        />
        <Input
          value={password}
          onChange={(_key, value: string) => stePassword(value)}
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
          onClick={e => {
            e.preventDefault();
            login(email, password);
          }}
        >
          Kirjaudu
        </button>
      </Form>
    </div>
  );
};

interface LinkStateProps {
  loginError: boolean;
  loginLoading: boolean;
}

interface LinkDispatchProps {
  login: (email: string, password: string) => void;
}

const mapStateToProps = (state: AppState) => ({
  loginError: state.admin.loginError,
  loginLoading: state.admin.loginLoading
});

const mapDispatchToProps = {
  login: login
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
