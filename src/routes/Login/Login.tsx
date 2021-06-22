/** @jsx jsx */
import {
  Button, Container, Input, Label,
} from '@theme-ui/components';
import { Field, Formik, FormikHelpers } from 'formik';
import { jsx } from 'theme-ui';

import { login } from '../../modules/admin/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const dispatch = useTypedDispatch();
  const { loginError } = useTypedSelector((state) => state.admin);

  async function onSubmit(data: FormData, { setSubmitting }: FormikHelpers<FormData>) {
    const { email, password } = data;
    await dispatch(login(email, password));
    setSubmitting(false);
  }

  return (
    <Container sx={{ variant: 'layout.container.loginContainer' }}>
      <h1>Kirjaudu</h1>
      {loginError && (
        <p sx={{ color: 'error' }}>Kirjautuminen epäonnistui</p>
      )}
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Label sx={{ variant: 'forms.label.login' }} htmlFor="email">
              Sähköposti
            </Label>
            <Field
              as={Input}
              name="email"
              id="email"
              type="email"
              placeholder="admin@athene.fi"
              sx={errors.email && { variant: 'forms.input.error' }}
            />
            {errors.email && <p>Tämä kenttä vaaditaan</p>}
            <Label sx={{ variant: 'forms.label.login' }} htmlFor="password">
              Salasana
            </Label>
            <Field
              as={Input}
              name="password"
              id="password"
              type="password"
              placeholder="••••••••"
              sx={errors.password && { variant: 'forms.input.error' }}
            />
            {errors.password && <p>Tämä kenttä vaaditaan</p>}
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              Kirjaudu
            </Button>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
