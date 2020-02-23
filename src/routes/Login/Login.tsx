/** @jsx jsx */
import { Button, Container, Input, Label } from '@theme-ui/components';
import { useForm } from 'react-hook-form';
import { jsx } from 'theme-ui';

import { login } from '../../modules/admin/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

interface LoginProps {}

type FormData = {
  email: string;
  password: string;
};

type Props = LoginProp;

const Login = (props: Props) => {
  const { register, handleSubmit, errors } = useForm<FormData>();

  const dispatch = useTypedDispatch();
  const { loginLoading, loginError } = useTypedSelector(state => state.admin);

  const onSubmit = data => {
    const { email, password } = data;
    dispatch(login(email, password));
  };

  return (
    <Container sx={{ variant: 'layout.container.loginContainer' }}>
      <h1>Kirjaudu</h1>
      {loginError && <p sx={{ color: 'error' }}>Kirjautuminen epäonnistui</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Label sx={{ variant: 'forms.label.login' }} htmlFor="email">
          Sähköposti
        </Label>
        <Input
          sx={errors.email && { variant: 'forms.input.error' }}
          name="email"
          type="email"
          placeholder="admin@athene.fi"
          ref={register({ required: true })}
        />
        {errors.email && <p>Tämä kenttä vaaditaan</p>}
        <Label sx={{ variant: 'forms.label.login' }} htmlFor="password">
          Salasana
        </Label>
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

export default Login;
