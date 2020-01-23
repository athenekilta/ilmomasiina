/** @jsx jsx */
import React from 'react';

import { Button, Container, Input, Label } from '@theme-ui/components';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { jsx } from 'theme-ui';

import { login } from '../../modules/admin/actions';
import { AppState } from '../../store/types';

interface LoginProps {}

type FormData = {
  email: string;
  password: string;
};

type Props = LoginProps & LinkStateProps & LinkDispatchProps;

const Login = (props: Props) => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const { loginError, loginLoading, login } = props;

  const onSubmit = data => {
    const { email, password } = data;
    login(email, password);
  };

  return (
    <Container sx={{ variant: 'layout.container.loginContainer' }}>
      <h1>Kirjaudu</h1>
      {loginError && <p sx={{ color: 'error' }}>Kirjautuminen epäonnistui</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Label htmlFor="email">Sähköposti</Label>
        <Input
          sx={errors.email && { variant: 'forms.input.error' }}
          name="email"
          type="email"
          placeholder="admin@athene.fi"
          ref={register({ required: true })}
        />
        {errors.email && <p>Tämä kenttä vaaditaan</p>}
        <Label htmlFor="password">Salasana</Label>
        <Input
          sx={errors.password && { variant: 'forms.input.error' }}
          name="password"
          type="password"
          placeholder="••••••••"
          ref={register({ required: true })}
        />
        {errors.password && <p>Tämä kenttä vaaditaan</p>}
        <Button type="submit" variant="secondary">
          Kirjaudu
        </Button>
      </form>
    </Container>
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
