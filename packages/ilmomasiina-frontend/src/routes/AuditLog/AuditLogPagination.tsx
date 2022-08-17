import React from 'react';

import { Button, Form } from 'react-bootstrap';

import { setAuditLogQueryField } from '../../modules/auditLog/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

export const LOGS_PER_PAGE = 100;

const AuditLogPagination = () => {
  const { auditLogQuery, auditLog } = useTypedSelector((state) => state.auditLog);
  const dispatch = useTypedDispatch();

  const value = auditLogQuery.offset || 0;
  const perPage = auditLogQuery.limit || LOGS_PER_PAGE;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setAuditLogQueryField('offset', Number(e.target.value) - 1));
  };

  return (
    <nav className="pagination mb-3">
      <Button
        className="mr-3"
        type="button"
        onClick={() => dispatch(setAuditLogQueryField('offset', value - perPage))}
        aria-label="Edellinen sivu"
        disabled={value <= 0}
      >
        &laquo;
      </Button>
      {'Rivit\u00A0'}
      <Form.Control
        type="number"
        value={value + 1}
        onChange={onChange}
      />
      {`\u2013${value + LOGS_PER_PAGE}, yhteensä ${auditLog?.count || '?'}`}
      <Button
        className="ml-3"
        type="button"
        onClick={() => dispatch(setAuditLogQueryField('offset', value + perPage))}
        aria-label="Seuraava sivu"
        disabled={!auditLog || value + perPage >= auditLog.count}
      >
        &raquo;
      </Button>
    </nav>
  );
};

export default AuditLogPagination;
