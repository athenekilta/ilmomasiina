import React, { MouseEvent } from 'react';

import { toast } from 'react-toastify';

import { User } from '@tietokilta/ilmomasiina-models/src/services/users';
import { deleteUser, getUsers } from '../../modules/admin/actions';
import { useTypedDispatch } from '../../store/reducers';

type Props = {
  user: User.List.User;
};

const AdminUserListItem = ({ user }: Props) => {
  const dispatch = useTypedDispatch();

  async function onDelete(e: MouseEvent) {
    e.preventDefault();
    const confirmed = window.confirm(
      'Haluatko varmasti poistaa tämän käyttäjän? Tätä toimintoa ei voi perua.',
    );
    if (confirmed) {
      const success = await dispatch(deleteUser(user.id));
      if (!success) {
        toast.error('Poisto epäonnistui :(', { autoClose: 2000 });
      }
      dispatch(getUsers());
    }
  }

  return (
    <tr>
      <td>{user.email}</td>
      <td>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={onDelete} role="button">Poista käyttäjä</a>
      </td>
    </tr>
  );
};

export default AdminUserListItem;
