import React, { useState } from 'react';

import { Formik, FormikHelpers } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import FieldRow from '../../../components/FieldRow';
import { paths } from '../../../config/paths';
import { linkComponent, useNavigate } from '../../../config/router';
import { useStateAndDispatch } from '../../../modules/editSignup';
import { useUpdateSignup } from '../../../modules/editSignup/actions';
import DeleteSignup from './DeleteSignup';
import NarrowContainer from './NarrowContainer';
import QuestionFields from './QuestionFields';
import SignupStatus from './SignupStatus';

const EditForm = () => {
  const [{ event, signup }] = useStateAndDispatch();
  const isNew = signup!.confirmedAt === null;
  const updateSignup = useUpdateSignup();
  const Link = linkComponent();
  const navigate = useNavigate();

  // TODO: actually use errors from API
  const [submitError, setSubmitError] = useState(false);

  async function onSubmit(answers: Signup.Update.Body, { setSubmitting }: FormikHelpers<Signup.Update.Body>) {
    const action = isNew ? 'Ilmoittautuminen / Registration' : 'Muokkaus / Edit';
    const progressToast = toast.loading(`${action} käynnissä / in progress`);

    try {
      await updateSignup(answers);

      toast.update(progressToast, {
        render: `${action} onnistui / succesfull!`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
        isLoading: false,
      });
      setSubmitError(false);
      setSubmitting(false);
      if (isNew) {
        navigate(paths().eventDetails(event!.slug));
      }
    } catch (error) {
      toast.update(progressToast, {
        render: `${action} ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan / did not succeed. Check that all mandatory fields are filled and try again.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
        isLoading: false,
      });
      setSubmitError(true);
      setSubmitting(false);
    }
  }

  return (
    <Formik
      initialValues={signup! as Signup.Update.Body}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, isSubmitting }) => (
        <NarrowContainer>
          <h2>{isNew ? 'Ilmoittaudu / Register' : 'Muokkaa ilmoittautumista / Edit registration'}</h2>
          <SignupStatus />
          {submitError && (
            <p className="ilmo--form-error">Ilmoittautumisessasi on virheitä / Registration has errors.</p>
          )}
          <Form onSubmit={handleSubmit} className="ilmo--form">
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
              Voit muokata ilmoittautumistasi tai poistaa sen myöhemmin tallentamalla tämän sivun URL-osoitteen / You can edit your registration or remove it later by saving this page's URL address.
              {event!.emailQuestion && ' Linkki lähetetään myös sähköpostiisi vahvistusviestissä / The link will also be sent to your email in a confimation message.'}
            </p>

            <nav className="ilmo--submit-buttons">
              {!isNew && (
                <Button as={Link} variant="link" to={paths().eventDetails(event!.slug)}>
                  Peruuta
                </Button>
              )}
              <Button type="submit" variant="primary" formNoValidate disabled={isSubmitting}>
                {isNew ? 'Lähetä / Subbit' : 'Päivitä / Update'}
              </Button>
            </nav>
          </Form>
          <DeleteSignup />
        </NarrowContainer>
      )}
    </Formik>
  );
};

export default EditForm;
