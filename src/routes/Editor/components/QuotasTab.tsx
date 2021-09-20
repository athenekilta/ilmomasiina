import React from 'react';

import { Field, useFormikContext } from 'formik';
import { Col, Form, Row } from 'react-bootstrap';

import FieldRow from '../../../components/FieldRow';
import { EditorEvent } from '../../../modules/editor/types';
import DateTimePicker from './DateTimePicker';
import Quotas from './Quotas';

const QuotasTab = () => {
  const { values: { useOpenQuota } } = useFormikContext<EditorEvent>();
  return (
    <div>
      <FieldRow
        name="registrationStartDate"
        as={DateTimePicker}
        label="Ilmo alkaa"
        required
      />
      <FieldRow
        name="registrationEndDate"
        as={DateTimePicker}
        label="Ilmo päättyy"
        required
      />
      <hr />
      <Quotas />
      <Form.Group as={Row}>
        <Col sm="3" />
        <Col sm="9">
          <Field
            as={Form.Check}
            id="useOpenQuota"
            name="useOpenQuota"
            label="Käytä lisäksi yhteistä kiintiötä"
          />
        </Col>
      </Form.Group>
      {useOpenQuota && (
        <FieldRow
          name="openQuotaSize"
          label="Avoimen kiintiön koko"
          type="number"
          min="0"
          required
        />
      )}
    </div>
  );
};

export default QuotasTab;
