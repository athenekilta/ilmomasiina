import React from 'react';

import { Checkbox, Input, Label } from '@theme-ui/components';
import _ from 'lodash';

import { updateEventField } from '../../../modules/editor/actions';
import { Event } from '../../../modules/types';
import { useTypedDispatch } from '../../../store/reducers';
import DateTimePicker from './DateTimePicker';
import Quotas from './Quotas';

type Props = {
  event: Event;
  formMethods: any;
};

const QuotasTab = (props: Props) => {
  const { event, formMethods } = props;
  const { watch, register } = formMethods;
  const dispatch = useTypedDispatch();

  function addQuota() {
    const quotas = event.quota ? event.quota : [];
    const newQuotas = _.concat(quotas, {
      id: (_.max(quotas.map(n => n.id)) || 0) + 1,
      order: (_.max(quotas.map(n => n.order)) || 0) + 1,
      title: '',
      existsInDb: false
    });

    dispatch(updateEventField('quota', newQuotas));
  }

  return (
    <div>
      <DateTimePicker
        name="registrationStartDate"
        value={event.registrationStartDate}
        label="Ilmo alkaa"
        formMethods={formMethods}
      />
      <DateTimePicker
        name="registrationEndDate"
        value={event.registrationEndDate}
        label="Ilmo päättyy"
        formMethods={formMethods}
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
        <Label>
          <Checkbox name="useOpenQuota" ref={register} />
          Käytä lisäksi yhteistä kiintiötä
        </Label>
        {watch('useOpenQuota') && (
          <Input
            name="openQuotaSize"
            label="Avoimen kiintiön koko"
            type="number"
            ref={register({ required: true, min: 0 })}
          />
        )}
      </div>
    </div>
  );
};

export default QuotasTab;
