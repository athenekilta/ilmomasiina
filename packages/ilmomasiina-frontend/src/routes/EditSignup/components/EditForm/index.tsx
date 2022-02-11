import React from 'react';

import { push } from 'connected-react-router';
import { Formik, FormikHelpers } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import FieldRow from '../../../../components/FieldRow';
import { updateSignup } from '../../../../modules/editSignup/actions';
import paths from '../../../../paths';
import { useTypedDispatch, useTypedSelector } from '../../../../store/reducers';
import NarrowContainer from '../NarrowContainer';
import QuestionFields from './QuestionFields';
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
      if (isNew) dispatch(push(paths.eventDetails(event!.slug)));
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
        <NarrowContainer>
          <h2>{isNew ? 'Ilmoittaudu' : 'Muokkaa ilmoittautumista'}</h2>
          <SignupStatus />
          {submitError && (
            <p className="text-danger">Ilmoittautumisessasi on virheitä.</p>
          )}
          <Form onSubmit={handleSubmit}>
            {event!.nameQuestion && (
              <>
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
                  required
                  disabled={!isNew}
                />
                <FieldRow
                  name="namePublic"
                  as={Form.Check}
                  type="checkbox"
                  checkAlign
                  checkLabel={(
                    <>
                      Näytä nimi julkisessa osallistujalistassa
                      <br />
                      Show name in public participant list
                    </>
                  )}
                />
              </>
            )}
            {event!.emailQuestion && (
              <FieldRow
                name="email"
                label="Sähköposti / Email"
                placeholder="Sähköpostisi"
                required
                disabled={!isNew}
              />
            )}

            <QuestionFields name="answers" questions={event!.questions} />

            <p>
              Voit muokata ilmoittautumistasi tai poistaa sen myöhemmin tallentamalla tämän sivun URL-osoitteen.
              {event!.emailQuestion && ' Linkki lähetetään myös sähköpostiisi vahvistusviestissä.'}
            </p>

            <Button type="submit" variant="primary" className="float-right" formNoValidate disabled={submitting}>
              {isNew ? 'Lähetä' : 'Päivitä'}
            </Button>
            {!isNew && (
              <Button as={Link} variant="link" className="float-right" to={paths.eventDetails(event!.slug)}>
                Peruuta
              </Button>
            )}
            <div className="clearfix" />
          </Form>
        </NarrowContainer>
      )}
    </Formik>
  );
};

export default EditForm;
