import React from 'react';

import { Field, Formik, FormikHelpers } from 'formik';
import {
  Alert,
  Button, Form, Spinner,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import { changePassword } from '../../modules/adminUsers/actions';
import { useTypedDispatch } from '../../store/reducers';

type FormData = {
  oldPassword: string;
  newPassword: string;
  newPasswordverify: string;
};

const ChangePasswordForm = () => {
  const dispatch = useTypedDispatch();

  const onSubmit = async (data: FormData, { setSubmitting, resetForm }: FormikHelpers<FormData>) => {
    // TODO: better error handling
    const success = await dispatch(changePassword(data));
    if (success) {
      resetForm();
      toast.success('Salasanan vaihto onnistui,', { autoClose: 5000 });
    } else {
      toast.error('Salasanan vaihto epäonnistui.', { autoClose: 5000 });
    }
    setSubmitting(false);
  };
  const validate = (values: FormData) => {
    const errors: Partial<FormData> = {};
    if (!values.oldPassword) {
      errors.oldPassword = 'Vaadittu';
    }
    if (!values.newPassword) {
      errors.newPassword = 'Vaadittu';
    }
    if (!values.newPasswordverify) {
      errors.newPasswordverify = 'Vaadittu';
    } else if (values.newPassword) {
      if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{10,}$/g).test(values.newPassword)) {
        errors.newPassword = 'Salasanan täytyy olla vähintään 10 merkkiä pitkä ja sisältää 1 iso, 1 pieni kirjain ja 1 numero';
      } else if (values.newPassword !== values.newPasswordverify) {
        errors.newPasswordverify = 'Salasanat eivät täsmää';
      }
    }
    return errors;
  };
  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        newPasswordverify: '',
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({
        errors, touched, isSubmitting, handleSubmit,
      }) => (

        <Form
          className="ilmo--form"
          onSubmit={handleSubmit}
        >
          <Field
            as={Form.Control}
            name="oldPassword"
            id="oldPassword"
            type="password"
            placeholder="Vanha salasana"
            aria-label="Vanha salasana"
          />
          {errors.oldPassword && touched.oldPassword ? (
            <Alert variant="danger">{errors.oldPassword}</Alert>
          ) : null}
          <Field
            as={Form.Control}
            name="newPassword"
            id="newPassword"
            type="password"
            placeholder="Uusi salasana"
            aria-label="Uusi salasana"
          />
          {errors.newPassword && touched.newPassword ? (
            <Alert variant="danger">{errors.newPassword}</Alert>
          ) : null}
          <Field
            as={Form.Control}
            name="newPasswordverify"
            id="newPasswordverify"
            type="password"
            placeholder="Uusi salasana"
            aria-label="Uusi salasana"
          />
          {errors.newPasswordverify && touched.newPasswordverify ? (
            <Alert variant="danger">{errors.newPasswordverify}</Alert>
          ) : null}
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" /> : 'Vaihda salasana'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
