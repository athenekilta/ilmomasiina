import React from 'react';

import { Input } from '@theme-ui/components';
import _ from 'lodash';

import { Event } from '../../../modules/types';
import { SortableItems } from './Sortable';

type Props = {
  event: Event;
  updateEventField: any;
};

const Quotas = (props: Props) => {
  const { event, updateEventField } = props;

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

    updateEventField('quota', newQuotas);
  }

  function removeQuota(itemId) {
    const quotas = event.quota ? event.quota : [];
    const newQuotas = _.filter(quotas, quota => {
      if (quota.id === itemId) {
        return false;
      }
      return true;
    });

    updateEventField('quota', newQuotas);
  }

  function updateOrder(args) {
    const { newIndex, oldIndex } = args;

    const newQuotas = event.quota.map((quota, index) => {
      if (oldIndex < newIndex) {
        // Moved the quota down
        if (index > oldIndex && index <= newIndex) {
          quota.order -= 1;
        }
      }
      if (oldIndex > newIndex) {
        // Moved the quota up
        if (index >= newIndex && index < oldIndex) {
          quota.order += 1;
        }
      }
      if (index === oldIndex) {
        quota.order = newIndex;
      }
      return quota;
    });

    const elementToMove = newQuotas[args.oldIndex];
    newQuotas.splice(args.oldIndex, 1);
    newQuotas.splice(args.newIndex, 0, elementToMove);

    updateEventField('quota', newQuotas);
  }

  const orderedQuotas = _.orderBy(event.quota, 'order', 'asc');

  const quotaItems = _.map(orderedQuotas, (item, index) => {
    return (
      <div className="panel-body" key={index}>
        <div className="col-xs-12 col-sm-10">
          <Input
            name={`quota-${item.id}-title`}
            value={item.title}
            label="Kiintiön nimi"
            type="text"
            onChange={e => updateQuota(item.id, 'title', e.target.value)}
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
            onChange={e => updateQuota(item.id, 'size', e.target.value)}
            help="Jos kiintiön kokoa ole rajoitettu määrää, jätä kenttä tyhjäksi."
          />
        </div>
        {index > 0 && (
          <div className="col-xs-12 col-sm-2 no-focus">
            <a onClick={() => removeQuota(item.id)}>Poista</a>
          </div>
        )}
      </div>
    );
  });

  return (
    <SortableItems
      collection="quotas"
      items={quotaItems}
      onSortEnd={updateOrder}
      useDragHandle
    />
  );
};

export default Quotas;
