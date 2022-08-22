import React from 'react';

import { Form } from 'react-bootstrap';

import { setAuditLogQueryField } from '../../modules/auditLog/actions';
import { useTypedDispatch } from '../../store/reducers';

const ACTIONS = [
  ['event.create', 'Tapahtuma: Luo'],
  ['event.edit', 'Tapahtuma: Muokkaa'],
  ['event.publish', 'Tapahtuma: Julkaise'],
  ['event.unpublish', 'Tapahtuma: Luonnokseksi'],
  ['event.delete', 'Tapahtuma: Poista'],
  ['signup.edit', 'Ilmoittautuminen: Muokkaa'],
  ['signup.delete', 'Ilmoittautuminen: Poista'],
  ['signup.queuePromote', 'Ilmoittautuminen: Nousi jonosta'],
  ['user.create', 'Käyttäjä: Luo'],
  ['user.delete', 'Käyttäjä: Poista'],
];

const AuditLogActionFilter = () => {
  const dispatch = useTypedDispatch();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setAuditLogQueryField('action', e.target.value));
  };

  return (
    <Form.Control
      as="select"
      onChange={onChange}
    >
      <option value="">Toiminto&hellip;</option>
      {ACTIONS.map(([key, label]) => (
        <option value={key} key={key}>{label}</option>
      ))}
    </Form.Control>
  );
};

export default AuditLogActionFilter;
