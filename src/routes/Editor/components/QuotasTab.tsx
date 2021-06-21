import React from 'react';

import { Checkbox, Input, Label } from '@theme-ui/components';
import { Field, useFormikContext } from 'formik';

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
        <Label>
          <Field
            as={Checkbox}
            name="useOpenQuota"
          />
          Käytä lisäksi yhteistä kiintiötä
        </Label>
        {useOpenQuota && (
          <div className="form-group">
            <Label htmlFor="openQuotaSize">
              Avoimen kiintiön koko
            </Label>
            <Field
              as={Input}
              name="openQuotaSize"
              min="0"
              type="number"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotasTab;
