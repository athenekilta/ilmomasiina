import React, { useState } from 'react';

import { Input, Label } from '@theme-ui/components';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Answer, Question, Signup } from '../../../../modules/types';
import QuestionFields from './QuestionFields';

import './EditForm.scss';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  answers: any[];
};

type Props = {
  signup: Signup;
  submitForm: (answers: Answer[]) => void;
  questions: Question[];
};

const EditForm = (props: Props) => {
  const { signup, submitForm, questions } = props;
  const {
    register, setValue, handleSubmit, errors,
  } = useForm<FormData>();
  const [inputError, setInputError] = useState(false);

  function onSubmit(data) {
    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      answers: [],
    };

    if (questions) {
      formData.answers = questions
        .map((question) => {
          const questionId = question.id;
          const answer = data[question.id];

          if (answer && answer.length > 0) {
            if (question.type === 'checkbox') {
              return {
                id: question.answerId,
                questionId,
                answer: answer.join(';'),
              };
            }
            return { id: question.answerId, questionId, answer };
          }

          return null;
        })
        .filter((x) => x);
    }

    return submitForm(formData);
  }

  return (
    <div className="form-wrapper">
      <div className="container">
        <div className="col-xs-12 col-md-8 col-md-offset-2">
          {inputError && (
            <p style={{ color: '#a94442' }}>
              Ilmoittautumisessasi on virheitä.
            </p>
          )}
          <h2>Muokkaa ilmoittautumista</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="firstName">Etunimi</Label>
            <Input
              name="firstName"
              type="text"
              placeholder="Etunimi"
              defaultValue={signup.firstName}
              ref={register({ required: true })}
            />
            <Label htmlFor="lastName">Sukunimi</Label>
            <Input
              name="lastName"
              type="text"
              placeholder="Sukunimi"
              defaultValue={signup.lastName}
              ref={register({ required: true })}
            />
            <Label htmlFor="email">Sähköposti</Label>
            <Input
              name="email"
              type="text"
              placeholder="Sähköpostisi"
              defaultValue={signup.email}
              ref={register({ required: true })}
            />

            <QuestionFields questions={questions} register={register} />

            <div className="input-wrapper pull-right">
              <input
                className="btn btn-primary pull-right"
                formNoValidate
                type="submit"
                value="Päivitä"
              />
            </div>
            <Link className="btn btn-link pull-right" to={`${PREFIX_URL}/`}>
              Peruuta
            </Link>
          </form>
        </div>
        <div className="cf" />
      </div>
    </div>
  );
};

export default EditForm;
