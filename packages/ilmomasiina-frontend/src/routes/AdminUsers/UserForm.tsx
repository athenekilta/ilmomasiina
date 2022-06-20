import React from 'react';

import { Field, Formik, FormikHelpers } from 'formik';
import {
  Button, Form, Spinner,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import { createUser, getUsers } from '../../modules/adminUsers/actions';
import { useTypedDispatch } from '../../store/reducers';

type FormData = {
  email: string;
};

const UserForm = () => {
  const dispatch = useTypedDispatch();

  const onSubmit = async (data: FormData, { setSubmitting, resetForm }: FormikHelpers<FormData>) => {
    // TODO: better error handling
    const success = await dispatch(createUser(data));
    if (success) {
      dispatch(getUsers());
      resetForm();
      toast.success('Käyttäjän luominen onnistui,', { autoClose: 2000 });
    } else {
      toast.error('Käyttäjän luominen epäonnistui.', { autoClose: 2000 });
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form
          /* THEMEUI sx={{
            maxWidth: 256,
          }} */
          onSubmit={handleSubmit}
        >
          <Field
            as={Form.Control}
            name="email"
            id="email"
            type="email"
            placeholder="Sähköposti"
            aria-label="Sähköposti"
          />
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" /> : 'Luo uusi käyttäjä'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
