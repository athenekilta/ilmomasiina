import React from 'react';

import { Formik, FormikHelpers } from 'formik';
import {
  Button, Col, Container, Form, Row,
} from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';

import { Signup } from '../../../../api/signups';
import FieldRow from '../../../../components/FieldRow';
import QuestionFields from '../../../../components/QuestionFields';
import { cancelPendingSignup, completeSignup, getEvent } from '../../../../modules/singleEvent/actions';
import { useTypedDispatch, useTypedSelector } from '../../../../store/reducers';
import SignupStatus from './SignupStatus';

import './EnrollForm.scss';

type Props = {
  closeForm: () => void;
};

const EnrollForm = ({ closeForm }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, signup, signupSubmitError,
  } = useTypedSelector((state) => state.singleEvent, shallowEqual);

  async function onSubmit(answers: Signup.Update.Body, { setSubmitting }: FormikHelpers<Signup.Update.Body>) {
    const progressToast = toast.info('Ilmoittautuminen käynnissä', {});

    const success = await dispatch(completeSignup(signup!.id, answers, signup!.editToken));

    if (success) {
      toast.update(progressToast, {
        render: 'Ilmoittautuminen onnistui!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      dispatch(getEvent(event!.slug));
      closeForm();
    } else {
      toast.update(progressToast, {
        render: 'Ilmoittautuminen ei onnistunut. Tarkista, että kaikki '
          + 'pakolliset kentät on täytetty ja yritä uudestaan.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    }
    setSubmitting(false);
  }

  async function cancel() {
    const close = window.confirm(
      'Oletko varma? Menetät paikkasi jonossa, jos suljet lomakkeen nyt.',
    );
    if (!close) return;

    dispatch(cancelPendingSignup(signup!.id, signup!.editToken));
    dispatch(getEvent(event!.slug));
    closeForm();
  }

  const emptySignup: Signup.Update.Body = {
    firstName: '',
    lastName: '',
    email: '',
    answers: [],
  };

  return (
    <Formik
      initialValues={emptySignup}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Container className="pt-5 position-relative">
          <button type="button" className="close" onClick={() => cancel()} aria-label="Sulje" />
          <Row className="justify-content-md-center">
            <Col xs="12" md="10" lg="8">
              {signupSubmitError && (
                <p className="text-invalid">Ilmoittautumisessasi on virheitä.</p>
              )}
              <h2>Ilmoittaudu</h2>

              <SignupStatus />

              <Form onSubmit={handleSubmit}>
                <FieldRow
                  name="firstName"
                  label="Etunimi / First name"
                  placeholder="Etunimi"
                  required
                />
                <FieldRow
                  name="lastName"
                  label="Sukunimi / Last name"
                  placeholder="Sukunimi"
                  help="Nimi on julkinen tieto. Voit halutessasi ilmoittautua tapahtumaan salanimellä."
                  required
                />
                <FieldRow
                  name="email"
                  label="Sähköposti / Email"
                  placeholder="Sähköpostisi"
                  required
                />
                <QuestionFields name="answers" questions={event!.questions} />

                <Button type="submit" variant="primary" className="float-right" formNoValidate disabled={isSubmitting}>
                  Lähetä
                </Button>
                <Button type="button" variant="link" className="float-right" onClick={() => cancel()}>
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

export default EnrollForm;
