import React from 'react';

import { Checkbox, Input } from 'formsy-react-components';
import _ from 'lodash';

import { Event } from '../../../modules/types';
import DateTimePicker from './DateTimePicker';
import Quotas from './Quotas';

type Props = {
  event: Event;
  onDataChange: (field: string, value: any) => void;
};

const QuotasTab = (props: Props) => {
  const { event, onDataChange } = props;

  function addQuota() {
    const quotas = event.quota ? event.quota : [];
    const newQuotas = _.concat(quotas, {
      id: (_.max(quotas.map(n => n.id)) || 0) + 1,
      title: '',
      existsInDb: false
    });

    onDataChange('quota', newQuotas);
  }

  return (
    <div>
      <DateTimePicker
        name="registrationStartDate"
        value={event.registrationStartDate}
        label="Ilmo alkaa"
        required
        onChange={onDataChange}
      />
      <DateTimePicker
        name="registrationEndDate"
        value={event.registrationEndDate}
        label="Ilmo päättyy"
        required
        onChange={onDataChange}
      />
      <hr />
      <div>
        <Quotas event={event} onDataChange={onDataChange} />
        <div className="text-center">
          <a className="btn btn-primary" onClick={addQuota}>
            Lisää kiintiö
          </a>
        </div>
        <div className="clearfix" />
        <Checkbox
          name="useOpenQuota"
          value={event.useOpenQuota}
          label="Käytä lisäksi yhteistä kiintiötä"
          onChange={onDataChange}
        />
        {!event.useOpenQuota || (
          <Input
            name="openQuotaSize"
            label="Avoimen kiintiön koko"
            value={event.openQuotaSize}
            type="number"
            validations="minLength:0"
            required
            onChange={onDataChange}
          />
        )}
      </div>
    </div>
  );
};

export default QuotasTab;
