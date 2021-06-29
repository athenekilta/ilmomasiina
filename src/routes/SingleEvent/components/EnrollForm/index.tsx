import React from 'react';

import { Field, Formik, FormikHelpers } from 'formik';
import { Form } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';

import { Signup } from '../../../../api/signups';
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
      dispatch(getEvent(event!.id));
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
    dispatch(getEvent(event!.id));
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
        <div className="form-wrapper">
          <div className="container">
            <button type="button" className="close" onClick={() => cancel()} aria-label="Sulje" />
            <div className="col-xs-12 col-md-8 col-md-offset-2">
              {signupSubmitError && (
                <p className="text-invalid">Ilmoittautumisessasi on virheitä.</p>
              )}
              <h2>Ilmoittaudu</h2>

              <SignupStatus />

              <form onSubmit={handleSubmit}>
                <ul className="flex-outer">
                  <Form.Group as="li" controlId="firstName">
                    <Form.Label>Etunimi / First name</Form.Label>
                    <Field
                      as={Form.Control}
                      name="firstName"
                      type="text"
                      placeholder="Etunimi"
                    />
                  </Form.Group>
                  <Form.Group as="li" controlId="lastName">
                    <Form.Label>Sukunimi / Last name</Form.Label>
                    <Field
                      as={Form.Control}
                      name="lastName"
                      type="text"
                      placeholder="Sukunimi"
                    />
                  </Form.Group>
                  <Form.Group as="li" controlId="email">
                    <Form.Label>Sähköposti / Email</Form.Label>
                    <Field
                      as={Form.Control}
                      name="email"
                      type="email"
                      placeholder="Sähköpostisi"
                    />
                  </Form.Group>
                  <QuestionFields name="answers" questions={event!.questions} />
                </ul>

                <button
                  className="btn btn-primary pull-right"
                  formNoValidate
                  type="submit"
                  disabled={isSubmitting}
                >
                  Lähetä
                </button>
                <button type="button" className="btn btn-link pull-right" onClick={() => cancel()}>
                  Peruuta
                </button>
              </form>
            </div>
            <div className="cf" />
          </div>
        </div>
      )}
    </Formik>
  );
};

export default EnrollForm;
