import React from 'react';

import { Field, Formik, FormikHelpers } from 'formik';
import { Button, Container, Form } from 'react-bootstrap';

import { login } from '../../modules/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const dispatch = useTypedDispatch();
  const { loginError } = useTypedSelector((state) => state.auth);

  async function onSubmit(data: FormData, { setSubmitting }: FormikHelpers<FormData>) {
    const { email, password } = data;
    await dispatch(login(email, password));
    setSubmitting(false);
  }

  return (
    <Container className="login-container">
      <h1>Kirjaudu</h1>
      {loginError && (
        <p className="text-invalid">Kirjautuminen epäonnistui</p>
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
            <Form.Label htmlFor="email"/* THEMEUI sx={{ variant: 'forms.label.login' }} */>
              Sähköposti
            </Form.Label>
            <Field
              as={Form.Control}
              name="email"
              id="email"
              type="email"
              placeholder="admin@athene.fi"
              isInvalid={errors.email}
            />
            {errors.email && <p>Tämä kenttä vaaditaan</p>}
            <Form.Label htmlFor="password"/* THEMEUI sx={{ variant: 'forms.label.login' }} */>
              Salasana
            </Form.Label>
            <Field
              as={Form.Control}
              name="password"
              id="password"
              type="password"
              placeholder="••••••••"
              isInvalid={errors.password}
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
