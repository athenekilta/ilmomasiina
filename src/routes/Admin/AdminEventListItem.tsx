import React, { MouseEvent } from 'react';

import _ from 'lodash';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AdminEvent } from '../../api/adminEvents';
import Separator from '../../components/Separator';
import { deleteEvent, getAdminEvents } from '../../modules/admin/actions';
import { useTypedDispatch } from '../../store/reducers';

type Props = {
  event: AdminEvent.List.Event;
};

const AdminEventListItem = ({ event }: Props) => {
  const dispatch = useTypedDispatch();

  async function onDelete(e: MouseEvent) {
    e.preventDefault();
    const confirmed = window.confirm(
      'Haluatko varmasti poistaa tämän tapahtuman? Tätä toimintoa ei voi perua.',
    );
    if (confirmed) {
      const success = await dispatch(deleteEvent(event.id));
      if (!success) {
        toast.error('Poisto epäonnistui :(', { autoClose: 2000 });
      }
      dispatch(getAdminEvents());
    }
  }

  let status;
  if (event.draft) {
    status = 'Luonnos';
  } else if (!event.listed) {
    status = 'Piilotettu';
  } else {
    status = 'Julkaistu';
  }

  return (
    <tr>
      <td>
        <Link to={`${PREFIX_URL}/event/${event.id}`}>{event.title}</Link>
      </td>
      <td>{event.date ? moment(event.date).format('DD.MM.YYYY') : ''}</td>
      <td>{status}</td>
      <td>{_.sum(_.map(event.quota, 'signupCount'))}</td>
      <td>
        <Link to={`${PREFIX_URL}/admin/edit/${event.id}`}>
          Muokkaa tapahtumaa
        </Link>

        <Separator />

        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={onDelete} role="button">
          Poista tapahtuma
        </a>
      </td>
    </tr>
  );
};

export default AdminEventListItem;
