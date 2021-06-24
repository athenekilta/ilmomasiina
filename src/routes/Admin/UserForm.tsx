/** @jsx jsx */
import { FormEventHandler } from 'react';

import { Field, Formik, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import {
  Box, Button, Input, jsx, Spinner,
} from 'theme-ui';

import { createUser } from '../../modules/admin/actions';
import { useTypedDispatch } from '../../store/reducers';

type FormData = {
  email: string;
};

const UserForm = () => {
  const dispatch = useTypedDispatch();

  const onSubmit = async (data: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
    // TODO: better error handling
    const success = await dispatch(createUser(data));
    if (success) {
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
        <Box
          sx={{
            maxWidth: 256,
          }}
          as="form"
          onSubmit={handleSubmit as any as FormEventHandler<HTMLDivElement>}
        >
          <Field
            as={Input}
            name="email"
            id="email"
            type="email"
            placeholder="Sähköposti"
            aria-label="Sähköposti"
          />
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : 'Luo uusi käyttäjä'}
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default UserForm;
