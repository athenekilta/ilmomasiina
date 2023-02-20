import React, { useState } from 'react';

import { Formik, FormikHelpers } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

import type { SignupUpdateBody } from '@tietokilta/ilmomasiina-models';
import FieldRow from '../../../components/FieldRow';
import { linkComponent, useNavigate } from '../../../config/router';
import { usePaths } from '../../../contexts/paths';
import { useEditSignupContext, useUpdateSignup } from '../../../modules/editSignup';
import DeleteSignup from './DeleteSignup';
import NarrowContainer from './NarrowContainer';
import QuestionFields from './QuestionFields';
import SignupStatus from './SignupStatus';

const EditForm = () => {
  const { event, signup, registrationClosed } = useEditSignupContext();
  const isNew = !signup!.confirmed;
  const updateSignup = useUpdateSignup();
  const Link = linkComponent();
  const navigate = useNavigate();
  const paths = usePaths();

  // TODO: actually use errors from API
  const [submitError, setSubmitError] = useState(false);

  async function onSubmit(answers: SignupUpdateBody, { setSubmitting }: FormikHelpers<SignupUpdateBody>) {
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
        navigate(paths.eventDetails(event!.slug));
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
      initialValues={signup! as SignupUpdateBody}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, isSubmitting }) => (
        <NarrowContainer>
          <h2>{isNew ? 'Ilmoittaudu / Register' : 'Muokkaa ilmoittautumista / Edit registration'}</h2>
          <SignupStatus />
          {submitError && (
            <p className="ilmo--form-error">Ilmoittautumisessasi on virheitä / Registration has errors.</p>
          )}
          {registrationClosed && (
            <p className="ilmo--form-error">
              Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman
              ilmoittautuminen on sulkeutunut.
            </p>
          )}
          <Form onSubmit={handleSubmit} className="ilmo--form">
            {event!.nameQuestion && (
              <>
                <FieldRow
                  name="firstName"
                  label="Etunimi / First name"
                  placeholder="Etunimi"
                  required
                  readOnly={!isNew || registrationClosed}
                />
                <FieldRow
                  name="lastName"
                  label="Sukunimi / Last name"
                  placeholder="Sukunimi"
                  required
                  readOnly={!isNew || registrationClosed}
                />
                <FieldRow
                  name="namePublic"
                  as={Form.Check}
                  type="checkbox"
                  disabled={registrationClosed}
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
                readOnly={!isNew || registrationClosed}
              />
            )}

            <QuestionFields name="answers" questions={event!.questions} disabled={registrationClosed} />

            {!registrationClosed && (
              <div>
                <p>
                  Voit muokata ilmoittautumistasi tai poistaa sen myöhemmin tallentamalla tämän sivun URL-osoitteen.
                  {event!.emailQuestion && ' Linkki lähetetään myös sähköpostiisi vahvistusviestissä.'}
                </p>
                <p>
                  You can edit your registration or remove it later by saving this page's URL address.
                  {event!.emailQuestion && ' The link will also be sent to your email in a confimation message.'}
                </p>
              </div>
            )}

            {!registrationClosed && (
              <nav className="ilmo--submit-buttons">
                {!isNew && (
                  <Button as={Link} variant="link" to={paths.eventDetails(event!.slug)}>
                    Peruuta
                  </Button>
                )}
                <Button type="submit" variant="primary" formNoValidate disabled={isSubmitting}>
                  {isNew ? 'Lähetä / Submit' : 'Päivitä / Update'}
                </Button>
              </nav>
            )}
          </Form>
          {!registrationClosed && <DeleteSignup />}
        </NarrowContainer>
      )}
    </Formik>
  );
};

export default EditForm;
