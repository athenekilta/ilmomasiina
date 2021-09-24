import React from 'react';

import { Field } from 'formik';
import { Col, Form, Row } from 'react-bootstrap';

import FieldRow from '../../../components/FieldRow';
import DateTimePicker from './DateTimePicker';
import Textarea from './Textarea';

const BasicDetailsTab = () => (
  <div>
    <FieldRow
      name="title"
      label="Tapahtuman nimi"
      required
      alternateError="* Otsikko vaaditaan."
    />
    <FieldRow
      name="date"
      label="Ajankohta"
      as={DateTimePicker}
      required
      alternateError="* Ajankohta vaaditaan."
    />
    <FieldRow
      name="webpageUrl"
      label="Kotisivujen osoite"
    />
    <FieldRow
      name="facebookUrl"
      label="Facebook-tapahtuma"
    />
    <FieldRow
      name="location"
      label="Paikka"
    />
    <FieldRow
      name="description"
      label="Kuvaus"
      help="Kuvauksessa voi käyttää Markdownia."
      as={Textarea}
      rows={8}
    />
    <Form.Group as={Row}>
      <Col sm="3" />
      <Col sm="9">
        <Field
          as={Form.Check}
          name="signupsPublic"
          id="signupsPublic"
          label="Ilmoittautumiset ovat julkisia"
        />
      </Col>
    </Form.Group>
  </div>
);

export default BasicDetailsTab;
