import React, { useEffect } from 'react';

import { Button, Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

import { getAdminEvents, resetState } from '../../modules/admin/actions';
import paths from '../../paths';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import AdminEventListItem from './AdminEventListItem';

import './AdminEventsList.scss';

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
      <h1>Hallinta</h1>
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
      <Button as={Link} variant="secondary" to={paths.adminEditEvent('new')}>
        + Uusi tapahtuma
      </Button>
      <nav className="mt-3">
        <Button as={Link} to={paths.adminUsersList}>
          Käyttäjien hallintapaneeli
        </Button>
      </nav>
    </div>
  );
};

export default AdminEventsList;
