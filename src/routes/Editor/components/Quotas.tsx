import React from 'react';

import { Input, Label } from '@theme-ui/components';
import { useField } from 'formik';
import _ from 'lodash';
import { SortEnd } from 'react-sortable-hoc';

import { EditorQuota } from '../../../modules/editor/types';
import Sortable from './Sortable';

const Quotas = () => {
  const [{ value: quotas }, , { setValue }] = useField<EditorQuota[]>('quota');

  function addQuota() {
    setValue([
      ...quotas,
      {
        title: '',
        size: 0,
      },
    ]);
  }

  function updateOrder({ newIndex, oldIndex }: SortEnd) {
    const newQuotas = quotas.slice();
    const [elementToMove] = newQuotas.splice(oldIndex, 1);
    newQuotas.splice(newIndex, 0, elementToMove);
    setValue(newQuotas);
  }

  const quotaItems = quotas.map((quota, index) => {
    const thisQuota = quota.id;

    function updateField<F extends keyof EditorQuota>(field: F, value: EditorQuota[F]) {
      setValue(quotas.map((item) => {
        if (item.id === thisQuota) {
          if (field === 'size' && !value) {
            return {
              ...item,
              [field]: null,
            };
          }
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      }));
    }

    function removeQuota() {
      setValue(_.reject(quotas, { id: thisQuota }));
    }

    return (
      <div className="panel-body" key={quota.id}>
        <div className="col-xs-12 col-sm-10">
          <Label htmlFor={`quota-${quota.id}-title`}>
            Kiintiön nimi
          </Label>
          <Input
            name={`quota-${quota.id}-title`}
            value={quota.title}
            type="text"
            onChange={(e) => updateField('title', e.target.value)}
          />
          <div className="form-text">
            {quotas.length === 1 && 'Jos kiintiöitä on vain yksi, voit antaa sen nimeksi esim. tapahtuman nimen.'}
            Voit järjestellä kiintiöitä raahaamalla niitä vasemmalta.
          </div>
          <Label htmlFor={`quota-${quota.id}-max-attendees`}>
            Kiintiön koko
          </Label>
          <Input
            id={`quota-${quota.id}-max-attendees`}
            value={quota.size || ''}
            type="number"
            min={1}
            onChange={(e) => updateField('size', Number(e.target.value))}
          />
          <div className="form-text">
            Jos kiintiön kokoa ole rajoitettu, jätä kenttä tyhjäksi.
          </div>
        </div>
        {index > 0 && (
          <div className="col-xs-12 col-sm-2 no-focus">
            <button type="button" className="btn btn-link" onClick={() => removeQuota()}>
              Poista kiintiö
            </button>
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <Sortable
        collection="quotas"
        items={quotaItems}
        onSortEnd={updateOrder}
        useDragHandle
      />
      <div className="text-center">
        <button type="button" className="btn btn-primary" onClick={addQuota}>
          Lisää kiintiö
        </button>
      </div>
    </>
  );
};

export default Quotas;
