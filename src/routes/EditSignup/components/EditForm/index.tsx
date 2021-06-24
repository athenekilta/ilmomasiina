import React from 'react';

import { Field, Formik, FormikHelpers } from 'formik';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Label } from 'theme-ui';

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
                <Label htmlFor="firstName">Etunimi</Label>
                <Field
                  as={Input}
                  name="firstName"
                  type="text"
                  placeholder="Etunimi"
                  disabled
                />
                <Label htmlFor="lastName">Sukunimi</Label>
                <Field
                  as={Input}
                  name="lastName"
                  type="text"
                  placeholder="Sukunimi"
                  disabled
                />
                <Label htmlFor="email">Sähköposti</Label>
                <Field
                  as={Input}
                  name="email"
                  type="text"
                  placeholder="Sähköpostisi"
                  disabled
                />

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
