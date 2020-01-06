import React, { useState } from "react";

import { Form, Input } from "formsy-react-components";
import _ from "lodash";
import QuestionFields from "./QuestionFields";
import SignupStatus from "./SignupStatus";

import "./EnrollForm.scss";
import { Event, Signup, Question } from "../../../../modules/types";

interface CommonFormFields {
  firstName: string;
  lastName: string;
  email: string;
}

interface FormData extends CommonFormFields {
  answers: { questionId: number; answer: string }[] | undefined[];
}

type Props = {
  error: boolean;
  event: Event;
  closeForm: () => void;
  loading: boolean;
  questions: Question[];
  signup: Signup;
  submitForm: (answers: any) => void;
};

const EnrollForm = (props: Props) => {
  const {
    error,
    event,
    closeForm,
    loading,
    questions,
    signup,
    submitForm
  } = props;

  const [inputError, setInputError] = useState(false);

  function parseSubmit(data: {
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: string | string[];
  }) {
    const answers: FormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      answers: []
    };

    if (questions) {
      answers.answers = questions
        .map(question => {
          const questionId = question.id;
          const answer = data[question.id];

          if (answer && answer.length > 0) {
            if (question.type === "checkbox") {
              return { questionId, answer: answer.join(";") };
            }
            return { questionId, answer };
          }
        })
        .filter(x => x);
    }

    return submitForm(answers);
  }

  return (
    <div className="form-wrapper">
      <div className="container">
        <a className="close" onClick={() => closeForm()} />
        <div className="col-xs-12 col-md-8 col-md-offset-2">
          {inputError && (
            <p style={{ color: "#a94442" }}>
              Ilmoittautumisessasi on virheitä.
            </p>
          )}
          <h2>Ilmoittaudu</h2>

          <SignupStatus event={event} signup={signup} />

          <Form
            onValidSubmit={parseSubmit}
            onInvalidSubmit={() => setInputError(true)}
          >
            <Input
              name="firstName"
              value=""
              label="Etunimi / First name"
              type="text"
              placeholder="Etunimi"
              required
            />
            <Input
              name="lastName"
              value=""
              label="Sukunimi / Last name"
              type="text"
              placeholder="Sukunimi"
              required
              help="Nimi on julkinen tieto. Voit halutessasi ilmoittautua tapahtumaan salanimellä."
            />

            <Input
              name="email"
              value=""
              label="Sähköposti / Email"
              type="email"
              placeholder="Sähköpostisi"
              validations="isEmail"
              required
            />

            <QuestionFields questions={questions} />

            <div className="input-wrapper pull-right">
              <input
                className="btn btn-primary pull-right"
                formNoValidate
                type="submit"
                value="Lähetä"
                disabled={loading}
              />
            </div>
            <a className="btn btn-link pull-right" onClick={() => closeForm()}>
              Peruuta
            </a>
          </Form>
        </div>
        <div className="cf" />
      </div>
    </div>
  );
};

export default EnrollForm;
