import React from 'react';

import { useFormikContext } from 'formik';
import { Form } from 'react-bootstrap';

import FieldRow from '../../../components/FieldRow';
import { EditorEvent } from '../../../modules/editor/types';
import Questions from './Questions';

const QuestionsTab = () => {
  const { values: { nameQuestion, emailQuestion } } = useFormikContext<EditorEvent>();
  return (
    <div>
      <FieldRow
        name="nameQuestion"
        label="Nimi"
        as={Form.Check}
        type="checkbox"
        checkAlign
        checkLabel="Kerää nimet"
        help={
          nameQuestion
            ? 'Nimi on pakollinen kysymys. Osallistuja saa päättää, näkyykö nimi julkisesti.'
            : 'Jos nimi kysytään, osallistuja saa päättää, näkyykö nimi julkisesti.'
        }
      />
      <FieldRow
        name="emailQuestion"
        label="Sähköposti"
        as={Form.Check}
        type="checkbox"
        checkAlign
        checkLabel="Kerää sähköpostiosoitteet"
        help={
          emailQuestion
            ? 'Sähköpostiosoite on pakollinen kysymys.'
            : 'Jos sähköpostiosoitetta ei ole kysytä, osallistujat eivät saa vahvistussähköpostia, eivät voi muokata '
              + 'ilmoittautumistaan, eivätkä saa sähköposti-ilmoitusta jonosijalta pääsemisestä.'
        }
      />
      <Questions />
    </div>
  );
};

export default QuestionsTab;
