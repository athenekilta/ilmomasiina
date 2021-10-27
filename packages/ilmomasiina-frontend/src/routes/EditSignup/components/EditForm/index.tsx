import React from 'react';

import { push } from 'connected-react-router';
import { Formik, FormikHelpers } from 'formik';
import {
  Button, Col, Form, Row,
} from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import FieldRow from '../../../../components/FieldRow';
import { updateSignup } from '../../../../modules/editSignup/actions';
import { useTypedDispatch, useTypedSelector } from '../../../../store/reducers';
import QuestionFields from '../QuestionFields';
import SignupStatus from './SignupStatus';

type Props = {
  editToken: string;
};

const EditForm = ({ editToken }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, signup, submitError, submitting,
  } = useTypedSelector((state) => state.editSignup, shallowEqual);
  const isNew = signup!.confirmedAt === null;

  async function onSubmit(answers: Signup.Update.Body, { setSubmitting }: FormikHelpers<Signup.Update.Body>) {
    const progressToast = toast.info('Ilmoittautuminen käynnissä', {});

    const success = await dispatch(updateSignup(signup!.id, answers, editToken));

    const action = isNew ? 'Ilmoittautuminen' : 'Muokkaus';
    if (success) {
      toast.update(progressToast, {
        render: `${action} onnistui!`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      if (isNew) dispatch(push(`${PREFIX_URL}/event/${event!.slug}`));
    } else {
      toast.update(progressToast, {
        render: `${action} ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
      setSubmitting(false);
    }
  }

  return (
    <Formik
      initialValues={signup! as Signup.Update.Body}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <Row className="justify-content-md-center">
          <Col xs="12" md="10" lg="8">
            <h2>{isNew ? 'Ilmoittaudu' : 'Muokkaa ilmoittautumista'}</h2>
            <SignupStatus />
            {submitError && (
              <p className="text-danger">Ilmoittautumisessasi on virheitä.</p>
            )}
            <Form onSubmit={handleSubmit}>
              <FieldRow
                name="firstName"
                label="Etunimi / First name"
                placeholder="Etunimi"
                required
                disabled={!isNew}
              />
              <FieldRow
                name="lastName"
                label="Sukunimi / Last name"
                placeholder="Sukunimi"
                help="Nimi on julkinen tieto. Voit halutessasi ilmoittautua tapahtumaan salanimellä."
                required
                disabled={!isNew}
              />
              <FieldRow
                name="email"
                label="Sähköposti / Email"
                placeholder="Sähköpostisi"
                required
                disabled={!isNew}
              />

              <QuestionFields name="answers" questions={event!.questions} />

              <Button type="submit" variant="primary" className="float-right" formNoValidate disabled={submitting}>
                {isNew ? 'Lähetä' : 'Päivitä'}
              </Button>
              {!isNew && (
                <Button as={Link} variant="link" className="float-right" to={`${PREFIX_URL}/event/${event!.slug}`}>
                  Peruuta
                </Button>
              )}
              <div className="clearfix" />
            </Form>
          </Col>
        </Row>
      )}
    </Formik>
  );
};

export default EditForm;
