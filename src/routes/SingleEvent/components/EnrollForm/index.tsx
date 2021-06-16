/** @jsx jsx */
import React, { useState } from 'react';

import {
  Box, Flex, Input, Label,
} from '@theme-ui/components';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { jsx } from 'theme-ui';

import { Event, Question, Signup } from '../../../../modules/types';
import QuestionFields from './QuestionFields';
import SignupStatus from './SignupStatus';

import './EnrollForm.scss';

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
    submitForm,
  } = props;

  const {
    register, setValue, handleSubmit, errors,
  } = useForm<FormData>();
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
      answers: [],
    };

    if (questions) {
      answers.answers = questions
        .map((question) => {
          const questionId = question.id;
          const answer = data[question.id];

          if (answer && answer.length > 0) {
            if (question.type === 'checkbox') {
              return { questionId, answer: answer.join(';') };
            }
            return { questionId, answer };
          }
        })
        .filter((x) => x);
    }

    return submitForm(answers);
  }

  return (
    <div className="form-wrapper">
      <div className="container">
        <a className="close" onClick={() => closeForm()} />
        <div className="col-xs-12 col-md-8 col-md-offset-2">
          {inputError && (
            <p sx={{ color: 'error' }}>Ilmoittautumisessasi on virheitä.</p>
          )}
          <h2>Ilmoittaudu</h2>

          <SignupStatus event={event} signup={signup} />

          <form onSubmit={handleSubmit(parseSubmit)}>
            <ul className="flex-outer">
              <li>
                <Label htmlFor="firstName">Etunimi / First name</Label>
                <Input
                  name="firstName"
                  value=""
                  type="text"
                  placeholder="Etunimi"
                  ref={register({ required: true })}
                />
              </li>
              <li>
                <Label htmlFor="lastName">Sukunimi / Last name</Label>
                <Input
                  name="lastName"
                  value=""
                  type="text"
                  placeholder="Sukunimi"
                  ref={register({ required: true })}
                />
              </li>
              <li>
                <Label htmlFor="email">Sähköposti / Email</Label>
                <Input
                  name="email"
                  value=""
                  type="email"
                  placeholder="Sähköpostisi"
                  validations="isEmail"
                  ref={register({ required: true })}
                />
              </li>
              <QuestionFields questions={questions} register={register} />
            </ul>

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
          </form>
        </div>
        <div className="cf" />
      </div>
    </div>
  );
};

export default EnrollForm;
