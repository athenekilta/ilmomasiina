import React, { useEffect } from 'react';

import { Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

import requireAuth from '../../containers/requireAuth';
import { getAuditLogs, resetState } from '../../modules/auditLog/actions';
import appPaths from '../../paths';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import AuditLogActionFilter from './AuditLogActionFilter';
import AuditLogFilter from './AuditLogFilter';
import AuditLogItem from './AuditLogItem';
import AuditLogPagination, { LOGS_PER_PAGE } from './AuditLogPagination';

import './AuditLog.scss';

const AuditLog = () => {
  const dispatch = useTypedDispatch();
  const { auditLog, auditLogLoadError } = useTypedSelector((state) => state.auditLog, shallowEqual);

  useEffect(() => {
    dispatch(getAuditLogs({
      $limit: LOGS_PER_PAGE,
    }));
    return () => {
      resetState();
    };
  }, [dispatch]);

  return (
    <>
      <Link to={appPaths.adminEventsList}>&#8592; Takaisin</Link>
      <h1>Toimintoloki</h1>
      <AuditLogPagination />
      <table className="table audit-log--table">
        <thead>
          <tr>
            <th>
              Aika
            </th>
            <th>
              Käyttäjä
              <nav className="audit-log--filter">
                <AuditLogFilter name="user" />
              </nav>
            </th>
            <th>
              IP-osoite
              <nav className="audit-log--filter">
                <AuditLogFilter name="ip" />
              </nav>
            </th>
            <th>
              Toiminto
              <nav className="audit-log--filter">
                <AuditLogActionFilter />
                <AuditLogFilter name="event" placeHolder="Tapahtuma&hellip;" />
                <AuditLogFilter name="signup" placeHolder="Ilmoittautuminen&hellip;" />
              </nav>
            </th>
          </tr>
        </thead>
        <tbody>
          {auditLogLoadError && (
            <tr>
              <td colSpan={4}>
                Lokien lataus epäonnistui
              </td>
            </tr>
          )}
          {!auditLogLoadError && !auditLog && (
            <tr>
              <td colSpan={4}>
                <Spinner animation="border" />
              </td>
            </tr>
          )}
          {auditLog && auditLog.rows.map((item) => (
            <AuditLogItem
              key={item.id}
              item={item}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default requireAuth(AuditLog);
