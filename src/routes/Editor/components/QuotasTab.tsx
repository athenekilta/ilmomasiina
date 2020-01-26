import React from 'react';

import { Checkbox, Input } from '@theme-ui/components';
import _ from 'lodash';

import { Event } from '../../../modules/types';
import DateTimePicker from './DateTimePicker';
import Quotas from './Quotas';

type Props = {
  event: Event;
  formMethods: any;
  updateEventField: any;
};

const QuotasTab = (props: Props) => {
  const { event, formMethods, updateEventField } = props;
  const { register } = formMethods;

  function addQuota() {
    const quotas = event.quota ? event.quota : [];
    const newQuotas = _.concat(quotas, {
      id: (_.max(quotas.map(n => n.id)) || 0) + 1,
      order: (_.max(quotas.map(n => n.order)) || 0) + 1,
      title: '',
      existsInDb: false
    });

    updateEventField('quota', newQuotas);
  }

  return (
    <div>
      <DateTimePicker
        name="registrationStartDate"
        value={event.registrationStartDate}
        label="Ilmo alkaa"
        updateEventField={updateEventField}
      />
      <DateTimePicker
        name="registrationEndDate"
        value={event.registrationEndDate}
        label="Ilmo päättyy"
        updateEventField={updateEventField}
      />
      <hr />
      <div>
        <Quotas {...props} />
        <div className="text-center">
          <a className="btn btn-primary" onClick={addQuota}>
            Lisää kiintiö
          </a>
        </div>
        <div className="clearfix" />
        <Checkbox
          name="useOpenQuota"
          defaultChecked={event.useOpenQuota}
          label="Käytä lisäksi yhteistä kiintiötä"
          ref={register}
        />
        {!event.useOpenQuota || (
          <Input
            name="openQuotaSize"
            label="Avoimen kiintiön koko"
            defaultValue={event.openQuotaSize}
            type="number"
            ref={register({ required: true, min: 0 })}
          />
        )}
      </div>
    </div>
  );
};

export default QuotasTab;
