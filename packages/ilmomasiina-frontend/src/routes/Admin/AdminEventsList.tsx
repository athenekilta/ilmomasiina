import React, { useEffect } from 'react';

import { Button, Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

import { getAdminEvents, resetState } from '../../modules/admin/actions';
import paths from '../../paths';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import AdminEventListItem from './AdminEventListItem';

const AdminEventsList = () => {
  const dispatch = useTypedDispatch();
  const { events, eventsLoadError } = useTypedSelector((state) => state.admin, shallowEqual);

  useEffect(() => {
    dispatch(getAdminEvents());
    return () => {
      resetState();
    };
  }, [dispatch]);

  if (eventsLoadError) {
    return (
      <div className="container">
        <h1>Hups, jotain meni pieleen</h1>
        <p>Tapahtumien lataus epäonnistui</p>
      </div>
    );
  }

  if (!events) {
    return (
      <div className="container">
        <h1>Hallinta</h1>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="title-nav">
        <h1>Hallinta</h1>
        <Button as={Link} variant="secondary" to={paths.adminUsersList} className="ml-2">
          Käyttäjät
        </Button>
        <Button as={Link} variant="secondary" to={paths.adminAuditLog} className="ml-2">
          Toimintoloki
        </Button>
        <Button as={Link} variant="primary" to={paths.adminEditEvent('new')} className="ml-2">
          + Uusi tapahtuma
        </Button>
      </nav>
      <table className="table">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Ajankohta</th>
            <th>Tila</th>
            <th>Ilmoittautuneita</th>
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <AdminEventListItem
              key={event.id}
              event={event}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEventsList;
