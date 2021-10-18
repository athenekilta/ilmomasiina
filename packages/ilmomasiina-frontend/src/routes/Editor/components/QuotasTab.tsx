import React from 'react';

import { useFormikContext } from 'formik';
import { Form } from 'react-bootstrap';

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
      <FieldRow
        name="signupsPublic"
        label="Julkisuus"
        as={Form.Check}
        type="checkbox"
        checkAlign
        checkLabel="Ilmoittautumiset ovat julkisia"
      />
      <hr />
      <Quotas />
      <FieldRow
        name="useOpenQuota"
        label="Avoin kiintiö"
        as={Form.Check}
        type="checkbox"
        checkAlign
        checkLabel="Käytä lisäksi yhteistä kiintiötä"
        help={
          'Avoimeen kiintiöön sijoitetaan automaattisesti ilmoittautumisjärjestyksessä ensimmäiset ilmoittautujat, '
          + 'jotka eivät mahdu valitsemaansa kiintiöön.'
        }
      />
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
