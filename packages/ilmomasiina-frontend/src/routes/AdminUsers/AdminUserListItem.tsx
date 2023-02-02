import React from 'react';

import { Button, ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import type { UserSchema } from '@tietokilta/ilmomasiina-models';
import { deleteUser, getUsers, resetUserPassword } from '../../modules/adminUsers/actions';
import { useTypedDispatch } from '../../store/reducers';

type Props = {
  user: UserSchema;
};

const AdminUserListItem = ({ user }: Props) => {
  const dispatch = useTypedDispatch();

  async function onDelete() {
    const confirmed = window.confirm(
      'Haluatko varmasti poistaa tämän käyttäjän? Tätä toimintoa ei voi perua.',
    );
    if (confirmed) {
      const success = await dispatch(deleteUser(user.id));
      if (!success) {
        toast.error('Poisto epäonnistui :(', { autoClose: 5000 });
      }
      dispatch(getUsers());
    }
  }
  async function onResetPassword() {
    const confirmed = window.confirm(
      'Haluatko varmasti nollata käyttäjän salasanan? Uusi salasana lähetetään käyttäjän sähköpostiin.',
    );
    if (confirmed) {
      const success = await dispatch(resetUserPassword(user.id));
      if (!success) {
        toast.error('Salasanan nollaaminen epäonnistui :(', { autoClose: 5000 });
      } else {
        toast.success('Salasanan nollaaminen onnistui :)', { autoClose: 5000 });
      }
    }
  }
  return (
    <tr>
      <td>{user.email}</td>
      <td>
        <ButtonGroup size="sm">
          <Button type="button" onClick={onResetPassword} size="sm" variant="secondary">Nollaa salasana</Button>
          <Button type="button" onClick={onDelete} size="sm" variant="danger">Poista käyttäjä</Button>
        </ButtonGroup>
      </td>
    </tr>
  );
};

export default AdminUserListItem;
