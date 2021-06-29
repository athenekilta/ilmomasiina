import React from 'react';

import { Field, useFormikContext } from 'formik';
import { Form } from 'react-bootstrap';

import { EditorEvent } from '../../../modules/editor/types';
import DateTimePicker from './DateTimePicker';
import Quotas from './Quotas';

const QuotasTab = () => {
  const { values: { useOpenQuota } } = useFormikContext<EditorEvent>();
  return (
    <div>
      <Field
        as={DateTimePicker}
        name="registrationStartDate"
        label="Ilmo alkaa"
      />
      <Field
        as={DateTimePicker}
        name="registrationEndDate"
        label="Ilmo päättyy"
      />
      <hr />
      <div>
        <Quotas />
        <div className="clearfix" />
        <Field
          as={Form.Check}
          name="useOpenQuota"
          label="Käytä lisäksi yhteistä kiintiötä"
        />
        {useOpenQuota && (
          <Form.Group controlId="openQuotaSize">
            <Form.Label>Avoimen kiintiön koko</Form.Label>
            <Field
              as={Form.Control}
              name="openQuotaSize"
              min="0"
              type="number"
            />
          </Form.Group>
        )}
      </div>
    </div>
  );
};

export default QuotasTab;
