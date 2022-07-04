import React, { useEffect } from 'react';

import { Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

import { fullPaths } from '@tietokilta/ilmomasiina-components/src/config/paths';
import requireAuth from '../../containers/requireAuth';
import { getUsers, resetState } from '../../modules/adminUsers/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import AdminUserListItem from './AdminUserListItem';
import UserForm from './UserForm';

// import './AdminUsersList.scss';

const AdminUsersList = () => {
  const dispatch = useTypedDispatch();
  const { users, usersLoadError } = useTypedSelector((state) => state.adminUsers, shallowEqual);

  useEffect(() => {
    dispatch(getUsers());
    return () => {
      resetState();
    };
  }, [dispatch]);

  if (usersLoadError) {
    return (
      <>
        <h1>Hups, jotain meni pieleen</h1>
        <p>Käyttäjien lataus epäonnistui</p>
      </>
    );
  }

  let content = <Spinner animation="border" />;

  if (users) {
    content = (
      <>
        <table className="table">
          <thead>
            <tr>
              <th>Sähköposti</th>
              <th>Toiminnot</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <AdminUserListItem
                key={user.id}
                user={user}
              />
            ))}
          </tbody>
        </table>

        <h1>Luo uusi käyttäjä</h1>
        <UserForm />
      </>
    );
  }

  return (
    <>
      <Link to={fullPaths().adminEventsList}>&#8592; Takaisin</Link>
      <h1>Käyttäjien hallinta</h1>
      {content}
    </>
  );
};

export default requireAuth(AdminUsersList);
