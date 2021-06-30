import React from 'react';

import { Formik, FormikHelpers } from 'formik';
import {
  Button, Col, Container, Form, Row,
} from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

import { Signup } from '../../../../api/signups';
import FieldRow from '../../../../components/FieldRow';
import QuestionFields from '../../../../components/QuestionFields';
import { useTypedSelector } from '../../../../store/reducers';

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
      {({ handleSubmit, isSubmitting }) => (
        <Container>
          <Row className="justify-content-md-center">
            <Col xs="12" md="10" lg="8">
              {submitError && (
                <p className="text-invalid">Ilmoittautumisessasi on virheitä.</p>
              )}
              <h2>Muokkaa ilmoittautumista</h2>
              <Form onSubmit={handleSubmit}>
                <FieldRow
                  name="firstName"
                  label="Etunimi / First name"
                  placeholder="Etunimi"
                  required
                  disabled
                />
                <FieldRow
                  name="lastName"
                  label="Sukunimi / Last name"
                  placeholder="Sukunimi"
                  required
                  disabled
                />
                <FieldRow
                  name="email"
                  label="Sähköposti / Email"
                  placeholder="Sähköpostisi"
                  required
                  disabled
                />

                <QuestionFields name="answers" questions={event!.questions} />

                <Button type="submit" variant="primary" className="float-right" formNoValidate disabled={isSubmitting}>
                  Päivitä
                </Button>
                <Button as={Link} variant="link" className="float-right" to={`${PREFIX_URL}/`}>
                  Peruuta
                </Button>
                <div className="clearfix" />
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </Formik>
  );
};

export default EditForm;
