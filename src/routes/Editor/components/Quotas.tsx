import React from 'react';

import { Input } from 'formsy-react-components';
import _ from 'lodash';

import { Event } from '../../../modules/types';
import { SortableItems } from './Sortable';

type Props = {
  event: Event;
  onDataChange: (field: string, value: any) => void;
};

const Quotas = (props: Props) => {
  const { event, onDataChange } = props;

  function updateQuota(itemId, field, value) {
    const quotas = event.quota ? event.quota : [];

    const newQuotas = _.map(quotas, quota => {
      if (quota.id === itemId) {
        if (field === 'size' && value === '') {
          return {
            ...quota,
            [field]: null
          };
        }
        return {
          ...quota,
          [field]: value
        };
      }
      return quota;
    });

    onDataChange('quota', newQuotas);
  }

  function removeQuota(itemId) {
    const quotas = event.quota ? event.quota : [];
    const newQuotas = _.filter(quotas, quota => {
      if (quota.id === itemId) {
        return false;
      }
      return true;
    });

    onDataChange('quota', newQuotas);
  }

  function updateOrder(args) {
    const newQuotas = event.quota;

    const elementToMove = newQuotas[args.oldIndex];
    newQuotas.splice(args.oldIndex, 1);
    newQuotas.splice(args.newIndex, 0, elementToMove);

    onDataChange('quota', newQuotas);
  }

  const quotas = _.map(event.quota, (item, index) => (
    <div className="panel-body" key={index}>
      <div className="col-xs-12 col-sm-10">
        <Input
          name={`quota-${item.id}-title`}
          value={item.title}
          label="Kiintiön nimi"
          type="text"
          required
          onChange={(field, value) => updateQuota(item.id, 'title', value)}
          help={
            index === 0 &&
            'Jos kiintiöitä on vain yksi, voit antaa sen nimeksi esim. tapahtuman nimen. Voit järjestellä kiintiöitä raahaamalla niitä vasemmalta.'
          }
        />
        <Input
          name={`quota-${item.id}-max-attendees`}
          value={item.size}
          label="Kiintiön koko"
          type="number"
          validations="minLength:0"
          onChange={(field, value) => updateQuota(item.id, 'size', value)}
          help="Jos kiintiön kokoa ole rajoitettu määrää, jätä kenttä tyhjäksi."
        />
      </div>
      {index > 0 && (
        <div className="col-xs-12 col-sm-2">
          <a onClick={() => removeQuota(item.id)}>Poista</a>
        </div>
      )}
    </div>
  ));

  return (
    <SortableItems
      collection="quotas"
      items={quotas}
      onSortEnd={updateOrder}
      useDragHandle
    />
  );
};

export default Quotas;
