import React, { useEffect } from 'react';

import { Button, Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

import requireAuth from '../../containers/requireAuth';
import { getAdminEvents, resetState } from '../../modules/adminEvents/actions';
import appPaths from '../../paths';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import AdminEventListItem from './AdminEventListItem';

const AdminEventsList = () => {
  const dispatch = useTypedDispatch();
  const { events, eventsLoadError } = useTypedSelector((state) => state.adminEvents, shallowEqual);

  useEffect(() => {
    dispatch(getAdminEvents());
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  if (eventsLoadError) {
    return (
      <>
        <h1>Hups, jotain meni pieleen</h1>
        <p>Tapahtumien lataus epäonnistui</p>
      </>
    );
  }

  if (!events) {
    return (
      <>
        <h1>Hallinta</h1>
        <Spinner animation="border" />
      </>
    );
  }

  return (
    <>
      <nav className="ilmo--title-nav">
        <h1>Hallinta</h1>
        <Button as={Link} variant="secondary" to={appPaths.adminUsersList}>
          Käyttäjät
        </Button>
        <Button as={Link} variant="secondary" to={appPaths.adminAuditLog}>
          Toimintoloki
        </Button>
        <Button as={Link} variant="primary" to={appPaths.adminEditEvent('new')}>
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
    </>
  );
};

export default requireAuth(AdminEventsList);
