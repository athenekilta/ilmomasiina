import React from 'react';

import { Field, useFormikContext } from 'formik';
import { Form, Row } from 'react-bootstrap';

import { EditorEvent } from '../../../modules/editor/types';
import DateTimePicker from './DateTimePicker';

const BasicDetailsTab = () => {
  const { errors } = useFormikContext<EditorEvent>();
  return (
    <div>
      <Form.Group as={Row} controlId="title">
        <Form.Label column sm="9" htmlFor="title">Tapahtuman nimi</Form.Label>
        <Field as={Form.Control} column sm="3" name="title" id="title" type="text" required />
      </Form.Group>
      <Form.Control.Feedback type="invalid">
        {errors.title && '* Otsikko vaaditaan.'}
      </Form.Control.Feedback>
      <Form.Label htmlFor="date">Ajankohta</Form.Label>
      <Field as={DateTimePicker} name="date" />
      <Form.Label htmlFor="webpageUrl">Kotisivujen osoite</Form.Label>
      <Field as={Form.Control} name="webpageUrl" id="webpageUrl" type="text" />
      <Form.Label htmlFor="facebookUrl">Facebook-tapahtuma</Form.Label>
      <Field as={Form.Control} name="facebookUrl" id="facebookUrl" type="text" />
      <Form.Label htmlFor="location">Paikka</Form.Label>
      <Field as={Form.Control} name="location" id="location" type="text" />
      <Form.Label htmlFor="description">Kuvaus</Form.Label>
      <Field as={(props: any) => <Form.Control as="textarea" {...props} />} name="description" id="description" />
      <Field as={Form.Check} name="signupsPublic" label="Ilmoittautumiset ovat julkisia" />
    </div>
  );
};

export default BasicDetailsTab;
