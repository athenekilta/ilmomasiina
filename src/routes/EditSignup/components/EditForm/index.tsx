import React, { useState } from "react";

import { Form, Input } from "formsy-react-components";
import _ from "lodash";
import { Link } from "react-router-dom";

import QuestionFields from "../../QuestionFields";

import "./EditForm.scss";
import { Answer, Signup, Question } from "../../../../modules/types";

type Props = {
  signup: Signup;
  submitForm: (answers: Answer[]) => void;
  questions: Question[];
};

const EditForm = (props: Props) => {
  const { signup, submitForm, questions } = props;
  const [inputError, setInputError] = useState(false);

  function parseSubmit(data) {
    const answers = {
      firstName: signup.firstName,
      lastName: signup.lastName,
      email: signup.email,
      answers: []
    };

    if (questions) {
      answers.answers = questions
        .map(question => {
          const questionId = question.id;
          const answer = data[question.id];

          if (answer && answer.length > 0) {
            if (question.type === "checkbox") {
              return {
                id: question.answerId,
                questionId,
                answer: answer.join(";")
              };
            }
            return { id: question.answerId, questionId, answer };
          }

          return null;
        })
        .filter(x => x);
    }

    return submitForm(answers);
  }

  return (
    <div className="form-wrapper">
      <div className="container">
        <div className="col-xs-12 col-md-8 col-md-offset-2">
          {inputError && (
            <p style={{ color: "#a94442" }}>
              Ilmoittautumisessasi on virheitä.
            </p>
          )}
          <h2>Muokkaa ilmoittautumista</h2>
          {signup.status != null && <p>{signupStatus()}</p>}

          <Form
            onValidSubmit={parseSubmit}
            onInvalidSubmit={() => setInputError(true)}
          >
            <Input
              name="firstName"
              value={signup.firstName}
              label="Etunimi"
              type="text"
              placeholder="Etunimi"
              disabled
            />
            <Input
              name="lastName"
              value={signup.lastName}
              label="Sukunimi"
              type="text"
              placeholder="Sukunimi"
              disabled
            />

            <Input
              name="email"
              value={signup.email}
              label="Sähköposti"
              type="email"
              placeholder="Sähköpostisi"
              validations="isEmail"
              disabled
            />

            <QuestionFields questions={questions} />

            <div className="input-wrapper pull-right">
              <input
                className="btn btn-primary pull-right"
                formNoValidate
                type="submit"
                value="Päivitä"
                disabled={loading}
              />
            </div>
            <Link className="btn btn-link pull-right" to={`${PREFIX_URL}/`}>
              Peruuta
            </Link>
          </Form>
        </div>
        <div className="cf" />
      </div>
    </div>
  );
};

export default EditForm;
