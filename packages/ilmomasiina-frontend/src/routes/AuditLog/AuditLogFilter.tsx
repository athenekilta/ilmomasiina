import React from 'react';

import { Form } from 'react-bootstrap';

import type { AuditLoqQuery } from '@tietokilta/ilmomasiina-models';
import { setAuditLogQueryField } from '../../modules/auditLog/actions';
import { useTypedDispatch } from '../../store/reducers';
import useThrottled from '../../utils/useThrottled';

const UPDATE_DELAY = 500;

type Props = Omit<React.ComponentProps<typeof Form.Control>, 'name' | 'value' | 'onChange'> & {
  name: keyof AuditLoqQuery;
};

const AuditLogFilter = ({ name, ...props }: Props) => {
  const dispatch = useTypedDispatch();

  const onChange = useThrottled((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAuditLogQueryField(name, e.target.value));
  }, UPDATE_DELAY);

  const mergedProps = {
    placeHolder: 'Suodata\u2026',
    ...props,
  };

  return (
    <Form.Control
      type="text"
      name={name}
      onChange={onChange}
      {...mergedProps}
    />
  );
};

export default AuditLogFilter;
