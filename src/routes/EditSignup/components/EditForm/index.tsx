import React from 'react';

import { Field, Formik, FormikHelpers } from 'formik';
import { Form, Row } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

import { Signup } from '../../../../api/signups';
import QuestionFields from '../../../../components/QuestionFields';
import { useTypedSelector } from '../../../../store/reducers';

import './EditForm.scss';

interface Props {
  submitForm: (answers: Signup.Update.Body) => Promise<void>;
}

const EditForm = ({ submitForm }: Props) => {
  const { event, signup, submitError } = useTypedSelector((state) => state.editSignup, shallowEqual);

  async function onSubmit(answers: Signup.Update.Body, { setSubmitting }: FormikHelpers<Signup.Update.Body>) {
    await submitForm(answers);
    setSubmitting(false);
  }

  return (
    <Formik
      initialValues={signup! as Signup.Update.Body}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <div className="form-wrapper">
          <div className="container">
            <div className="col-xs-12 col-md-8 col-md-offset-2">
              {submitError && (
                <p style={{ color: '#a94442' }}>
                  Ilmoittautumisessasi on virheitä.
                </p>
              )}
              <h2>Muokkaa ilmoittautumista</h2>
              <form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="firstName">
                  <Form.Label column sm="3">Etunimi</Form.Label>
                  <Field
                    as={Form.Control}
                    name="firstName"
                    type="text"
                    placeholder="Etunimi"
                    disabled
                  />
                </Form.Group>
                <Form.Group as={Row} controlId="lastName">
                  <Form.Label column sm="3">Sukunimi</Form.Label>
                  <Field
                    as={Form.Control}
                    name="lastName"
                    type="text"
                    placeholder="Sukunimi"
                    disabled
                  />
                </Form.Group>
                <Form.Group as={Row} controlId="email">
                  <Form.Label column sm="3">Sähköposti</Form.Label>
                  <Field
                    as={Form.Control}
                    name="email"
                    type="text"
                    placeholder="Sähköpostisi"
                    disabled
                  />
                </Form.Group>

                <QuestionFields name="answers" questions={event!.questions} />

                <div className="input-wrapper pull-right">
                  <button
                    type="submit"
                    className="btn btn-primary pull-right"
                    formNoValidate
                  >
                    Päivitä
                  </button>
                </div>
                <Link className="btn btn-link pull-right" to={`${PREFIX_URL}/`}>
                  Peruuta
                </Link>
              </form>
            </div>
            <div className="cf" />
          </div>
        </div>
      )}
    </Formik>
  );
};

export default EditForm;
