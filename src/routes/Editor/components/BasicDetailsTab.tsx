import React, { useEffect } from 'react';

import { Field, useFormikContext } from 'formik';
import { Col, Form, Row } from 'react-bootstrap';

import FieldRow from '../../../components/FieldRow';
import { EditorEvent } from '../../../modules/editor/types';
import { useTypedSelector } from '../../../store/reducers';
import DateTimePicker from './DateTimePicker';
import SlugField from './SlugField';
import Textarea from './Textarea';

const BasicDetailsTab = () => {
  const {
    values: { title },
    touched: { slug: slugTouched },
    setFieldValue,
  } = useFormikContext<EditorEvent>();
  const isNew = useTypedSelector((state) => state.editor.isNew);

  useEffect(() => {
    if (isNew && !slugTouched) {
      const generatedSlug = title
        .normalize('NFD') // converts e.g. ä to a + umlaut
        .replace(/[^A-Za-z0-9]+/g, '')
        .toLocaleLowerCase('fi');
      setFieldValue('slug', generatedSlug);
    }
  }, [setFieldValue, isNew, title, slugTouched]);

  return (
    <div>
      <FieldRow
        name="title"
        label="Tapahtuman nimi"
        required
        alternateError="* Otsikko vaaditaan."
      />
      <FieldRow
        name="slug"
        label="Tapahtuman URL"
        required
        alternateError="* URL-pääte vaaditaan."
        as={SlugField}
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
        as={Textarea}
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
};

export default BasicDetailsTab;
